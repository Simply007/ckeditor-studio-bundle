import React, { forwardRef, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import { type WysiwygEditorRef, type WysiwygProps, WysiwygContext } from '@pimcore/studio-ui-bundle/modules/wysiwyg'
import { toCssDimension } from '@pimcore/studio-ui-bundle/utils'
import { type DragAndDropInfo } from '@pimcore/studio-ui-bundle/components'
import { useStyles } from './ckeditor-editor.styles'
import Editor from './editor'

/** Upper bound for data object fields that configure no height, as a viewport share. */
const DATA_OBJECT_MAX_VIEWPORT_SHARE = 0.7
/** Never shrink an uncapped field below this, even in a short panel. */
const DATA_OBJECT_MIN_HEIGHT_PX = 320
/** Gap kept between the editor's bottom border and the panel edge. */
const PANEL_BOTTOM_GAP_PX = 16

function findScrollContainer (element: HTMLElement): HTMLElement | null {
  let current = element.parentElement
  while (current !== null) {
    if (/(auto|scroll)/.test(getComputedStyle(current).overflowY)) {
      return current
    }
    current = current.parentElement
  }
  return null
}

/**
 * Height cap that keeps the whole editor (toolbar, text, bottom border) inside
 * Studio's scrollable panel, so the text scrolls inside the editor instead of
 * running below the fold. Measured from the editor's position in the panel and
 * recalculated when the panel or the window resizes.
 */
function useFitToPanel (enabled: boolean): [React.RefObject<HTMLDivElement>, number | undefined] {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined)

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current
    if (!enabled || wrapper === null) {
      setMaxHeight(undefined)
      return
    }
    const panel = findScrollContainer(wrapper)

    const measure = (): void => {
      const viewportCap = Math.round(window.innerHeight * DATA_OBJECT_MAX_VIEWPORT_SHARE)
      if (panel === null || panel.clientHeight === 0) {
        setMaxHeight(viewportCap)
        return
      }
      const offsetInPanel = wrapper.getBoundingClientRect().top - panel.getBoundingClientRect().top + panel.scrollTop
      const spaceBelow = offsetInPanel < panel.clientHeight
        ? panel.clientHeight - offsetInPanel - PANEL_BOTTOM_GAP_PX
        : panel.clientHeight - 2 * PANEL_BOTTOM_GAP_PX
      setMaxHeight(Math.max(DATA_OBJECT_MIN_HEIGHT_PX, Math.min(viewportCap, spaceBelow)))
    }

    measure()
    const observer = new ResizeObserver(measure)
    if (panel !== null) {
      observer.observe(panel)
    }
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [enabled])

  return [wrapperRef, maxHeight]
}

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
  const configuredHeight = toCssDimension(height)
  // Data object fields without a configured height would grow with the content
  // (no internal scrolling, toolbar scrolls away), so they are fitted to Studio's
  // panel; a height set on the field definition always wins. Document editables
  // keep their natural height (they sit in the page layout).
  const [wrapperRef, fittedMaxHeight] = useFitToPanel(!isDocument && configuredHeight === undefined)
  const maxHeight = configuredHeight ?? fittedMaxHeight

  return (
    <div
      className={ ['ckeditor-editor', isDocument ? styles['editor-document'] : styles.editor].join(' ') }
      ref={ wrapperRef }
      style={ { maxWidth: toCssDimension(width), maxHeight } }
    >
      <Editor
        defaultValue={ value ?? '' }
        editorConfig={ editorConfig }
        fieldName={ fieldName }
        fieldTitle={ typeof (untypedProps as Record<string, unknown>).title === 'string' ? (untypedProps as Record<string, string>).title : undefined }
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
