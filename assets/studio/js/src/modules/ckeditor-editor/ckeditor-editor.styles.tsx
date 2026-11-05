import { createStyles } from 'antd-style'

export const useStyles = createStyles(({ css, token }) => {
  return {
    editor: css`
      border: 1px solid ${token.colorBorder};
      border-radius: ${token.borderRadius}px;
      min-height: 100px;
      min-width: 200px;
      background-color: ${token.colorBgContainer};
      cursor: text;
      display: flex;
      overflow: hidden;
      flex-direction: column;
      /* Keeps the bottom border off the edge of Studio's scroll container. */
      margin-bottom: ${token.marginXS}px;

      /* Presence list (premium RTC) keeps its height when the editor is capped. */
      > .ckeditor-presence-list {
        flex-shrink: 0;
      }

      /* min-height: 0 lets the flex chain shrink below the content height, so a
         capped wrapper (max-height) scrolls inside the editable while the
         toolbar stays visible. */
      .ck.ck-editor {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0;
      }

      .ck.ck-editor__top {
        flex-shrink: 0;
      }

      .ck.ck-editor__main {
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
      }

      .ck.ck-toolbar,
      .ck.ck-editor__editable_inline {
        border: none;
      }

      .ck.ck-toolbar {
        border-bottom: 1px solid ${token.colorBorder};
      }

      .ck.ck-editor__editable_inline.ck-read-only {
        background-color: ${token.colorBgContainerDisabled};
        cursor: not-allowed;
      }
    `,
    'editor-document': css`
      min-height: 100px;
      min-width: 200px;
      cursor: text;
      display: flex;
      overflow: hidden;
      flex-direction: column;

      > .ckeditor-presence-list {
        flex-shrink: 0;
      }

      /* Same shrinkable flex chain as data object fields: an editable with a
         configured height scrolls inside the editing area instead of clipping. */
      .ck.ck-editor {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0;
      }

      .ck.ck-editor__top {
        flex-shrink: 0;
      }

      .ck.ck-editor__main {
        flex: 1 1 auto;
        min-height: 0;
        overflow: auto;
      }

      .ck.ck-toolbar {
        border: 1px solid ${token.colorBorder};
        border-top-left-radius: ${token.borderRadius}px;
        border-top-right-radius: ${token.borderRadius}px;
      }

      .ck.ck-editor__editable_inline {
        border-left: 1px solid ${token.colorBorder};
        border-right: 1px solid ${token.colorBorder};
        border-bottom: 1px solid ${token.colorBorder};
        border-bottom-left-radius: ${token.borderRadius}px;
        border-bottom-right-radius: ${token.borderRadius}px;
      }
    `,
    'editor-inline': css`
      min-width: 200px;
      cursor: text;
      overflow: auto;

      /* The text keeps the page's own typography; only a light frame marks the
         editable area, stronger while focused. */
      .ck.ck-editor__editable_inline {
        padding: 0 ${token.paddingXS}px;
        border: 1px dashed transparent;
        border-radius: ${token.borderRadius}px;
        color: inherit;
        font: inherit;
        background: transparent;
      }

      .ck.ck-editor__editable_inline:hover {
        border-color: ${token.colorBorder};
      }

      .ck.ck-editor__editable_inline.ck-focused {
        border: 1px solid ${token.colorPrimary};
        box-shadow: none;
      }

      .ck.ck-editor__editable_inline.ck-read-only {
        cursor: not-allowed;
      }
    `
  }
})
