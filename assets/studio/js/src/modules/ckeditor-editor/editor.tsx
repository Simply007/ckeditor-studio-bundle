import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  Alignment,
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
  Fullscreen,
  GeneralHtmlSupport,
  Heading,
  Image,
  ImageResize,
  Indent,
  Italic,
  Link,
  List,
  Paragraph,
  SourceEditing,
  Table,
  TableToolbar,
  Underline,
  type EditorConfig
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'
import { type WysiwygEditorRef } from '@pimcore/studio-ui-bundle/modules/wysiwyg'
import { type DragAndDropInfo, createImageThumbnailUrl } from '@pimcore/studio-ui-bundle/components'
import { toCssDimension } from '@pimcore/studio-ui-bundle/utils'
import { useTranslation } from '@pimcore/studio-ui-bundle/app'
import { useOptionalElementContext } from '@pimcore/studio-ui-bundle/modules/element'
import { getStudioSettings } from './settings'
import {
  EMPTY_PREMIUM_EXTENSIONS,
  isPremiumRequested,
  loadPremiumExtensions,
  type PremiumExtensions
} from './premium'

interface EditorProps {
  defaultValue?: string
  onTextChange?: (html: string) => void
  maxCharacters?: number
  editorConfig?: Record<string, any>
  placeholder?: string
  readOnly?: boolean
  /**
   * Pimcore field name, when the surrounding integration provides one (data
   * object fields do, document editables do not). Used to derive the
   * collaboration channel id.
   */
  fieldName?: string
}

const Editor = forwardRef<WysiwygEditorRef, EditorProps>(
  ({
    defaultValue = '',
    onTextChange,
    maxCharacters,
    editorConfig,
    placeholder = '',
    readOnly = false,
    fieldName
  },
  ref): React.JSX.Element => {
    const { t } = useTranslation()

    const editorInstanceRef = useRef<ClassicEditor | null>(null)
    // The last HTML this editor emitted via onChange. Used to tell apart
    // "value came back from our own onChange" from "value changed externally".
    const lastEmittedRef = useRef<string | null>(null)

    useImperativeHandle(ref, (): WysiwygEditorRef => ({
      onDrop: (info: DragAndDropInfo): void => {
        const editor = editorInstanceRef.current
        if (editor !== null) {
          onDropWysiwyg(editor, info)
        }
      }
    }))

    // License key, toolbar preset and premium gates come from the Symfony bundle
    // config at runtime (data-app-config); defaults apply when it is absent.
    const settings = useMemo(getStudioSettings, [])
    // True only when a license key is configured AND a premium gate is enabled
    // (logs the "no key" warning otherwise, matching the previous behavior).
    const premiumRequested = useMemo(() => isPremiumRequested(settings), [settings])

    // The open Pimcore element (type + id), when this editor renders inside one.
    const elementContext = useOptionalElementContext()
    const presenceListRef = useRef<HTMLDivElement | null>(null)

    // Premium path: the extensions resolve asynchronously (dynamic import) and
    // the editor mounts once they are in. Free path: resolved synchronously on
    // first render with the empty extensions, so the editor initializes exactly
    // as before and no premium chunk is ever requested.
    const [premium, setPremium] = useState<PremiumExtensions | null>(
      premiumRequested ? null : EMPTY_PREMIUM_EXTENSIONS
    )

    useEffect(() => {
      if (!premiumRequested) {
        return
      }

      // Collaboration channel id: an explicit per-field
      // editorConfig.collaboration.channelId wins; the default derives from the
      // open element (type + id) and the field name, so every field of every
      // element collaborates on its own channel.
      const explicitChannelId: unknown = (editorConfig?.collaboration as { channelId?: unknown } | undefined)?.channelId
      let channelId: string | null = null
      if (typeof explicitChannelId === 'string' && explicitChannelId !== '') {
        channelId = explicitChannelId
      } else if (elementContext !== null && fieldName !== undefined && fieldName !== '') {
        channelId = `pimcore-${elementContext.elementType}-${elementContext.id}-${fieldName}`
      }

      let cancelled = false
      loadPremiumExtensions(settings, { channelId, presenceListContainer: presenceListRef.current })
        .then((extensions) => {
          if (!cancelled) {
            setPremium(extensions)
          }
        })
        .catch((error) => {
          console.error('[ckeditor-studio-bundle] Loading ckeditor5-premium-features failed; falling back to the free feature set.', error)
          if (!cancelled) {
            setPremium(EMPTY_PREMIUM_EXTENSIONS)
          }
        })

      return () => {
        cancelled = true
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // The config is created once per mount (null while premium extensions are
    // still loading). The CKEditor React component does not react to config
    // changes after initialization anyway.
    const config = useMemo((): EditorConfig | null => {
      if (premium === null) {
        return null
      }

      return {
        // 'GPL' (open source feature set) unless a license key is configured.
        licenseKey: settings.licenseKey,
        plugins: [
          Essentials,
          Paragraph,
          Heading,
          Bold,
          Italic,
          Underline,
          Alignment,
          Link,
          List,
          Indent,
          BlockQuote,
          Table,
          TableToolbar,
          Image,
          ImageResize,
          SourceEditing,
          GeneralHtmlSupport,
          Fullscreen,
          ...premium.plugins
        ],
        toolbar: premium.toolbarItems.length === 0
          ? settings.toolbar
          : [
              ...settings.toolbar,
              '|',
              ...premium.toolbarItems.filter((item) => !settings.toolbar.includes(item))
            ],
        table: {
          contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
        },
        // Preserve Pimcore's element-reference attributes and generic class/id/style
        // attributes on loaded content (mirrors the Parchment attributors that
        // pimcore/quill-bundle registers).
        htmlSupport: {
          allow: [
            {
              name: /^.*$/,
              attributes: ['pimcore_id', 'pimcore_type', 'pimcore_disable_thumbnail', 'id'],
              classes: true,
              styles: true
            }
          ]
        },
        initialData: defaultValue,
        ...(placeholder !== '' ? { placeholder } : {}),
        // Premium feature config (AI, real-time collaboration) when a license
        // key is configured and the gates are enabled; empty otherwise.
        ...premium.config,
        // Per-field editor configuration from Pimcore (editable / field definition,
        // merged with pimcore_studio_ui.wysiwyg default_editor_config by Studio core).
        // Note: in Pimcore 2026.x this is written for Quill; CKEditor ignores unknown
        // keys, and genuine CKEditor options passed here win over the defaults above.
        ...(editorConfig ?? {})
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [premium])

    useEffect(() => {
      const editor = editorInstanceRef.current
      if (editor === null) {
        return
      }

      // With real-time collaboration the document state lives in Cloud Services
      // and is synchronized by the RealTimeCollaborativeEditing plugin;
      // overwriting it from the outside would fork the shared state.
      if (premium?.realtimeCollaborationActive === true) {
        return
      }

      if (defaultValue !== lastEmittedRef.current && defaultValue !== editor.getData()) {
        editor.setData(defaultValue)
      }
    }, [defaultValue, premium])

    const handleReady = (editor: ClassicEditor): void => {
      editorInstanceRef.current = editor
      checkCharCount(editor, editor.getData())
    }

    const handleChange = (_event: unknown, editor: ClassicEditor): void => {
      const html = editor.getData()
      lastEmittedRef.current = html
      onTextChange?.(html)
      checkCharCount(editor, html)
    }

    return (
      <>
        { /* Presence list container: rendered only on the premium RTC path, so the free DOM stays unchanged. */ }
        { premiumRequested && settings.premium.realtimeCollaboration.enabled && (
          <div
            className="ckeditor-presence-list"
            ref={ presenceListRef }
          />
        ) }
        { config !== null && (
          <CKEditor
            config={ config }
            disabled={ readOnly }
            editor={ ClassicEditor }
            onChange={ handleChange }
            onReady={ handleReady }
          />
        ) }
      </>
    )

    function checkCharCount (editor: ClassicEditor, html: string): void {
      const domRoot = editor.editing.view.getDomRoot()
      if (domRoot === undefined) {
        return
      }

      domRoot.style.border = ''
      domRoot.setAttribute('title', '')

      const charCount = html.replace(/<[^>]*>/g, '').length
      if (typeof maxCharacters === 'number' && maxCharacters !== 0 && charCount > maxCharacters) {
        domRoot.style.border = '1px solid red'
        domRoot.setAttribute('title', t('maximum_length_is') + ' ' + String(maxCharacters))
      }
    }

    function insertHtml (editor: ClassicEditor, html: string): void {
      const viewFragment = editor.data.processor.toView(html)
      const modelFragment = editor.data.toModel(viewFragment)
      editor.model.insertContent(modelFragment)
    }

    function escapeAttribute (value: string): string {
      return value
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }

    function insertElementLink (editor: ClassicEditor, uri: string, id: unknown, type?: string): void {
      const selection = editor.model.document.selection
      if (!selection.isCollapsed) {
        // Text is selected: turn it into a link. Demo limitation: the pimcore_id /
        // pimcore_type attributes are not applied to an existing selection here.
        editor.execute('link', uri)
        return
      }

      const typeAttr = type !== undefined ? ` pimcore_type="${escapeAttribute(type)}"` : ''
      insertHtml(
        editor,
        `<a href="${escapeAttribute(uri)}" pimcore_id="${escapeAttribute(String(id))}"${typeAttr}>${escapeAttribute(uri)}</a>`
      )
    }

    function onDropWysiwyg (editor: ClassicEditor, info: DragAndDropInfo): void {
      const data = info.data as Record<string, any>

      const id = data.id
      let uri = data.fullPath as string
      const browserPossibleExtensions = ['jpg', 'jpeg', 'gif', 'png']
      const textIsSelected = !editor.model.document.selection.isCollapsed

      if (info.type === 'asset') {
        if (data.type === 'image' && !textIsSelected) {
          // Images bigger than 600px, or formats the browser cannot display directly,
          // are routed through the Pimcore thumbnailing service (mirrors quill-bundle).
          const defaultWidth = 600
          let width: number = defaultWidth
          let disableThumbnail = false

          if (typeof data.width !== 'undefined') {
            uri = createImageThumbnailUrl(id as number, {
              width: defaultWidth,
              mimeType: 'JPEG'
            })

            if (data.width < defaultWidth &&
                browserPossibleExtensions.includes(getFileExtension(data.fullPath as string))) {
              uri = data.fullPath as string
              disableThumbnail = true
            }

            if (data.width < defaultWidth) {
              width = data.width as number
            }
          }

          const attrs = [
            `src="${escapeAttribute(uri)}"`,
            'alt="asset_image"',
            `style="width:${toCssDimension(width)};"`,
            `pimcore_id="${escapeAttribute(String(id))}"`,
            'pimcore_type="asset"'
          ]
          if (disableThumbnail) {
            attrs.push('pimcore_disable_thumbnail="true"')
          }

          insertHtml(editor, `<img ${attrs.join(' ')}>`)
          return
        }

        insertElementLink(editor, uri, id, 'asset')
        return
      }

      if (data.elementType === 'document' && (data.type === 'page' ||
          data.type === 'hardlink' || data.type === 'link')) {
        insertElementLink(editor, uri, id, 'document')
        return
      }

      if (data.elementType === 'object') {
        insertElementLink(editor, uri, id, 'object')
        return
      }

      insertElementLink(editor, uri, id)
    }

    function getFileExtension (filename: string): string {
      const extensionP = filename.split('.')
      return extensionP[extensionP.length - 1].toLowerCase()
    }
  }
)

Editor.displayName = 'Editor'

export default Editor
