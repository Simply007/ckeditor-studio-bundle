import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  Alignment,
  BlockQuote,
  Bold,
  ClassicEditor,
  type Editor as EditorInstance,
  Essentials,
  Fullscreen,
  GeneralHtmlSupport,
  Heading,
  Image,
  ImageResize,
  Indent,
  InlineEditor,
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

export type EditorType = 'classic' | 'inline'

interface EditorProps {
  /**
   * 'classic' (toolbar above a framed editing area) or 'inline' (the text is
   * edited in place in the page layout, the toolbar floats while focused).
   */
  editorType?: EditorType
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
  /** Human readable field title (data object field definitions carry one). */
  fieldTitle?: string
}

const Editor = forwardRef<WysiwygEditorRef, EditorProps>(
  ({
    editorType = 'classic',
    defaultValue = '',
    onTextChange,
    maxCharacters,
    editorConfig,
    placeholder = '',
    readOnly = false,
    fieldName,
    fieldTitle
  },
  ref): React.JSX.Element => {
    const { t } = useTranslation()

    const editorInstanceRef = useRef<EditorInstance | null>(null)
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
    // DOM anchor of this editor on the premium path: finds the document
    // editable around it and the scroll container for the docked AI panel.
    const anchorRef = useRef<HTMLSpanElement | null>(null)

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

      // Which element and field this editor edits. Data object fields get both
      // from Studio (element context hook + field props); document editables
      // render in the editmode iframe, where the element context hook returns
      // null and no field name is passed, so both come from the iframe page:
      // window.pimcore_document_id and the #pimcore_editable_<name> container.
      const identity = resolveIdentity(anchorRef.current, elementContext, fieldName, fieldTitle)

      // Collaboration channel id: an explicit per-field
      // editorConfig.collaboration.channelId wins; the default derives from the
      // element (type + id) and the field name, so every field of every
      // element collaborates on its own channel.
      const explicitChannelId: unknown = (editorConfig?.collaboration as { channelId?: unknown } | undefined)?.channelId
      let channelId: string | null = null
      if (typeof explicitChannelId === 'string' && explicitChannelId !== '') {
        channelId = explicitChannelId
      } else if (identity.element !== null && identity.field !== null) {
        channelId = `pimcore-${identity.element.type}-${identity.element.id}-${identity.field.name}`
      }

      let cancelled = false
      let loaded: PremiumExtensions | null = null
      loadPremiumExtensions(settings, {
        channelId,
        presenceListContainer: presenceListRef.current,
        element: identity.element,
        anchor: anchorRef.current,
        root: identity.field !== null && identity.element !== null
          ? {
              title: identity.field.title,
              description: `Rich text ${identity.field.kind} "${identity.field.name}" of the Pimcore ${identity.element.type.replace('-', ' ')} with id ${identity.element.id}.`
            }
          : null
      })
        .then((extensions) => {
          if (cancelled) {
            extensions.release?.()
            return
          }
          loaded = extensions
          setPremium(extensions)
        })
        .catch((error) => {
          console.error('[ckeditor-studio-bundle] Loading ckeditor5-premium-features failed; falling back to the free feature set.', error)
          if (!cancelled) {
            setPremium(EMPTY_PREMIUM_EXTENSIONS)
          }
        })

      return () => {
        cancelled = true
        // Drops this editor's reference on the element's shared AI Context;
        // the last editor of the element (tab closed) destroys it.
        loaded?.release?.()
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

      // Fullscreen supports only the classic and decoupled editor types.
      const isInline = editorType === 'inline'
      const toolbar = isInline ? settings.toolbar.filter((item) => item !== 'fullscreen') : settings.toolbar

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
          ...(isInline ? [] : [Fullscreen]),
          ...premium.plugins
        ],
        toolbar: {
          items: premium.toolbarItems.length === 0
            ? toolbar
            : [
                ...toolbar,
                '|',
                ...premium.toolbarItems.filter((item) => !toolbar.includes(item))
              ],
          // The floating toolbar is as wide as the editable; in narrow page
          // columns grouping would hide nearly every button behind the overflow menu.
          shouldNotGroupWhenFull: isInline
        },
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

    const handleReady = (editor: EditorInstance): void => {
      editorInstanceRef.current = editor
      syncRootTitle(editor)
      checkCharCount(editor, editor.getData())
    }

    const handleChange = (_event: unknown, editor: EditorInstance): void => {
      const html = editor.getData()
      lastEmittedRef.current = html
      onTextChange?.(html)
      checkCharCount(editor, html)
    }

    return (
      <>
        { /* Anchor and presence list container: rendered only on the premium path, so the free DOM stays unchanged. */ }
        { premiumRequested && <span hidden ref={ anchorRef } /> }
        { premiumRequested && settings.premium.realtimeCollaboration.enabled && (
          <div
            className="ckeditor-presence-list"
            ref={ presenceListRef }
          />
        ) }
        { config !== null && (
          editorType === 'inline'
            ? (
              <CKEditor
                config={ config }
                disabled={ readOnly }
                editor={ InlineEditor }
                onChange={ handleChange }
                onReady={ handleReady }
              />
              )
            : (
              <CKEditor
                config={ config }
                disabled={ readOnly }
                editor={ ClassicEditor }
                onChange={ handleChange }
                onReady={ handleReady }
              />
              )
        ) }
      </>
    )

    function checkCharCount (editor: EditorInstance, html: string): void {
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

    function insertHtml (editor: EditorInstance, html: string): void {
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

    function insertElementLink (editor: EditorInstance, uri: string, id: unknown, type?: string): void {
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

    function onDropWysiwyg (editor: EditorInstance, info: DragAndDropInfo): void {
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

/**
 * CKEditor stores config.root.title / description as root attributes and syncs
 * them through real-time collaboration, so for a collaboration channel that
 * already existed before titles were configured, the stored document state
 * wins and the root ends up without a title (CKEditor AI then cannot tell the
 * fields apart). Re-apply the configured values once the editor is ready; with
 * RTC the fix syncs to the channel. Root attributes are not part of getData(),
 * so the field value does not change.
 */
function syncRootTitle (editor: EditorInstance): void {
  const configured = (editor.config.get('roots') as Record<string, { title?: unknown, description?: unknown }> | undefined)?.main
  const title = typeof configured?.title === 'string' ? configured.title : null
  const description = typeof configured?.description === 'string' ? configured.description : null
  if (title === null && description === null) {
    return
  }

  const root = editor.model.document.getRoot()
  if (root === null || (root.getAttribute('$title') === (title ?? undefined) && root.getAttribute('$description') === (description ?? undefined))) {
    return
  }

  editor.model.enqueueChange({ isUndoable: false }, (writer) => {
    if (title !== null) {
      writer.setAttribute('$title', title, root)
    }
    if (description !== null) {
      writer.setAttribute('$description', description, root)
    }
  })
}

interface EditorIdentity {
  element: { type: string, id: number | string } | null
  field: { name: string, title: string, kind: 'field' | 'editable' } | null
}

function resolveIdentity (
  anchor: HTMLElement | null,
  elementContext: { id: number, elementType: string } | null,
  fieldName: string | undefined,
  fieldTitle: string | undefined
): EditorIdentity {
  let element: EditorIdentity['element'] = null
  if (elementContext !== null) {
    element = { type: String(elementContext.elementType), id: elementContext.id }
  } else if (anchor !== null) {
    const documentId: unknown = (anchor.ownerDocument.defaultView as unknown as Record<string, unknown> | null)?.pimcore_document_id
    if ((typeof documentId === 'number' || typeof documentId === 'string') && String(documentId) !== '') {
      element = { type: 'document', id: documentId }
    }
  }

  if (fieldName !== undefined && fieldName !== '') {
    return { element, field: { name: fieldName, title: fieldTitle !== undefined && fieldTitle !== '' ? fieldTitle : humanize(fieldName), kind: 'field' } }
  }

  const editable = anchor?.closest<HTMLElement>('.pimcore_editable[id^="pimcore_editable_"]') ?? null
  if (editable !== null) {
    // The id carries block suffixes (unique per block item), data-real-name the plain name.
    const name = editable.id.slice('pimcore_editable_'.length)
    const realName = editable.dataset.realName ?? editable.dataset.name ?? name
    return { element, field: { name, title: humanize(realName), kind: 'editable' } }
  }

  return { element, field: null }
}

/** found_resources / featureText1 -> "Found resources" / "Feature text 1". */
function humanize (name: string): string {
  const words = name
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
    .trim()
    .toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

Editor.displayName = 'Editor'

export default Editor
