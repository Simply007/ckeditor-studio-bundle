/*! For license information please see __federation_expose_default_export.13ceaca5.js.LICENSE.txt */
"use strict";(self.chunk_ckeditor_studio_bundle=self.chunk_ckeditor_studio_bundle||[]).push([["525"],{1020(e,t,o){var r=o(4803),i=Symbol.for("react.element"),l=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),n=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d={key:!0,ref:!0,__self:!0,__source:!0};function a(e,t,o){var r,a={},s=null,c=null;for(r in void 0!==o&&(s=""+o),void 0!==t.key&&(s=""+t.key),void 0!==t.ref&&(c=t.ref),t)l.call(t,r)&&!d.hasOwnProperty(r)&&(a[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps)void 0===a[r]&&(a[r]=t[r]);return{$$typeof:i,type:e,key:s,ref:c,props:a,_owner:n.current}}t.jsx=a,t.jsxs=a},4848(e,t,o){e.exports=o(1020)},1582(e,t,o){o.r(t),o.d(t,{CKEditorPlugin:()=>h});var r=o(2977),i=o(4781),l=o(2703),n=o(4848),d=o(4803),a=o(9869),s=o(8267);let c=(0,o(3066).createStyles)(e=>{let{css:t,token:o}=e;return{editor:t`
      border: 1px solid ${o.colorBorder};
      border-radius: ${o.borderRadius}px;
      min-height: 100px;
      min-width: 200px;
      background-color: ${o.colorBgContainer};
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
        border-bottom: 1px solid ${o.colorBorder};
      }

      .ck.ck-editor__editable_inline.ck-read-only {
        background-color: ${o.colorBgContainerDisabled};
        cursor: not-allowed;
      }
    `,"editor-document":t`
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
        border: 1px solid ${o.colorBorder};
        border-top-left-radius: ${o.borderRadius}px;
        border-top-right-radius: ${o.borderRadius}px;
      }

      .ck.ck-editor__editable_inline {
        border-left: 1px solid ${o.colorBorder};
        border-right: 1px solid ${o.colorBorder};
        border-bottom: 1px solid ${o.colorBorder};
        border-bottom-left-radius: ${o.borderRadius}px;
        border-bottom-right-radius: ${o.borderRadius}px;
      }
    `}});var u=o(6900),p=o(827),m=o(2696);let f=(0,d.forwardRef)((e,t)=>{let{defaultValue:o="",onTextChange:r,maxCharacters:l,editorConfig:a,placeholder:c="",readOnly:f=!1}=e,{t:g}=(0,i.useTranslation)(),b=(0,d.useRef)(null),h=(0,d.useRef)(null);(0,d.useImperativeHandle)(t,()=>({onDrop:e=>{let t=b.current;null!==t&&function(e,t){let o=t.data,r=o.id,i=o.fullPath,l=!e.model.document.selection.isCollapsed;if("asset"===t.type){if("image"===o.type&&!l){let t,l=600,n=!1;void 0!==o.width&&(i=(0,m.createImageThumbnailUrl)(r,{width:600,mimeType:"JPEG"}),o.width<600&&["jpg","jpeg","gif","png"].includes((t=o.fullPath.split("."))[t.length-1].toLowerCase())&&(i=o.fullPath,n=!0),o.width<600&&(l=o.width));let d=[`src="${k(i)}"`,'alt="asset_image"',`style="width:${(0,s.toCssDimension)(l)};"`,`pimcore_id="${k(String(r))}"`,'pimcore_type="asset"'];n&&d.push('pimcore_disable_thumbnail="true"'),x(e,`<img ${d.join(" ")}>`);return}w(e,i,r,"asset");return}"document"===o.elementType&&("page"===o.type||"hardlink"===o.type||"link"===o.type)?w(e,i,r,"document"):"object"===o.elementType?w(e,i,r,"object"):w(e,i,r)}(t,e)}}));let _=(0,d.useMemo)(()=>({licenseKey:"GPL",plugins:[p.Essentials,p.Paragraph,p.Heading,p.Bold,p.Italic,p.Underline,p.Alignment,p.Link,p.List,p.Indent,p.BlockQuote,p.Table,p.TableToolbar,p.Image,p.ImageResize,p.SourceEditing,p.GeneralHtmlSupport],toolbar:["undo","redo","|","heading","|","bold","italic","underline","|","alignment","|","bulletedList","numberedList","outdent","indent","|","blockQuote","link","insertTable","|","sourceEditing"],table:{contentToolbar:["tableColumn","tableRow","mergeTableCells"]},htmlSupport:{allow:[{name:/^.*$/,attributes:["pimcore_id","pimcore_type","pimcore_disable_thumbnail","id"],classes:!0,styles:!0}]},initialData:o,...""!==c?{placeholder:c}:{},...a??{}}),[]);return(0,d.useEffect)(()=>{let e=b.current;null!==e&&o!==h.current&&o!==e.getData()&&e.setData(o)},[o]),(0,n.jsx)(u.CKEditor,{config:_,disabled:f,editor:p.ClassicEditor,onChange:(e,t)=>{let o=t.getData();h.current=o,null==r||r(o),y(t,o)},onReady:e=>{b.current=e,y(e,e.getData())}});function y(e,t){let o=e.editing.view.getDomRoot();if(void 0===o)return;o.style.border="",o.setAttribute("title","");let r=t.replace(/<[^>]*>/g,"").length;"number"==typeof l&&0!==l&&r>l&&(o.style.border="1px solid red",o.setAttribute("title",g("maximum_length_is")+" "+String(l)))}function x(e,t){let o=e.data.processor.toView(t),r=e.data.toModel(o);e.model.insertContent(r)}function k(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function w(e,t,o,r){if(!e.model.document.selection.isCollapsed)return void e.execute("link",t);let i=void 0!==r?` pimcore_type="${k(r)}"`:"";x(e,`<a href="${k(t)}" pimcore_id="${k(String(o))}"${i}>${k(t)}</a>`)}});f.displayName="Editor";let g=(0,d.forwardRef)((e,t)=>{let{value:o,onChange:r,disabled:i,width:l,height:u,maxCharacters:p,placeholder:m,editorConfig:g,context:b}=e,h=(0,d.useRef)(null),{styles:_}=c();return(0,d.useImperativeHandle)(t,()=>({onDrop:e=>{var t;null==(t=h.current)||t.onDrop(e)}})),(0,n.jsx)("div",{className:["ckeditor-editor",b===a.WysiwygContext.DOCUMENT?_["editor-document"]:_.editor].join(" "),style:{maxWidth:(0,s.toCssDimension)(l),maxHeight:(0,s.toCssDimension)(u)},children:(0,n.jsx)(f,{defaultValue:o??"",editorConfig:g,maxCharacters:p,onTextChange:e=>{null!=r&&r(e)},placeholder:m,readOnly:i,ref:h})})});g.displayName="CKEditorEditor";let b={onInit:()=>{r.container.get(i.serviceIds["App/ComponentRegistry/ComponentRegistry"]).override({component:g,name:l.componentConfig.wysiwyg.editor.name})}};void 0!==(e=o.hmd(e)).hot&&e.hot.accept();let h={name:"ckeditor-studio-plugin",onInit:()=>{},onStartup:e=>{let{moduleSystem:t}=e;t.registerModule(b)}}}}]);