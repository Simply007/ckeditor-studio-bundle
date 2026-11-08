/*! For license information please see __federation_expose_default_export.94f5b1b7.js.LICENSE.txt */
"use strict";(self.chunk_ckeditor_studio_bundle=self.chunk_ckeditor_studio_bundle||[]).push([["525"],{1020(e,t,i){var o=i(9981),l=Symbol.for("react.element"),r=Symbol.for("react.fragment"),n=Object.prototype.hasOwnProperty,a=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d={key:!0,ref:!0,__self:!0,__source:!0};function u(e,t,i){var o,r={},u=null,c=null;for(o in void 0!==i&&(u=""+i),void 0!==t.key&&(u=""+t.key),void 0!==t.ref&&(c=t.ref),t)n.call(t,o)&&!d.hasOwnProperty(o)&&(r[o]=t[o]);if(e&&e.defaultProps)for(o in t=e.defaultProps)void 0===r[o]&&(r[o]=t[o]);return{$$typeof:l,type:e,key:u,ref:c,props:r,_owner:a.current}}t.Fragment=r,t.jsx=u,t.jsxs=u},4848(e,t,i){e.exports=i(1020)},7640(e,t,i){i.r(t),i.d(t,{CKEditorPlugin:()=>F,CKEditorSlotProbePlugin:()=>M});var o=i(4848),l=i(9981),r=i(2977),n=i(4781),a=i(2703),d=i(9869),u=i(8267);let c=(0,i(8376).createStyles)(e=>{let{css:t,token:i}=e;return{editor:t`
      border: 1px solid ${i.colorBorder};
      border-radius: ${i.borderRadius}px;
      min-height: 100px;
      min-width: 200px;
      background-color: ${i.colorBgContainer};
      cursor: text;
      display: flex;
      overflow: hidden;
      flex-direction: column;
      /* Keeps the bottom border off the edge of Studio's scroll container. */
      margin-bottom: ${i.marginXS}px;

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
        border-bottom: 1px solid ${i.colorBorder};
      }

      .ck.ck-editor__editable_inline.ck-read-only {
        background-color: ${i.colorBgContainerDisabled};
        cursor: not-allowed;
      }
    `,"editor-document":t`
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
        border: 1px solid ${i.colorBorder};
        border-top-left-radius: ${i.borderRadius}px;
        border-top-right-radius: ${i.borderRadius}px;
      }

      .ck.ck-editor__editable_inline {
        border-left: 1px solid ${i.colorBorder};
        border-right: 1px solid ${i.colorBorder};
        border-bottom: 1px solid ${i.colorBorder};
        border-bottom-left-radius: ${i.borderRadius}px;
        border-bottom-right-radius: ${i.borderRadius}px;
      }
    `,"editor-inline":t`
      min-width: 200px;
      cursor: text;
      overflow: auto;

      /* The text keeps the page's own typography; only a light frame marks the
         editable area, stronger while focused. */
      .ck.ck-editor__editable_inline {
        padding: 0 ${i.paddingXS}px;
        border: 1px dashed transparent;
        border-radius: ${i.borderRadius}px;
        color: inherit;
        font: inherit;
        background: transparent;
      }

      .ck.ck-editor__editable_inline:hover {
        border-color: ${i.colorBorder};
      }

      .ck.ck-editor__editable_inline.ck-focused {
        border: 1px solid ${i.colorPrimary};
        box-shadow: none;
      }

      .ck.ck-editor__editable_inline.ck-read-only {
        cursor: not-allowed;
      }
    `}});var s=i(2990),p=i(2696),m=i(3842);let f=["undo","redo","|","heading","|","bold","italic","underline","|","alignment","|","bulletedList","numberedList","outdent","indent","|","blockQuote","link","insertTable","|","sourceEditing","fullscreen"],b={},g=()=>{var e,t,i,o,l,r,a,d,u,c,s,p;let m,g=n.appConfig.ckeditorStudio??{},h="string"==typeof g.licenseKey&&""!==g.licenseKey?g.licenseKey:null;return{editor:"quill"===g.editor||"default"===g.editor?g.editor:"ckeditor",licenseKey:h??"GPL",hasLicenseKey:null!==h,toolbar:Array.isArray(m=g.toolbar)&&m.length>0&&m.every(e=>"string"==typeof e)?g.toolbar:f,premium:{ai:{enabled:(null==(t=g.premium)||null==(e=t.ai)?void 0:e.enabled)===!0,config:(null==(o=g.premium)||null==(i=o.ai)?void 0:i.config)??b,container:(null==(r=g.premium)||null==(l=r.ai)?void 0:l.container)==="overlay"?"overlay":"sidebar"},realtimeCollaboration:{enabled:(null==(d=g.premium)||null==(a=d.realtimeCollaboration)?void 0:a.enabled)===!0,tokenUrl:(null==(c=g.premium)||null==(u=c.realtimeCollaboration)?void 0:u.tokenUrl)??null,webSocketUrl:(null==(p=g.premium)||null==(s=p.realtimeCollaboration)?void 0:s.webSocketUrl)??null}}}},h=Object.freeze({plugins:[],config:{},realtimeCollaborationActive:!1,toolbarItems:[]}),k="[ckeditor-studio-bundle]",y=async(e,t,o,l)=>{let{ai:r,realtimeCollaboration:n}=e.premium,a={plugins:[],config:{},realtimeCollaborationActive:!1,toolbarItems:[]},d={};null!==n.tokenUrl&&""!==n.tokenUrl&&(d.tokenUrl=n.tokenUrl),null!==n.webSocketUrl&&""!==n.webSocketUrl&&(d.webSocketUrl=n.webSocketUrl),(void 0!==d.tokenUrl||void 0!==d.webSocketUrl)&&(a.config.cloudServices=d);let u=r.enabled&&null!==t.element&&void 0!==t.element&&null!==t.anchor&&void 0!==t.anchor;if(r.enabled&&(a.toolbarItems.push("toggleAi","aiQuickActions"),void 0===d.tokenUrl&&console.warn(`${k} ckeditor_studio.premium.ai is enabled without a Cloud Services token endpoint (ckeditor_studio.premium.realtime_collaboration.token_url, used for AI authentication even when the realtime_collaboration gate is off). The AI features will not reach the AI service unless premium.ai.config provides its own authentication (for example a legacy AI Assistant adapter).`),null!==t.root&&void 0!==t.root&&(a.config.root={title:t.root.title,description:t.root.description})),u){let u=t.element,{acquireSharedContext:c}=await i.e("199").then(i.bind(i,5306)),s=c(o,l,{key:`pimcore-${u.type}-${u.id}`,anchor:t.anchor,licenseKey:e.licenseKey,cloudServices:d,aiConfig:r.config,container:r.container,presence:n.enabled&&void 0!==d.tokenUrl&&void 0!==d.webSocketUrl});a.release=s.release;try{a.config.context=await s.contextPromise}catch(e){throw s.release(),e}a.plugins.push(o.AIEditorIntegration,o.AIQuickActions)}else r.enabled&&(a.plugins.push(o.AIEditorIntegration,o.AIChat,o.AIChatShortcuts,o.AIQuickActions,o.AIReviewMode,o.AITranslate),a.config.ai={container:{type:"overlay"},...r.config});return n.enabled&&(void 0===d.tokenUrl||void 0===d.webSocketUrl?console.warn(`${k} ckeditor_studio.premium.realtime_collaboration is enabled but token_url and/or web_socket_url is missing. Skipping real-time collaboration for this editor; the free feature set stays active.`):null===t.channelId?console.warn(`${k} ckeditor_studio.premium.realtime_collaboration is enabled but no collaboration channel id could be derived for this field (no open element context or no field name, for example in document editables). Skipping real-time collaboration for this editor. You can set an explicit editorConfig.collaboration.channelId per field to opt in.`):(a.plugins.push(o.RealTimeCollaborativeEditing),a.realtimeCollaborationActive=!0,a.config.sourceEditing={allowCollaborationFeatures:!0},u||null===t.presenceListContainer||void 0===t.presenceListContainer||(a.plugins.push(o.PresenceList),a.config.presenceList={container:t.presenceListContainer}))),null!==t.channelId&&(r.enabled||a.realtimeCollaborationActive)?a.config.collaboration={channelId:t.channelId}:r.enabled&&(a.config.collaboration={channelId:`pimcore-ai-${v()}`}),a},v=()=>"u">typeof crypto&&"function"==typeof crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now().toString(36),w=null,_=null,C=async()=>(w??(w=i.e("282").then(i.t.bind(i,6561,23))),await w),x=async()=>(_??(_=(0,s.loadCKEditorCloud)({version:"49.1.0",premium:!0}).then(e=>({core:e.CKEditor,premium:e.CKEditorPremiumFeatures}))),await _),$="[ckeditor-studio-bundle]",S=(0,l.forwardRef)((e,t)=>{let{editorType:i="classic",defaultValue:r="",onTextChange:a,maxCharacters:d,editorConfig:c,placeholder:f="",readOnly:b=!1,fieldName:v,fieldTitle:w}=e,{t:_}=(0,n.useTranslation)(),S=(0,l.useRef)(null),E=(0,l.useRef)(null);(0,l.useImperativeHandle)(t,()=>({onDrop:e=>{let t=S.current;null!==t&&function(e,t){let i=t.data,o=i.id,l=i.fullPath,r=!e.model.document.selection.isCollapsed;if("asset"===t.type){if("image"===i.type&&!r){let t,r=600,n=!1;void 0!==i.width&&(l=(0,p.createImageThumbnailUrl)(o,{width:600,mimeType:"JPEG"}),i.width<600&&["jpg","jpeg","gif","png"].includes((t=i.fullPath.split("."))[t.length-1].toLowerCase())&&(l=i.fullPath,n=!0),i.width<600&&(r=i.width));let a=[`src="${M(l)}"`,'alt="asset_image"',`style="width:${(0,u.toCssDimension)(r)};"`,`pimcore_id="${M(String(o))}"`,'pimcore_type="asset"'];n&&a.push('pimcore_disable_thumbnail="true"'),O(e,`<img ${a.join(" ")}>`);return}F(e,l,o,"asset");return}"document"===i.elementType&&("page"===i.type||"hardlink"===i.type||"link"===i.type)?F(e,l,o,"document"):"object"===i.elementType?F(e,l,o,"object"):F(e,l,o)}(t,e)}}));let A=(0,l.useMemo)(g,[]),R=(0,l.useMemo)(()=>(e=>{let{ai:t,realtimeCollaboration:i}=e.premium;return(!!t.enabled||!!i.enabled)&&(!!e.hasLicenseKey||(console.warn(`${k} Premium features are enabled in ckeditor_studio config but no license key is configured (CKEDITOR_LICENSE_KEY / ckeditor_studio.license_key). Falling back to the free feature set.`),!1))})(A),[A]),T=(0,m.useOptionalElementContext)(),U=(0,l.useRef)(null),K=(0,l.useRef)(null),[L,D]=(0,l.useState)(null);(0,l.useEffect)(()=>{var e;let t=!1,i=null,o=()=>{C().then(e=>{t||D({core:e,premium:h})}).catch(e=>{console.error(`${$} Loading the CKEditor build failed.`,e)})};if(!R)return o(),()=>{t=!0};let l=function(e,t,i,o){let l=null;if(null!==t)l={type:String(t.elementType),id:t.id};else if(null!==e){var r;let t=null==(r=e.ownerDocument.defaultView)?void 0:r.pimcore_document_id;("number"==typeof t||"string"==typeof t)&&""!==String(t)&&(l={type:"document",id:t})}if(void 0!==i&&""!==i)return{element:l,field:{name:i,title:void 0!==o&&""!==o?o:I(i),kind:"field"}};let n=(null==e?void 0:e.closest('.pimcore_editable[id^="pimcore_editable_"]'))??null;if(null!==n){let e=n.id.slice(17),t=n.dataset.realName??n.dataset.name??e;return{element:l,field:{name:e,title:I(t),kind:"editable"}}}return{element:l,field:null}}(K.current,T,v,w),r=null==c||null==(e=c.collaboration)?void 0:e.channelId,n=null;return"string"==typeof r&&""!==r?n=r:null!==l.element&&null!==l.field&&(n=`pimcore-${l.element.type}-${l.element.id}-${l.field.name}`),x().then(async e=>{let{core:o,premium:r}=e;try{let e=await y(A,{channelId:n,presenceListContainer:U.current,element:l.element,anchor:K.current,root:null!==l.field&&null!==l.element?{title:l.field.title,description:`Rich text ${l.field.kind} "${l.field.name}" of the Pimcore ${l.element.type.replace("-"," ")} with id ${l.element.id}.`}:null},r,o);if(t){var a;null==(a=e.release)||a.call(e);return}i=e,D({core:o,premium:e})}catch(e){console.error(`${$} Setting up the premium features failed; continuing with the open source features.`,e),t||D({core:o,premium:h})}}).catch(e=>{if(console.error(`${$} Loading CKEditor from the CDN failed; falling back to the bundled open source build.`,e),t)return;let i=globalThis.CKEDITOR;void 0!==i?D({core:i,premium:h}):o()}),()=>{var e;t=!0,null==i||null==(e=i.release)||e.call(i)}},[]);let P=(0,l.useMemo)(()=>{if(null===L)return null;let{core:e,premium:t}=L,o="inline"===i,l=o?A.toolbar.filter(e=>"fullscreen"!==e):A.toolbar;return{licenseKey:A.licenseKey,plugins:[e.Essentials,e.Paragraph,e.Heading,e.Bold,e.Italic,e.Underline,e.Alignment,e.Link,e.List,e.Indent,e.BlockQuote,e.Table,e.TableToolbar,e.Image,e.ImageResize,e.SourceEditing,e.GeneralHtmlSupport,...o?[]:[e.Fullscreen],...t.plugins],toolbar:{items:0===t.toolbarItems.length?l:[...l,"|",...t.toolbarItems.filter(e=>!l.includes(e))],shouldNotGroupWhenFull:o},table:{contentToolbar:["tableColumn","tableRow","mergeTableCells"]},htmlSupport:{allow:[{name:/^.*$/,attributes:["pimcore_id","pimcore_type","pimcore_disable_thumbnail","id"],classes:!0,styles:!0}]},initialData:r,...""!==f?{placeholder:f}:{},...t.config,...c??{}}},[L]);(0,l.useEffect)(()=>{let e=S.current;null===e||(null==L?void 0:L.premium.realtimeCollaborationActive)!==!0&&r!==E.current&&r!==e.getData()&&e.setData(r)},[r,L]);let j=e=>{S.current=e,function(e){var t;let i=null==(t=e.config.get("roots"))?void 0:t.main,o="string"==typeof(null==i?void 0:i.title)?i.title:null,l="string"==typeof(null==i?void 0:i.description)?i.description:null;if(null===o&&null===l)return;let r=e.model.document.getRoot();null!==r&&(r.getAttribute("$title")!==(o??void 0)||r.getAttribute("$description")!==(l??void 0))&&e.model.enqueueChange({isUndoable:!1},e=>{null!==o&&e.setAttribute("$title",o,r),null!==l&&e.setAttribute("$description",l,r)})}(e),N(e,e.getData())},B=(e,t)=>{let i=t.getData();E.current=i,null==a||a(i),N(t,i)};return(0,o.jsxs)(o.Fragment,{children:[R&&(0,o.jsx)("span",{hidden:!0,ref:K}),R&&A.premium.realtimeCollaboration.enabled&&(0,o.jsx)("div",{className:"ckeditor-presence-list",ref:U}),null!==P&&null!==L&&("inline"===i?(0,o.jsx)(s.CKEditor,{config:P,disabled:b,editor:L.core.InlineEditor,onChange:B,onReady:j}):(0,o.jsx)(s.CKEditor,{config:P,disabled:b,editor:L.core.ClassicEditor,onChange:B,onReady:j}))]});function N(e,t){let i=e.editing.view.getDomRoot();if(void 0===i)return;i.style.border="",i.setAttribute("title","");let o=t.replace(/<[^>]*>/g,"").length;"number"==typeof d&&0!==d&&o>d&&(i.style.border="1px solid red",i.setAttribute("title",_("maximum_length_is")+" "+String(d)))}function O(e,t){let i=e.data.processor.toView(t),o=e.data.toModel(i);e.model.insertContent(o)}function M(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function F(e,t,i,o){if(!e.model.document.selection.isCollapsed)return void e.execute("link",t);let l=void 0!==o?` pimcore_type="${M(o)}"`:"";O(e,`<a href="${M(t)}" pimcore_id="${M(String(i))}"${l}>${M(t)}</a>`)}});function I(e){let t=e.replace(/[_-]+/g," ").replace(/([a-z])([A-Z0-9])/g,"$1 $2").trim().toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}S.displayName="Editor";let E=(0,l.forwardRef)((e,t)=>{let{value:i,onChange:r,disabled:n,width:a,height:s,maxCharacters:p,placeholder:m,editorConfig:f,context:b,...g}=e,h=(0,l.useRef)(null),{styles:k}=c(),y=function(e){let t=e.combinedFieldName;if("string"==typeof t&&""!==t)return t;let i=e.name;return Array.isArray(i)&&i.length>0?i.map(String).join("."):"string"==typeof i&&""!==i?i:void 0}(g);(0,l.useImperativeHandle)(t,()=>({onDrop:e=>{var t;null==(t=h.current)||t.onDrop(e)}}));let v=b===d.WysiwygContext.DOCUMENT,{editorType:w,..._}=f??{},C=v&&"inline"===w?"inline":"classic",x=(0,u.toCssDimension)(s),[$,I]=function(e){let t=(0,l.useRef)(null),[i,o]=(0,l.useState)(void 0);return(0,l.useLayoutEffect)(()=>{let i=t.current;if(!e||null===i)return void o(void 0);let l=function(e){let t=e.parentElement;for(;null!==t;){if(/(auto|scroll)/.test(getComputedStyle(t).overflowY))return t;t=t.parentElement}return null}(i),r=()=>{let e=Math.round(.7*window.innerHeight);if(null===l||0===l.clientHeight)return void o(e);let t=i.getBoundingClientRect().top-l.getBoundingClientRect().top+l.scrollTop;o(Math.max(320,Math.min(e,t<l.clientHeight?l.clientHeight-t-16:l.clientHeight-32)))};r();let n=new ResizeObserver(r);return null!==l&&n.observe(l),window.addEventListener("resize",r),()=>{n.disconnect(),window.removeEventListener("resize",r)}},[e]),[t,i]}(!v&&void 0===x);return(0,o.jsx)("div",{className:["ckeditor-editor","inline"===C?k["editor-inline"]:v?k["editor-document"]:k.editor].join(" "),ref:$,style:{maxWidth:(0,u.toCssDimension)(a),maxHeight:v?void 0:x??I},children:(0,o.jsx)(S,{defaultValue:i??"",editorConfig:_,editorType:C,fieldName:y,fieldTitle:"string"==typeof g.title?g.title:void 0,maxCharacters:p,onTextChange:e=>{null!=r&&r(e)},placeholder:m,readOnly:n,ref:h})})});E.displayName="CKEditorEditor";let A=a.componentConfig.wysiwyg.editor.name,R=null,T=()=>r.container.get(n.serviceIds["App/ComponentRegistry/ComponentRegistry"]),U={onInit:()=>{let e=T();R=e.has(A)?e.get(A):null}},K=["ckeditor","quill","default"],L=null,D="ckeditor",P=new Set,j=(e,t)=>{P.has(e)||(P.add(e),console.warn(`[ckeditor-studio-bundle] ${t}`))},B=e=>"string"==typeof e&&K.includes(e),N=(0,l.forwardRef)((e,t)=>{let{editor:i,...l}=e.editorConfig??{};void 0===i||B(i)||j(`invalid-${String(i)}`,`Unknown editor "${String(i)}" in a field's editor config; expected ckeditor, quill or default.`);let r=(e=>{if("quill"===e){if(null!==L)return L;j("quill",'The editor "quill" is selected, but no other editor bundle registered the wysiwyg editor (is PimcoreQuillBundle enabled in config/bundles.php?). Falling back to CKEditor.')}if("default"===e){if(null!==R)return R;j("default",'The editor "default" is selected, but Studio\'s built-in editor was not found. Falling back to CKEditor.')}return E})(B(i)?i:D);return(0,o.jsx)(r,{...e,editorConfig:l,ref:t})});N.displayName="SelectedEditor";let O={onInit:()=>{let e=T(),{editor:t}=g(),i=e.has(A)?e.get(A):null;L=null!==i&&i!==R&&i!==E&&i!==N?i:null,D=t,e.override({component:N,name:A})}};void 0!==(e=i.hmd(e)).hot&&e.hot.accept();let M={name:"ckeditor-studio-editor-slot-probe",priority:-1e3,onStartup:e=>{let{moduleSystem:t}=e;t.registerModule(U)}},F={name:"ckeditor-studio-plugin",priority:1e3,onInit:()=>{},onStartup:e=>{let{moduleSystem:t}=e;t.registerModule(O)}}}}]);