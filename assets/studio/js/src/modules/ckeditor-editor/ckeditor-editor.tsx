import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { type WysiwygEditorRef, type WysiwygProps, WysiwygContext } from '@pimcore/studio-ui-bundle/modules/wysiwyg'
import { toCssDimension } from '@pimcore/studio-ui-bundle/utils'
import { type DragAndDropInfo } from '@pimcore/studio-ui-bundle/components'
import { useStyles } from './ckeditor-editor.styles'
import Editor from './editor'

/** Default height cap for data object fields that configure no height. */
const DATA_OBJECT_DEFAULT_MAX_HEIGHT = '70vh'

export const CKEditorEditor = forwardRef<WysiwygEditorRef, WysiwygProps>(({
  value,
  onChange,
  disabled,
  width,
  height,
  maxCharacters,
  placeholder,
  editorConfig,
  context,
  ...untypedProps
}, ref): React.JSX.Element => {
  const editorRef = useRef<WysiwygEditorRef>(null)
  const { styles } = useStyles()

  // Pimcore spreads the full field definition into the wysiwyg component for
  // data object fields, so the field identity arrives at runtime although it is
  // not part of WysiwygProps: `combinedFieldName` (string, dotted for nested
  // fields such as localized fields or blocks) and `name` (a form path ARRAY,
  // for example ['content'], not a string). Document editables pass neither.
  // Used to derive the collaboration channel id.
  const fieldName = resolveFieldName(untypedProps as Record<string, unknown>)

  useImperativeHandle(ref, (): WysiwygEditorRef => ({
    onDrop: (info: DragAndDropInfo): void => {
      editorRef.current?.onDrop(info)
    }
  }))

  const handleChange = (editorHtml: string): void => {
    if (onChange !== undefined && onChange !== null) {
      onChange(editorHtml)
    }
  }

  const isDocument = context === WysiwygContext.DOCUMENT
  // Data object fields without a configured height would grow with the content
  // (no internal scrolling, toolbar scrolls away). Cap them at a viewport share;
  // a height set on the field definition always wins. Document editables keep
  // their natural height (they sit in the page layout).
  const maxHeight = toCssDimension(height) ?? (isDocument ? undefined : DATA_OBJECT_DEFAULT_MAX_HEIGHT)

  return (
    <div
      className={ ['ckeditor-editor', isDocument ? styles['editor-document'] : styles.editor].join(' ') }
      style={ { maxWidth: toCssDimension(width), maxHeight } }
    >
      <Editor
        defaultValue={ value ?? '' }
        editorConfig={ editorConfig }
        fieldName={ fieldName }
        maxCharacters={ maxCharacters }
        onTextChange={ handleChange }
        placeholder={ placeholder }
        readOnly={ disabled }
        ref={ editorRef }
      />
    </div>
  )
})

function resolveFieldName (props: Record<string, unknown>): string | undefined {
  const combined = props.combinedFieldName
  if (typeof combined === 'string' && combined !== '') {
    return combined
  }

  const name = props.name
  if (Array.isArray(name) && name.length > 0) {
    return name.map(String).join('.')
  }

  return typeof name === 'string' && name !== '' ? name : undefined
}

CKEditorEditor.displayName = 'CKEditorEditor'
export default CKEditorEditor
