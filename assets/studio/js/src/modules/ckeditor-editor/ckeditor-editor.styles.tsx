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

      .ck.ck-editor {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }

      .ck.ck-editor__main {
        flex-grow: 1;
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

      .ck.ck-editor {
        width: 100%;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }

      .ck.ck-editor__main {
        flex-grow: 1;
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
    `
  }
})
