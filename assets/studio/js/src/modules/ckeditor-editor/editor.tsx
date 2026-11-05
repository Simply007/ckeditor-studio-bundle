import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  Alignment,
  BlockQuote,
  Bold,
  ClassicEditor,
  Essentials,
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
import { getStudioSettings } from './settings'
import { resolvePremiumExtensions } from './premium'

interface EditorProps {
  defaultValue?: string
  onTextChange?: (html: string) => void
  maxCharacters?: number
  editorConfig?: Record<string, any>
  placeholder?: string
  readOnly?: boolean
}

const Editor = forwardRef<WysiwygEditorRef, EditorProps>(
  ({
    defaultValue = '',
    onTextChange,
    maxCharacters,
    editorConfig,
    placeholder = '',
    readOnly = false
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

    // The config is created once per mount. The CKEditor React component does not
    // react to config changes after initialization anyway.
    const config = useMemo((): EditorConfig => {
      // License key, toolbar preset and premium gates come from the Symfony bundle
      // config at runtime (data-app-config); defaults apply when it is absent.
      const settings = getStudioSettings()
      const premium = resolvePremiumExtensions(settings)

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
          ...premium.plugins
        ],
        toolbar: settings.toolbar,
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
        // Premium feature config (scaffolded; empty until premium.ts is wired up).
        ...premium.config,
        // Per-field editor configuration from Pimcore (editable / field definition,
        // merged with pimcore_studio_ui.wysiwyg default_editor_config by Studio core).
        // Note: in Pimcore 2026.x this is written for Quill; CKEditor ignores unknown
        // keys, and genuine CKEditor options passed here win over the defaults above.
        ...(editorConfig ?? {})
      }
    }, [])

    useEffect(() => {
      const editor = editorInstanceRef.current
      if (editor === null) {
        return
      }

      if (defaultValue !== lastEmittedRef.current && defaultValue !== editor.getData()) {
        editor.setData(defaultValue)
      }
    }, [defaultValue])

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
      <CKEditor
        config={ config }
        disabled={ readOnly }
        editor={ ClassicEditor }
        onChange={ handleChange }
        onReady={ handleReady }
      />
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
