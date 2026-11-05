/*! For license information please see __federation_expose_default_export.c92ae21f.js.LICENSE.txt */
"use strict";(self.chunk_ckeditor_studio_bundle=self.chunk_ckeditor_studio_bundle||[]).push([["525"],{1020(e,t,o){var i=o(9673),l=Symbol.for("react.element"),r=Symbol.for("react.fragment"),n=Object.prototype.hasOwnProperty,a=i.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d={key:!0,ref:!0,__self:!0,__source:!0};function s(e,t,o){var i,r={},s=null,c=null;for(i in void 0!==o&&(s=""+o),void 0!==t.key&&(s=""+t.key),void 0!==t.ref&&(c=t.ref),t)n.call(t,i)&&!d.hasOwnProperty(i)&&(r[i]=t[i]);if(e&&e.defaultProps)for(i in t=e.defaultProps)void 0===r[i]&&(r[i]=t[i]);return{$$typeof:l,type:e,key:s,ref:c,props:r,_owner:a.current}}t.Fragment=r,t.jsx=s,t.jsxs=s},4848(e,t,o){e.exports=o(1020)},4276(e,t,o){o.r(t),o.d(t,{CKEditorPlugin:()=>T,CKEditorSlotProbePlugin:()=>R});var i=o(2977),l=o(4781),r=o(2703),n=o(4848),a=o(9673),d=o(9869),s=o(8267);let c=(0,o(2262).createStyles)(e=>{let{css:t,token:o}=e;return{editor:t`
      border: 1px solid ${o.colorBorder};
      border-radius: ${o.borderRadius}px;
      min-height: 100px;
      min-width: 200px;
      background-color: ${o.colorBgContainer};
      cursor: text;
      display: flex;
      overflow: hidden;
      flex-direction: column;
      /* Keeps the bottom border off the edge of Studio's scroll container. */
      margin-bottom: ${o.marginXS}px;

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
    `}});var u=o(874),m=o(1543),p=o(2696),f=o(3842);let b=["undo","redo","|","heading","|","bold","italic","underline","|","alignment","|","bulletedList","numberedList","outdent","indent","|","blockQuote","link","insertTable","|","sourceEditing","fullscreen"],g={},h=()=>{var e,t,o,i,r,n,a,d,s,c,u,m;let p,f=l.appConfig.ckeditorStudio??{},h="string"==typeof f.licenseKey&&""!==f.licenseKey?f.licenseKey:null;return{editor:"quill"===f.editor||"default"===f.editor?f.editor:"ckeditor",licenseKey:h??"GPL",hasLicenseKey:null!==h,toolbar:Array.isArray(p=f.toolbar)&&p.length>0&&p.every(e=>"string"==typeof e)?f.toolbar:b,premium:{ai:{enabled:(null==(t=f.premium)||null==(e=t.ai)?void 0:e.enabled)===!0,config:(null==(i=f.premium)||null==(o=i.ai)?void 0:o.config)??g,container:(null==(n=f.premium)||null==(r=n.ai)?void 0:r.container)==="overlay"?"overlay":"sidebar"},realtimeCollaboration:{enabled:(null==(d=f.premium)||null==(a=d.realtimeCollaboration)?void 0:a.enabled)===!0,tokenUrl:(null==(c=f.premium)||null==(s=c.realtimeCollaboration)?void 0:s.tokenUrl)??null,webSocketUrl:(null==(m=f.premium)||null==(u=m.realtimeCollaboration)?void 0:u.webSocketUrl)??null}}}},k=Object.freeze({plugins:[],config:{},realtimeCollaborationActive:!1,toolbarItems:[]}),y="[ckeditor-studio-bundle]",v=async(e,t)=>{let{ai:i,realtimeCollaboration:l}=e.premium,[r]=await Promise.all([o.e("746").then(o.t.bind(o,3641,23)),Promise.all([o.e("29"),o.e("595")]).then(o.bind(o,7806))]),n={plugins:[],config:{},realtimeCollaborationActive:!1,toolbarItems:[]},a={};null!==l.tokenUrl&&""!==l.tokenUrl&&(a.tokenUrl=l.tokenUrl),null!==l.webSocketUrl&&""!==l.webSocketUrl&&(a.webSocketUrl=l.webSocketUrl),(void 0!==a.tokenUrl||void 0!==a.webSocketUrl)&&(n.config.cloudServices=a);let d=i.enabled&&null!==t.element&&void 0!==t.element&&null!==t.anchor&&void 0!==t.anchor;if(i.enabled&&(n.toolbarItems.push("toggleAi","aiQuickActions"),void 0===a.tokenUrl&&console.warn(`${y} ckeditor_studio.premium.ai is enabled without a Cloud Services token endpoint (ckeditor_studio.premium.realtime_collaboration.token_url, used for AI authentication even when the realtime_collaboration gate is off). The AI features will not reach the AI service unless premium.ai.config provides its own authentication (for example a legacy AI Assistant adapter).`),null!==t.root&&void 0!==t.root&&(n.config.root={title:t.root.title,description:t.root.description})),d){let d=t.element,{acquireSharedContext:s}=await o.e("199").then(o.bind(o,5306)),c=s(r,{key:`pimcore-${d.type}-${d.id}`,anchor:t.anchor,licenseKey:e.licenseKey,cloudServices:a,aiConfig:i.config,container:i.container,presence:l.enabled&&void 0!==a.tokenUrl&&void 0!==a.webSocketUrl});n.release=c.release;try{n.config.context=await c.contextPromise}catch(e){throw c.release(),e}n.plugins.push(r.AIEditorIntegration,r.AIQuickActions)}else i.enabled&&(n.plugins.push(r.AIEditorIntegration,r.AIChat,r.AIChatShortcuts,r.AIQuickActions,r.AIReviewMode,r.AITranslate),n.config.ai={container:{type:"overlay"},...i.config});return l.enabled&&(void 0===a.tokenUrl||void 0===a.webSocketUrl?console.warn(`${y} ckeditor_studio.premium.realtime_collaboration is enabled but token_url and/or web_socket_url is missing. Skipping real-time collaboration for this editor; the free feature set stays active.`):null===t.channelId?console.warn(`${y} ckeditor_studio.premium.realtime_collaboration is enabled but no collaboration channel id could be derived for this field (no open element context or no field name, for example in document editables). Skipping real-time collaboration for this editor. You can set an explicit editorConfig.collaboration.channelId per field to opt in.`):(n.plugins.push(r.RealTimeCollaborativeEditing),n.realtimeCollaborationActive=!0,n.config.sourceEditing={allowCollaborationFeatures:!0},d||null===t.presenceListContainer||void 0===t.presenceListContainer||(n.plugins.push(r.PresenceList),n.config.presenceList={container:t.presenceListContainer}))),null!==t.channelId&&(i.enabled||n.realtimeCollaborationActive)?n.config.collaboration={channelId:t.channelId}:i.enabled&&(n.config.collaboration={channelId:`pimcore-ai-${_()}`}),n},_=()=>"u">typeof crypto&&"function"==typeof crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now().toString(36),w=(0,a.forwardRef)((e,t)=>{let{defaultValue:o="",onTextChange:i,maxCharacters:r,editorConfig:d,placeholder:c="",readOnly:b=!1,fieldName:g,fieldTitle:_}=e,{t:w}=(0,l.useTranslation)(),x=(0,a.useRef)(null),$=(0,a.useRef)(null);(0,a.useImperativeHandle)(t,()=>({onDrop:e=>{let t=x.current;null!==t&&function(e,t){let o=t.data,i=o.id,l=o.fullPath,r=!e.model.document.selection.isCollapsed;if("asset"===t.type){if("image"===o.type&&!r){let t,r=600,n=!1;void 0!==o.width&&(l=(0,p.createImageThumbnailUrl)(i,{width:600,mimeType:"JPEG"}),o.width<600&&["jpg","jpeg","gif","png"].includes((t=o.fullPath.split("."))[t.length-1].toLowerCase())&&(l=o.fullPath,n=!0),o.width<600&&(r=o.width));let a=[`src="${K(l)}"`,'alt="asset_image"',`style="width:${(0,s.toCssDimension)(r)};"`,`pimcore_id="${K(String(i))}"`,'pimcore_type="asset"'];n&&a.push('pimcore_disable_thumbnail="true"'),L(e,`<img ${a.join(" ")}>`);return}j(e,l,i,"asset");return}"document"===o.elementType&&("page"===o.type||"hardlink"===o.type||"link"===o.type)?j(e,l,i,"document"):"object"===o.elementType?j(e,l,i,"object"):j(e,l,i)}(t,e)}}));let I=(0,a.useMemo)(h,[]),S=(0,a.useMemo)(()=>(e=>{let{ai:t,realtimeCollaboration:o}=e.premium;return(!!t.enabled||!!o.enabled)&&(!!e.hasLicenseKey||(console.warn(`${y} Premium features are enabled in ckeditor_studio config but no license key is configured (CKEDITOR_LICENSE_KEY / ckeditor_studio.license_key). Falling back to the free feature set.`),!1))})(I),[I]),A=(0,f.useOptionalElementContext)(),E=(0,a.useRef)(null),U=(0,a.useRef)(null),[R,T]=(0,a.useState)(S?null:k);(0,a.useEffect)(()=>{var e;if(!S)return;let t=function(e,t,o,i){let l=null;if(null!==t)l={type:String(t.elementType),id:t.id};else if(null!==e){var r;let t=null==(r=e.ownerDocument.defaultView)?void 0:r.pimcore_document_id;("number"==typeof t||"string"==typeof t)&&""!==String(t)&&(l={type:"document",id:t})}if(void 0!==o&&""!==o)return{element:l,field:{name:o,title:void 0!==i&&""!==i?i:C(o),kind:"field"}};let n=(null==e?void 0:e.closest('.pimcore_editable[id^="pimcore_editable_"]'))??null;if(null!==n){let e=n.id.slice(17),t=n.dataset.realName??n.dataset.name??e;return{element:l,field:{name:e,title:C(t),kind:"editable"}}}return{element:l,field:null}}(U.current,A,g,_),o=null==d||null==(e=d.collaboration)?void 0:e.channelId,i=null;"string"==typeof o&&""!==o?i=o:null!==t.element&&null!==t.field&&(i=`pimcore-${t.element.type}-${t.element.id}-${t.field.name}`);let l=!1,r=null;return v(I,{channelId:i,presenceListContainer:E.current,element:t.element,anchor:U.current,root:null!==t.field&&null!==t.element?{title:t.field.title,description:`Rich text ${t.field.kind} "${t.field.name}" of the Pimcore ${t.element.type.replace("-"," ")} with id ${t.element.id}.`}:null}).then(e=>{if(l){var t;null==(t=e.release)||t.call(e);return}r=e,T(e)}).catch(e=>{console.error("[ckeditor-studio-bundle] Loading ckeditor5-premium-features failed; falling back to the free feature set.",e),l||T(k)}),()=>{var e;l=!0,null==r||null==(e=r.release)||e.call(r)}},[]);let D=(0,a.useMemo)(()=>null===R?null:{licenseKey:I.licenseKey,plugins:[m.Essentials,m.Paragraph,m.Heading,m.Bold,m.Italic,m.Underline,m.Alignment,m.Link,m.List,m.Indent,m.BlockQuote,m.Table,m.TableToolbar,m.Image,m.ImageResize,m.SourceEditing,m.GeneralHtmlSupport,m.Fullscreen,...R.plugins],toolbar:0===R.toolbarItems.length?I.toolbar:[...I.toolbar,"|",...R.toolbarItems.filter(e=>!I.toolbar.includes(e))],table:{contentToolbar:["tableColumn","tableRow","mergeTableCells"]},htmlSupport:{allow:[{name:/^.*$/,attributes:["pimcore_id","pimcore_type","pimcore_disable_thumbnail","id"],classes:!0,styles:!0}]},initialData:o,...""!==c?{placeholder:c}:{},...R.config,...d??{}},[R]);return(0,a.useEffect)(()=>{let e=x.current;null===e||(null==R?void 0:R.realtimeCollaborationActive)!==!0&&o!==$.current&&o!==e.getData()&&e.setData(o)},[o,R]),(0,n.jsxs)(n.Fragment,{children:[S&&(0,n.jsx)("span",{hidden:!0,ref:U}),S&&I.premium.realtimeCollaboration.enabled&&(0,n.jsx)("div",{className:"ckeditor-presence-list",ref:E}),null!==D&&(0,n.jsx)(u.CKEditor,{config:D,disabled:b,editor:m.ClassicEditor,onChange:(e,t)=>{let o=t.getData();$.current=o,null==i||i(o),P(t,o)},onReady:e=>{x.current=e,function(e){var t;let o=null==(t=e.config.get("roots"))?void 0:t.main,i="string"==typeof(null==o?void 0:o.title)?o.title:null,l="string"==typeof(null==o?void 0:o.description)?o.description:null;if(null===i&&null===l)return;let r=e.model.document.getRoot();null!==r&&(r.getAttribute("$title")!==(i??void 0)||r.getAttribute("$description")!==(l??void 0))&&e.model.enqueueChange({isUndoable:!1},e=>{null!==i&&e.setAttribute("$title",i,r),null!==l&&e.setAttribute("$description",l,r)})}(e),P(e,e.getData())}})]});function P(e,t){let o=e.editing.view.getDomRoot();if(void 0===o)return;o.style.border="",o.setAttribute("title","");let i=t.replace(/<[^>]*>/g,"").length;"number"==typeof r&&0!==r&&i>r&&(o.style.border="1px solid red",o.setAttribute("title",w("maximum_length_is")+" "+String(r)))}function L(e,t){let o=e.data.processor.toView(t),i=e.data.toModel(o);e.model.insertContent(i)}function K(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function j(e,t,o,i){if(!e.model.document.selection.isCollapsed)return void e.execute("link",t);let l=void 0!==i?` pimcore_type="${K(i)}"`:"";L(e,`<a href="${K(t)}" pimcore_id="${K(String(o))}"${l}>${K(t)}</a>`)}});function C(e){let t=e.replace(/[_-]+/g," ").replace(/([a-z])([A-Z0-9])/g,"$1 $2").trim().toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}w.displayName="Editor";let x=(0,a.forwardRef)((e,t)=>{let{value:o,onChange:i,disabled:l,width:r,height:u,maxCharacters:m,placeholder:p,editorConfig:f,context:b,...g}=e,h=(0,a.useRef)(null),{styles:k}=c(),y=function(e){let t=e.combinedFieldName;if("string"==typeof t&&""!==t)return t;let o=e.name;return Array.isArray(o)&&o.length>0?o.map(String).join("."):"string"==typeof o&&""!==o?o:void 0}(g);(0,a.useImperativeHandle)(t,()=>({onDrop:e=>{var t;null==(t=h.current)||t.onDrop(e)}}));let v=b===d.WysiwygContext.DOCUMENT,_=(0,s.toCssDimension)(u)??(v?void 0:"70vh");return(0,n.jsx)("div",{className:["ckeditor-editor",v?k["editor-document"]:k.editor].join(" "),style:{maxWidth:(0,s.toCssDimension)(r),maxHeight:_},children:(0,n.jsx)(w,{defaultValue:o??"",editorConfig:f,fieldName:y,fieldTitle:"string"==typeof g.title?g.title:void 0,maxCharacters:m,onTextChange:e=>{null!=i&&i(e)},placeholder:p,readOnly:l,ref:h})})});x.displayName="CKEditorEditor";let $="[ckeditor-studio-bundle]",I=r.componentConfig.wysiwyg.editor.name,S=null,A=()=>i.container.get(l.serviceIds["App/ComponentRegistry/ComponentRegistry"]),E={onInit:()=>{let e=A();S=e.has(I)?e.get(I):null}},U={onInit:()=>{let e=A(),{editor:t}=h(),o=e.has(I)?e.get(I):null,i=null!==o&&o!==S&&o!==x;if("quill"===t){if(i)return;console.warn(`${$} ckeditor_studio.editor is "quill", but no other editor bundle registered the wysiwyg editor (is PimcoreQuillBundle enabled in config/bundles.php?). Falling back to CKEditor.`)}if("default"===t){if(null!==S)return void e.override({component:S,name:I});console.warn(`${$} ckeditor_studio.editor is "default", but Studio's built-in editor was not found. Falling back to CKEditor.`)}e.override({component:x,name:I})}};void 0!==(e=o.hmd(e)).hot&&e.hot.accept();let R={name:"ckeditor-studio-editor-slot-probe",priority:-1e3,onStartup:e=>{let{moduleSystem:t}=e;t.registerModule(E)}},T={name:"ckeditor-studio-plugin",priority:1e3,onInit:()=>{},onStartup:e=>{let{moduleSystem:t}=e;t.registerModule(U)}}}}]);