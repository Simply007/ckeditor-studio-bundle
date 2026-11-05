/*! For license information please see __federation_expose_default_export.b798d710.js.LICENSE.txt */
"use strict";(self.chunk_ckeditor_studio_bundle=self.chunk_ckeditor_studio_bundle||[]).push([["525"],{1020(e,t,o){var r=o(9673),i=Symbol.for("react.element"),l=(Symbol.for("react.fragment"),Object.prototype.hasOwnProperty),n=r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,a={key:!0,ref:!0,__self:!0,__source:!0};function d(e,t,o){var r,d={},s=null,u=null;for(r in void 0!==o&&(s=""+o),void 0!==t.key&&(s=""+t.key),void 0!==t.ref&&(u=t.ref),t)l.call(t,r)&&!a.hasOwnProperty(r)&&(d[r]=t[r]);if(e&&e.defaultProps)for(r in t=e.defaultProps)void 0===d[r]&&(d[r]=t[r]);return{$$typeof:i,type:e,key:s,ref:u,props:d,_owner:n.current}}t.jsx=d,t.jsxs=d},4848(e,t,o){e.exports=o(1020)},4276(e,t,o){o.r(t),o.d(t,{CKEditorPlugin:()=>_});var r=o(2977),i=o(4781),l=o(2703),n=o(4848),a=o(9673),d=o(9869),s=o(8267);let u=(0,o(2262).createStyles)(e=>{let{css:t,token:o}=e;return{editor:t`
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
    `}});var c=o(874),m=o(1543),p=o(2696);let b=["undo","redo","|","heading","|","bold","italic","underline","|","alignment","|","bulletedList","numberedList","outdent","indent","|","blockQuote","link","insertTable","|","sourceEditing"],f={},g="[ckeditor-studio-bundle]",h=(0,a.forwardRef)((e,t)=>{let{defaultValue:o="",onTextChange:r,maxCharacters:l,editorConfig:d,placeholder:u="",readOnly:h=!1}=e,{t:y}=(0,i.useTranslation)(),k=(0,a.useRef)(null),_=(0,a.useRef)(null);(0,a.useImperativeHandle)(t,()=>({onDrop:e=>{let t=k.current;null!==t&&function(e,t){let o=t.data,r=o.id,i=o.fullPath,l=!e.model.document.selection.isCollapsed;if("asset"===t.type){if("image"===o.type&&!l){let t,l=600,n=!1;void 0!==o.width&&(i=(0,p.createImageThumbnailUrl)(r,{width:600,mimeType:"JPEG"}),o.width<600&&["jpg","jpeg","gif","png"].includes((t=o.fullPath.split("."))[t.length-1].toLowerCase())&&(i=o.fullPath,n=!0),o.width<600&&(l=o.width));let a=[`src="${v(i)}"`,'alt="asset_image"',`style="width:${(0,s.toCssDimension)(l)};"`,`pimcore_id="${v(String(r))}"`,'pimcore_type="asset"'];n&&a.push('pimcore_disable_thumbnail="true"'),C(e,`<img ${a.join(" ")}>`);return}$(e,i,r,"asset");return}"document"===o.elementType&&("page"===o.type||"hardlink"===o.type||"link"===o.type)?$(e,i,r,"document"):"object"===o.elementType?$(e,i,r,"object"):$(e,i,r)}(t,e)}}));let x=(0,a.useMemo)(()=>{var e,t,r,l,n,a,s,c,p,h;let y,k,_,x={licenseKey:(k="string"==typeof(y=i.appConfig.ckeditorStudio??{}).licenseKey&&""!==y.licenseKey?y.licenseKey:null)??"GPL",hasLicenseKey:null!==k,toolbar:Array.isArray(_=y.toolbar)&&_.length>0&&_.every(e=>"string"==typeof e)?y.toolbar:b,premium:{ai:{enabled:(null==(t=y.premium)||null==(e=t.ai)?void 0:e.enabled)===!0,config:(null==(l=y.premium)||null==(r=l.ai)?void 0:r.config)??f},realtimeCollaboration:{enabled:(null==(a=y.premium)||null==(n=a.realtimeCollaboration)?void 0:n.enabled)===!0,tokenUrl:(null==(c=y.premium)||null==(s=c.realtimeCollaboration)?void 0:s.tokenUrl)??null,webSocketUrl:(null==(h=y.premium)||null==(p=h.realtimeCollaboration)?void 0:p.webSocketUrl)??null}}},w=(e=>{let t={plugins:[],config:{}},{ai:o,realtimeCollaboration:r}=e.premium;return(o.enabled||r.enabled)&&(e.hasLicenseKey?(o.enabled&&console.warn(`${g} ckeditor_studio.premium.ai is enabled, but CKEditor AI is scaffolded only. Install ckeditor5-premium-features and uncomment the AI block in premium.ts. Extra requirements: an AI adapter configuration (ckeditor_studio.premium.ai.config, served as the CKEditor "ai" option: adapter endpoint or Cloud Services based), and an "aiAssistant"/AI toolbar item.`),r.enabled&&console.warn(`${g} ckeditor_studio.premium.realtime_collaboration is enabled, but real-time collaboration is scaffolded only. Install ckeditor5-premium-features and uncomment the RTC block in premium.ts. Extra requirements: CKEditor Cloud Services credentials (token_url + web_socket_url, already part of the yaml config), and a per-field collaboration channelId, which this integration still has to derive from the Studio element id + field name.`)):console.warn(`${g} Premium features are enabled in ckeditor_studio config but no license key is configured (CKEDITOR_LICENSE_KEY / ckeditor_studio.license_key). Falling back to the free feature set.`)),t})(x);return{licenseKey:x.licenseKey,plugins:[m.Essentials,m.Paragraph,m.Heading,m.Bold,m.Italic,m.Underline,m.Alignment,m.Link,m.List,m.Indent,m.BlockQuote,m.Table,m.TableToolbar,m.Image,m.ImageResize,m.SourceEditing,m.GeneralHtmlSupport,...w.plugins],toolbar:x.toolbar,table:{contentToolbar:["tableColumn","tableRow","mergeTableCells"]},htmlSupport:{allow:[{name:/^.*$/,attributes:["pimcore_id","pimcore_type","pimcore_disable_thumbnail","id"],classes:!0,styles:!0}]},initialData:o,...""!==u?{placeholder:u}:{},...w.config,...d??{}}},[]);return(0,a.useEffect)(()=>{let e=k.current;null!==e&&o!==_.current&&o!==e.getData()&&e.setData(o)},[o]),(0,n.jsx)(c.CKEditor,{config:x,disabled:h,editor:m.ClassicEditor,onChange:(e,t)=>{let o=t.getData();_.current=o,null==r||r(o),w(t,o)},onReady:e=>{k.current=e,w(e,e.getData())}});function w(e,t){let o=e.editing.view.getDomRoot();if(void 0===o)return;o.style.border="",o.setAttribute("title","");let r=t.replace(/<[^>]*>/g,"").length;"number"==typeof l&&0!==l&&r>l&&(o.style.border="1px solid red",o.setAttribute("title",y("maximum_length_is")+" "+String(l)))}function C(e,t){let o=e.data.processor.toView(t),r=e.data.toModel(o);e.model.insertContent(r)}function v(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function $(e,t,o,r){if(!e.model.document.selection.isCollapsed)return void e.execute("link",t);let i=void 0!==r?` pimcore_type="${v(r)}"`:"";C(e,`<a href="${v(t)}" pimcore_id="${v(String(o))}"${i}>${v(t)}</a>`)}});h.displayName="Editor";let y=(0,a.forwardRef)((e,t)=>{let{value:o,onChange:r,disabled:i,width:l,height:c,maxCharacters:m,placeholder:p,editorConfig:b,context:f}=e,g=(0,a.useRef)(null),{styles:y}=u();return(0,a.useImperativeHandle)(t,()=>({onDrop:e=>{var t;null==(t=g.current)||t.onDrop(e)}})),(0,n.jsx)("div",{className:["ckeditor-editor",f===d.WysiwygContext.DOCUMENT?y["editor-document"]:y.editor].join(" "),style:{maxWidth:(0,s.toCssDimension)(l),maxHeight:(0,s.toCssDimension)(c)},children:(0,n.jsx)(h,{defaultValue:o??"",editorConfig:b,maxCharacters:m,onTextChange:e=>{null!=r&&r(e)},placeholder:p,readOnly:i,ref:g})})});y.displayName="CKEditorEditor";let k={onInit:()=>{r.container.get(i.serviceIds["App/ComponentRegistry/ComponentRegistry"]).override({component:y,name:l.componentConfig.wysiwyg.editor.name})}};void 0!==(e=o.hmd(e)).hot&&e.hot.accept();let _={name:"ckeditor-studio-plugin",onInit:()=>{},onStartup:e=>{let{moduleSystem:t}=e;t.registerModule(k)}}}}]);