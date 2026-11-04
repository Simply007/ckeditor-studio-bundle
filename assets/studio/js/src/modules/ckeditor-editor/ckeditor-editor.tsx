import React, { forwardRef, useImperativeHandle, useRef } from 'react'
import { type WysiwygEditorRef, type WysiwygProps, WysiwygContext } from '@pimcore/studio-ui-bundle/modules/wysiwyg'
import { toCssDimension } from '@pimcore/studio-ui-bundle/utils'
import { type DragAndDropInfo } from '@pimcore/studio-ui-bundle/components'
import { useStyles } from './ckeditor-editor.styles'
import Editor from './editor'

export const CKEditorEditor = forwardRef<WysiwygEditorRef, WysiwygProps>(({
  value,
  onChange,
  disabled,
  width,
  height,
  maxCharacters,
  placeholder,
  editorConfig,
  context
}, ref): React.JSX.Element => {
  const editorRef = useRef<WysiwygEditorRef>(null)
  const { styles } = useStyles()

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

  return (
    <div
      className={ ['ckeditor-editor', context === WysiwygContext.DOCUMENT ? styles['editor-document'] : styles.editor].join(' ') }
      style={ { maxWidth: toCssDimension(width), maxHeight: toCssDimension(height) } }
    >
      <Editor
        defaultValue={ value ?? '' }
        editorConfig={ editorConfig }
        maxCharacters={ maxCharacters }
        onTextChange={ handleChange }
        placeholder={ placeholder }
        readOnly={ disabled }
        ref={ editorRef }
      />
    </div>
  )
})

CKEditorEditor.displayName = 'CKEditorEditor'
export default CKEditorEditor
