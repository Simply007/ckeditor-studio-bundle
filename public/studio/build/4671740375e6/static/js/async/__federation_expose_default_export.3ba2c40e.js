/*! For license information please see __federation_expose_default_export.3ba2c40e.js.LICENSE.txt */
"use strict";(self.chunk_ckeditor_studio_bundle=self.chunk_ckeditor_studio_bundle||[]).push([["525"],{1020(e,t,o){var i=o(9673),r=Symbol.for("react.element"),l=Symbol.for("react.fragment"),n=Object.prototype.hasOwnProperty,a=i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d={key:!0,ref:!0,__self:!0,__source:!0};function s(e,t,o){var i,l={},s=null,c=null;for(i in void 0!==o&&(s=""+o),void 0!==t.key&&(s=""+t.key),void 0!==t.ref&&(c=t.ref),t)n.call(t,i)&&!d.hasOwnProperty(i)&&(l[i]=t[i]);if(e&&e.defaultProps)for(i in t=e.defaultProps)void 0===l[i]&&(l[i]=t[i]);return{$$typeof:r,type:e,key:s,ref:c,props:l,_owner:a.current}}t.Fragment=l,t.jsx=s,t.jsxs=s},4848(e,t,o){e.exports=o(1020)},4276(e,t,o){o.r(t),o.d(t,{CKEditorPlugin:()=>I});var i=o(2977),r=o(4781),l=o(2703),n=o(4848),a=o(9673),d=o(9869),s=o(8267);let c=(0,o(2262).createStyles)(e=>{let{css:t,token:o}=e;return{editor:t`
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
    `}});var u=o(874),m=o(1543),p=o(2696),b=o(3842);let f=["undo","redo","|","heading","|","bold","italic","underline","|","alignment","|","bulletedList","numberedList","outdent","indent","|","blockQuote","link","insertTable","|","sourceEditing"],g={},h=()=>{var e,t,o,i,l,n,a,d,s,c;let u,m=r.appConfig.ckeditorStudio??{},p="string"==typeof m.licenseKey&&""!==m.licenseKey?m.licenseKey:null;return{licenseKey:p??"GPL",hasLicenseKey:null!==p,toolbar:Array.isArray(u=m.toolbar)&&u.length>0&&u.every(e=>"string"==typeof e)?m.toolbar:f,premium:{ai:{enabled:(null==(t=m.premium)||null==(e=t.ai)?void 0:e.enabled)===!0,config:(null==(i=m.premium)||null==(o=i.ai)?void 0:o.config)??g},realtimeCollaboration:{enabled:(null==(n=m.premium)||null==(l=n.realtimeCollaboration)?void 0:l.enabled)===!0,tokenUrl:(null==(d=m.premium)||null==(a=d.realtimeCollaboration)?void 0:a.tokenUrl)??null,webSocketUrl:(null==(c=m.premium)||null==(s=c.realtimeCollaboration)?void 0:s.webSocketUrl)??null}}}},k=Object.freeze({plugins:[],config:{},realtimeCollaborationActive:!1,toolbarItems:[]}),y="[ckeditor-studio-bundle]",_=async(e,t)=>{let{ai:i,realtimeCollaboration:r}=e.premium,[l]=await Promise.all([o.e("746").then(o.t.bind(o,3641,23)),Promise.all([o.e("29"),o.e("595")]).then(o.bind(o,7806))]),n={plugins:[],config:{},realtimeCollaborationActive:!1,toolbarItems:[]},a={};return null!==r.tokenUrl&&""!==r.tokenUrl&&(a.tokenUrl=r.tokenUrl),null!==r.webSocketUrl&&""!==r.webSocketUrl&&(a.webSocketUrl=r.webSocketUrl),(void 0!==a.tokenUrl||void 0!==a.webSocketUrl)&&(n.config.cloudServices=a),i.enabled&&(n.plugins.push(l.AIEditorIntegration,l.AIChat,l.AIChatShortcuts,l.AIQuickActions,l.AIReviewMode,l.AITranslate),n.config.ai={container:{type:"overlay"},...i.config},n.toolbarItems.push("toggleAi","aiQuickActions"),void 0===a.tokenUrl&&console.warn(`${y} ckeditor_studio.premium.ai is enabled without a Cloud Services token endpoint (ckeditor_studio.premium.realtime_collaboration.token_url, used for AI authentication even when the realtime_collaboration gate is off). The AI features will not reach the AI service unless premium.ai.config provides its own authentication (for example a legacy AI Assistant adapter).`)),r.enabled&&(void 0===a.tokenUrl||void 0===a.webSocketUrl?console.warn(`${y} ckeditor_studio.premium.realtime_collaboration is enabled but token_url and/or web_socket_url is missing. Skipping real-time collaboration for this editor; the free feature set stays active.`):null===t.channelId?console.warn(`${y} ckeditor_studio.premium.realtime_collaboration is enabled but no collaboration channel id could be derived for this field (no open element context or no field name, for example in document editables). Skipping real-time collaboration for this editor. You can set an explicit editorConfig.collaboration.channelId per field to opt in.`):(n.plugins.push(l.RealTimeCollaborativeEditing),n.realtimeCollaborationActive=!0,n.config.sourceEditing={allowCollaborationFeatures:!0},null!==t.presenceListContainer&&void 0!==t.presenceListContainer&&(n.plugins.push(l.PresenceList),n.config.presenceList={container:t.presenceListContainer}))),null!==t.channelId&&(i.enabled||n.realtimeCollaborationActive)?n.config.collaboration={channelId:t.channelId}:i.enabled&&(n.config.collaboration={channelId:`pimcore-ai-${v()}`}),n},v=()=>"u">typeof crypto&&"function"==typeof crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now().toString(36),w=(0,a.forwardRef)((e,t)=>{let{defaultValue:o="",onTextChange:i,maxCharacters:l,editorConfig:d,placeholder:c="",readOnly:f=!1,fieldName:g}=e,{t:v}=(0,r.useTranslation)(),w=(0,a.useRef)(null),C=(0,a.useRef)(null);(0,a.useImperativeHandle)(t,()=>({onDrop:e=>{let t=w.current;null!==t&&function(e,t){let o=t.data,i=o.id,r=o.fullPath,l=!e.model.document.selection.isCollapsed;if("asset"===t.type){if("image"===o.type&&!l){let t,l=600,n=!1;void 0!==o.width&&(r=(0,p.createImageThumbnailUrl)(i,{width:600,mimeType:"JPEG"}),o.width<600&&["jpg","jpeg","gif","png"].includes((t=o.fullPath.split("."))[t.length-1].toLowerCase())&&(r=o.fullPath,n=!0),o.width<600&&(l=o.width));let a=[`src="${D(r)}"`,'alt="asset_image"',`style="width:${(0,s.toCssDimension)(l)};"`,`pimcore_id="${D(String(i))}"`,'pimcore_type="asset"'];n&&a.push('pimcore_disable_thumbnail="true"'),T(e,`<img ${a.join(" ")}>`);return}L(e,r,i,"asset");return}"document"===o.elementType&&("page"===o.type||"hardlink"===o.type||"link"===o.type)?L(e,r,i,"document"):"object"===o.elementType?L(e,r,i,"object"):L(e,r,i)}(t,e)}}));let x=(0,a.useMemo)(h,[]),I=(0,a.useMemo)(()=>(e=>{let{ai:t,realtimeCollaboration:o}=e.premium;return(!!t.enabled||!!o.enabled)&&(!!e.hasLicenseKey||(console.warn(`${y} Premium features are enabled in ckeditor_studio config but no license key is configured (CKEDITOR_LICENSE_KEY / ckeditor_studio.license_key). Falling back to the free feature set.`),!1))})(x),[x]),$=(0,b.useOptionalElementContext)(),S=(0,a.useRef)(null),[A,E]=(0,a.useState)(I?null:k);(0,a.useEffect)(()=>{var e;if(!I)return;let t=null==d||null==(e=d.collaboration)?void 0:e.channelId,o=null;"string"==typeof t&&""!==t?o=t:null!==$&&void 0!==g&&""!==g&&(o=`pimcore-${$.elementType}-${$.id}-${g}`);let i=!1;return _(x,{channelId:o,presenceListContainer:S.current}).then(e=>{i||E(e)}).catch(e=>{console.error("[ckeditor-studio-bundle] Loading ckeditor5-premium-features failed; falling back to the free feature set.",e),i||E(k)}),()=>{i=!0}},[]);let U=(0,a.useMemo)(()=>null===A?null:{licenseKey:x.licenseKey,plugins:[m.Essentials,m.Paragraph,m.Heading,m.Bold,m.Italic,m.Underline,m.Alignment,m.Link,m.List,m.Indent,m.BlockQuote,m.Table,m.TableToolbar,m.Image,m.ImageResize,m.SourceEditing,m.GeneralHtmlSupport,...A.plugins],toolbar:0===A.toolbarItems.length?x.toolbar:[...x.toolbar,"|",...A.toolbarItems.filter(e=>!x.toolbar.includes(e))],table:{contentToolbar:["tableColumn","tableRow","mergeTableCells"]},htmlSupport:{allow:[{name:/^.*$/,attributes:["pimcore_id","pimcore_type","pimcore_disable_thumbnail","id"],classes:!0,styles:!0}]},initialData:o,...""!==c?{placeholder:c}:{},...A.config,...d??{}},[A]);return(0,a.useEffect)(()=>{let e=w.current;null===e||(null==A?void 0:A.realtimeCollaborationActive)!==!0&&o!==C.current&&o!==e.getData()&&e.setData(o)},[o,A]),(0,n.jsxs)(n.Fragment,{children:[I&&x.premium.realtimeCollaboration.enabled&&(0,n.jsx)("div",{className:"ckeditor-presence-list",ref:S}),null!==U&&(0,n.jsx)(u.CKEditor,{config:U,disabled:f,editor:m.ClassicEditor,onChange:(e,t)=>{let o=t.getData();C.current=o,null==i||i(o),R(t,o)},onReady:e=>{w.current=e,R(e,e.getData())}})]});function R(e,t){let o=e.editing.view.getDomRoot();if(void 0===o)return;o.style.border="",o.setAttribute("title","");let i=t.replace(/<[^>]*>/g,"").length;"number"==typeof l&&0!==l&&i>l&&(o.style.border="1px solid red",o.setAttribute("title",v("maximum_length_is")+" "+String(l)))}function T(e,t){let o=e.data.processor.toView(t),i=e.data.toModel(o);e.model.insertContent(i)}function D(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function L(e,t,o,i){if(!e.model.document.selection.isCollapsed)return void e.execute("link",t);let r=void 0!==i?` pimcore_type="${D(i)}"`:"";T(e,`<a href="${D(t)}" pimcore_id="${D(String(o))}"${r}>${D(t)}</a>`)}});w.displayName="Editor";let C=(0,a.forwardRef)((e,t)=>{let{value:o,onChange:i,disabled:r,width:l,height:u,maxCharacters:m,placeholder:p,editorConfig:b,context:f,...g}=e,h=(0,a.useRef)(null),{styles:k}=c(),y=function(e){let t=e.combinedFieldName;if("string"==typeof t&&""!==t)return t;let o=e.name;return Array.isArray(o)&&o.length>0?o.map(String).join("."):"string"==typeof o&&""!==o?o:void 0}(g);return(0,a.useImperativeHandle)(t,()=>({onDrop:e=>{var t;null==(t=h.current)||t.onDrop(e)}})),(0,n.jsx)("div",{className:["ckeditor-editor",f===d.WysiwygContext.DOCUMENT?k["editor-document"]:k.editor].join(" "),style:{maxWidth:(0,s.toCssDimension)(l),maxHeight:(0,s.toCssDimension)(u)},children:(0,n.jsx)(w,{defaultValue:o??"",editorConfig:b,fieldName:y,maxCharacters:m,onTextChange:e=>{null!=i&&i(e)},placeholder:p,readOnly:r,ref:h})})});C.displayName="CKEditorEditor";let x={onInit:()=>{i.container.get(r.serviceIds["App/ComponentRegistry/ComponentRegistry"]).override({component:C,name:l.componentConfig.wysiwyg.editor.name})}};void 0!==(e=o.hmd(e)).hot&&e.hot.accept();let I={name:"ckeditor-studio-plugin",onInit:()=>{},onStartup:e=>{let{moduleSystem:t}=e;t.registerModule(x)}}}}]);