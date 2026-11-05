/*! For license information please see __federation_expose_default_export.12ccb89f.js.LICENSE.txt */
"use strict";(self.chunk_ckeditor_studio_bundle=self.chunk_ckeditor_studio_bundle||[]).push([["525"],{1020(e,t,i){var o=i(9673),l=Symbol.for("react.element"),n=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,a=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d={key:!0,ref:!0,__self:!0,__source:!0};function s(e,t,i){var o,n={},s=null,c=null;for(o in void 0!==i&&(s=""+i),void 0!==t.key&&(s=""+t.key),void 0!==t.ref&&(c=t.ref),t)r.call(t,o)&&!d.hasOwnProperty(o)&&(n[o]=t[o]);if(e&&e.defaultProps)for(o in t=e.defaultProps)void 0===n[o]&&(n[o]=t[o]);return{$$typeof:l,type:e,key:s,ref:c,props:n,_owner:a.current}}t.Fragment=n,t.jsx=s,t.jsxs=s},4848(e,t,i){e.exports=i(1020)},4276(e,t,i){i.r(t),i.d(t,{CKEditorPlugin:()=>T,CKEditorSlotProbePlugin:()=>U});var o=i(2977),l=i(4781),n=i(2703),r=i(4848),a=i(9673),d=i(9869),s=i(8267);let c=(0,i(2262).createStyles)(e=>{let{css:t,token:i}=e;return{editor:t`
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
    `}});var u=i(874),p=i(1543),m=i(2696),f=i(3842);let b=["undo","redo","|","heading","|","bold","italic","underline","|","alignment","|","bulletedList","numberedList","outdent","indent","|","blockQuote","link","insertTable","|","sourceEditing","fullscreen"],g={},h=()=>{var e,t,i,o,n,r,a,d,s,c,u,p;let m,f=l.appConfig.ckeditorStudio??{},h="string"==typeof f.licenseKey&&""!==f.licenseKey?f.licenseKey:null;return{editor:"quill"===f.editor||"default"===f.editor?f.editor:"ckeditor",licenseKey:h??"GPL",hasLicenseKey:null!==h,toolbar:Array.isArray(m=f.toolbar)&&m.length>0&&m.every(e=>"string"==typeof e)?f.toolbar:b,premium:{ai:{enabled:(null==(t=f.premium)||null==(e=t.ai)?void 0:e.enabled)===!0,config:(null==(o=f.premium)||null==(i=o.ai)?void 0:i.config)??g,container:(null==(r=f.premium)||null==(n=r.ai)?void 0:n.container)==="overlay"?"overlay":"sidebar"},realtimeCollaboration:{enabled:(null==(d=f.premium)||null==(a=d.realtimeCollaboration)?void 0:a.enabled)===!0,tokenUrl:(null==(c=f.premium)||null==(s=c.realtimeCollaboration)?void 0:s.tokenUrl)??null,webSocketUrl:(null==(p=f.premium)||null==(u=p.realtimeCollaboration)?void 0:u.webSocketUrl)??null}}}},k=Object.freeze({plugins:[],config:{},realtimeCollaborationActive:!1,toolbarItems:[]}),y="[ckeditor-studio-bundle]",v=async(e,t)=>{let{ai:o,realtimeCollaboration:l}=e.premium,[n]=await Promise.all([i.e("746").then(i.t.bind(i,3641,23)),Promise.all([i.e("29"),i.e("595")]).then(i.bind(i,7806))]),r={plugins:[],config:{},realtimeCollaborationActive:!1,toolbarItems:[]},a={};null!==l.tokenUrl&&""!==l.tokenUrl&&(a.tokenUrl=l.tokenUrl),null!==l.webSocketUrl&&""!==l.webSocketUrl&&(a.webSocketUrl=l.webSocketUrl),(void 0!==a.tokenUrl||void 0!==a.webSocketUrl)&&(r.config.cloudServices=a);let d=o.enabled&&null!==t.element&&void 0!==t.element&&null!==t.anchor&&void 0!==t.anchor;if(o.enabled&&(r.toolbarItems.push("toggleAi","aiQuickActions"),void 0===a.tokenUrl&&console.warn(`${y} ckeditor_studio.premium.ai is enabled without a Cloud Services token endpoint (ckeditor_studio.premium.realtime_collaboration.token_url, used for AI authentication even when the realtime_collaboration gate is off). The AI features will not reach the AI service unless premium.ai.config provides its own authentication (for example a legacy AI Assistant adapter).`),null!==t.root&&void 0!==t.root&&(r.config.root={title:t.root.title,description:t.root.description})),d){let d=t.element,{acquireSharedContext:s}=await i.e("199").then(i.bind(i,5306)),c=s(n,{key:`pimcore-${d.type}-${d.id}`,anchor:t.anchor,licenseKey:e.licenseKey,cloudServices:a,aiConfig:o.config,container:o.container,presence:l.enabled&&void 0!==a.tokenUrl&&void 0!==a.webSocketUrl});r.release=c.release;try{r.config.context=await c.contextPromise}catch(e){throw c.release(),e}r.plugins.push(n.AIEditorIntegration,n.AIQuickActions)}else o.enabled&&(r.plugins.push(n.AIEditorIntegration,n.AIChat,n.AIChatShortcuts,n.AIQuickActions,n.AIReviewMode,n.AITranslate),r.config.ai={container:{type:"overlay"},...o.config});return l.enabled&&(void 0===a.tokenUrl||void 0===a.webSocketUrl?console.warn(`${y} ckeditor_studio.premium.realtime_collaboration is enabled but token_url and/or web_socket_url is missing. Skipping real-time collaboration for this editor; the free feature set stays active.`):null===t.channelId?console.warn(`${y} ckeditor_studio.premium.realtime_collaboration is enabled but no collaboration channel id could be derived for this field (no open element context or no field name, for example in document editables). Skipping real-time collaboration for this editor. You can set an explicit editorConfig.collaboration.channelId per field to opt in.`):(r.plugins.push(n.RealTimeCollaborativeEditing),r.realtimeCollaborationActive=!0,r.config.sourceEditing={allowCollaborationFeatures:!0},d||null===t.presenceListContainer||void 0===t.presenceListContainer||(r.plugins.push(n.PresenceList),r.config.presenceList={container:t.presenceListContainer}))),null!==t.channelId&&(o.enabled||r.realtimeCollaborationActive)?r.config.collaboration={channelId:t.channelId}:o.enabled&&(r.config.collaboration={channelId:`pimcore-ai-${_()}`}),r},_=()=>"u">typeof crypto&&"function"==typeof crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now().toString(36),w=(0,a.forwardRef)((e,t)=>{let{editorType:i="classic",defaultValue:o="",onTextChange:n,maxCharacters:d,editorConfig:c,placeholder:b="",readOnly:g=!1,fieldName:_,fieldTitle:w}=e,{t:C}=(0,l.useTranslation)(),$=(0,a.useRef)(null),I=(0,a.useRef)(null);(0,a.useImperativeHandle)(t,()=>({onDrop:e=>{let t=$.current;null!==t&&function(e,t){let i=t.data,o=i.id,l=i.fullPath,n=!e.model.document.selection.isCollapsed;if("asset"===t.type){if("image"===i.type&&!n){let t,n=600,r=!1;void 0!==i.width&&(l=(0,m.createImageThumbnailUrl)(o,{width:600,mimeType:"JPEG"}),i.width<600&&["jpg","jpeg","gif","png"].includes((t=i.fullPath.split("."))[t.length-1].toLowerCase())&&(l=i.fullPath,r=!0),i.width<600&&(n=i.width));let a=[`src="${O(l)}"`,'alt="asset_image"',`style="width:${(0,s.toCssDimension)(n)};"`,`pimcore_id="${O(String(o))}"`,'pimcore_type="asset"'];r&&a.push('pimcore_disable_thumbnail="true"'),B(e,`<img ${a.join(" ")}>`);return}N(e,l,o,"asset");return}"document"===i.elementType&&("page"===i.type||"hardlink"===i.type||"link"===i.type)?N(e,l,o,"document"):"object"===i.elementType?N(e,l,o,"object"):N(e,l,o)}(t,e)}}));let S=(0,a.useMemo)(h,[]),E=(0,a.useMemo)(()=>(e=>{let{ai:t,realtimeCollaboration:i}=e.premium;return(!!t.enabled||!!i.enabled)&&(!!e.hasLicenseKey||(console.warn(`${y} Premium features are enabled in ckeditor_studio config but no license key is configured (CKEDITOR_LICENSE_KEY / ckeditor_studio.license_key). Falling back to the free feature set.`),!1))})(S),[S]),A=(0,f.useOptionalElementContext)(),R=(0,a.useRef)(null),U=(0,a.useRef)(null),[T,L]=(0,a.useState)(E?null:k);(0,a.useEffect)(()=>{var e;if(!E)return;let t=function(e,t,i,o){let l=null;if(null!==t)l={type:String(t.elementType),id:t.id};else if(null!==e){var n;let t=null==(n=e.ownerDocument.defaultView)?void 0:n.pimcore_document_id;("number"==typeof t||"string"==typeof t)&&""!==String(t)&&(l={type:"document",id:t})}if(void 0!==i&&""!==i)return{element:l,field:{name:i,title:void 0!==o&&""!==o?o:x(i),kind:"field"}};let r=(null==e?void 0:e.closest('.pimcore_editable[id^="pimcore_editable_"]'))??null;if(null!==r){let e=r.id.slice(17),t=r.dataset.realName??r.dataset.name??e;return{element:l,field:{name:e,title:x(t),kind:"editable"}}}return{element:l,field:null}}(U.current,A,_,w),i=null==c||null==(e=c.collaboration)?void 0:e.channelId,o=null;"string"==typeof i&&""!==i?o=i:null!==t.element&&null!==t.field&&(o=`pimcore-${t.element.type}-${t.element.id}-${t.field.name}`);let l=!1,n=null;return v(S,{channelId:o,presenceListContainer:R.current,element:t.element,anchor:U.current,root:null!==t.field&&null!==t.element?{title:t.field.title,description:`Rich text ${t.field.kind} "${t.field.name}" of the Pimcore ${t.element.type.replace("-"," ")} with id ${t.element.id}.`}:null}).then(e=>{if(l){var t;null==(t=e.release)||t.call(e);return}n=e,L(e)}).catch(e=>{console.error("[ckeditor-studio-bundle] Loading ckeditor5-premium-features failed; falling back to the free feature set.",e),l||L(k)}),()=>{var e;l=!0,null==n||null==(e=n.release)||e.call(n)}},[]);let P=(0,a.useMemo)(()=>{if(null===T)return null;let e="inline"===i,t=e?S.toolbar.filter(e=>"fullscreen"!==e):S.toolbar;return{licenseKey:S.licenseKey,plugins:[p.Essentials,p.Paragraph,p.Heading,p.Bold,p.Italic,p.Underline,p.Alignment,p.Link,p.List,p.Indent,p.BlockQuote,p.Table,p.TableToolbar,p.Image,p.ImageResize,p.SourceEditing,p.GeneralHtmlSupport,...e?[]:[p.Fullscreen],...T.plugins],toolbar:{items:0===T.toolbarItems.length?t:[...t,"|",...T.toolbarItems.filter(e=>!t.includes(e))],shouldNotGroupWhenFull:e},table:{contentToolbar:["tableColumn","tableRow","mergeTableCells"]},htmlSupport:{allow:[{name:/^.*$/,attributes:["pimcore_id","pimcore_type","pimcore_disable_thumbnail","id"],classes:!0,styles:!0}]},initialData:o,...""!==b?{placeholder:b}:{},...T.config,...c??{}}},[T]);(0,a.useEffect)(()=>{let e=$.current;null===e||(null==T?void 0:T.realtimeCollaborationActive)!==!0&&o!==I.current&&o!==e.getData()&&e.setData(o)},[o,T]);let D=e=>{$.current=e,function(e){var t;let i=null==(t=e.config.get("roots"))?void 0:t.main,o="string"==typeof(null==i?void 0:i.title)?i.title:null,l="string"==typeof(null==i?void 0:i.description)?i.description:null;if(null===o&&null===l)return;let n=e.model.document.getRoot();null!==n&&(n.getAttribute("$title")!==(o??void 0)||n.getAttribute("$description")!==(l??void 0))&&e.model.enqueueChange({isUndoable:!1},e=>{null!==o&&e.setAttribute("$title",o,n),null!==l&&e.setAttribute("$description",l,n)})}(e),j(e,e.getData())},K=(e,t)=>{let i=t.getData();I.current=i,null==n||n(i),j(t,i)};return(0,r.jsxs)(r.Fragment,{children:[E&&(0,r.jsx)("span",{hidden:!0,ref:U}),E&&S.premium.realtimeCollaboration.enabled&&(0,r.jsx)("div",{className:"ckeditor-presence-list",ref:R}),null!==P&&("inline"===i?(0,r.jsx)(u.CKEditor,{config:P,disabled:g,editor:p.InlineEditor,onChange:K,onReady:D}):(0,r.jsx)(u.CKEditor,{config:P,disabled:g,editor:p.ClassicEditor,onChange:K,onReady:D}))]});function j(e,t){let i=e.editing.view.getDomRoot();if(void 0===i)return;i.style.border="",i.setAttribute("title","");let o=t.replace(/<[^>]*>/g,"").length;"number"==typeof d&&0!==d&&o>d&&(i.style.border="1px solid red",i.setAttribute("title",C("maximum_length_is")+" "+String(d)))}function B(e,t){let i=e.data.processor.toView(t),o=e.data.toModel(i);e.model.insertContent(o)}function O(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function N(e,t,i,o){if(!e.model.document.selection.isCollapsed)return void e.execute("link",t);let l=void 0!==o?` pimcore_type="${O(o)}"`:"";B(e,`<a href="${O(t)}" pimcore_id="${O(String(i))}"${l}>${O(t)}</a>`)}});function x(e){let t=e.replace(/[_-]+/g," ").replace(/([a-z])([A-Z0-9])/g,"$1 $2").trim().toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}w.displayName="Editor";let C=(0,a.forwardRef)((e,t)=>{let{value:i,onChange:o,disabled:l,width:n,height:u,maxCharacters:p,placeholder:m,editorConfig:f,context:b,...g}=e,h=(0,a.useRef)(null),{styles:k}=c(),y=function(e){let t=e.combinedFieldName;if("string"==typeof t&&""!==t)return t;let i=e.name;return Array.isArray(i)&&i.length>0?i.map(String).join("."):"string"==typeof i&&""!==i?i:void 0}(g);(0,a.useImperativeHandle)(t,()=>({onDrop:e=>{var t;null==(t=h.current)||t.onDrop(e)}}));let v=b===d.WysiwygContext.DOCUMENT,{editorType:_,...x}=f??{},C=v&&"inline"===_?"inline":"classic",$=(0,s.toCssDimension)(u),[I,S]=function(e){let t=(0,a.useRef)(null),[i,o]=(0,a.useState)(void 0);return(0,a.useLayoutEffect)(()=>{let i=t.current;if(!e||null===i)return void o(void 0);let l=function(e){let t=e.parentElement;for(;null!==t;){if(/(auto|scroll)/.test(getComputedStyle(t).overflowY))return t;t=t.parentElement}return null}(i),n=()=>{let e=Math.round(.7*window.innerHeight);if(null===l||0===l.clientHeight)return void o(e);let t=i.getBoundingClientRect().top-l.getBoundingClientRect().top+l.scrollTop;o(Math.max(320,Math.min(e,t<l.clientHeight?l.clientHeight-t-16:l.clientHeight-32)))};n();let r=new ResizeObserver(n);return null!==l&&r.observe(l),window.addEventListener("resize",n),()=>{r.disconnect(),window.removeEventListener("resize",n)}},[e]),[t,i]}(!v&&void 0===$);return(0,r.jsx)("div",{className:["ckeditor-editor","inline"===C?k["editor-inline"]:v?k["editor-document"]:k.editor].join(" "),ref:I,style:{maxWidth:(0,s.toCssDimension)(n),maxHeight:$??S},children:(0,r.jsx)(w,{defaultValue:i??"",editorConfig:x,editorType:C,fieldName:y,fieldTitle:"string"==typeof g.title?g.title:void 0,maxCharacters:p,onTextChange:e=>{null!=o&&o(e)},placeholder:m,readOnly:l,ref:h})})});C.displayName="CKEditorEditor";let $="[ckeditor-studio-bundle]",I=n.componentConfig.wysiwyg.editor.name,S=null,E=()=>o.container.get(l.serviceIds["App/ComponentRegistry/ComponentRegistry"]),A={onInit:()=>{let e=E();S=e.has(I)?e.get(I):null}},R={onInit:()=>{let e=E(),{editor:t}=h(),i=e.has(I)?e.get(I):null,o=null!==i&&i!==S&&i!==C;if("quill"===t){if(o)return;console.warn(`${$} ckeditor_studio.editor is "quill", but no other editor bundle registered the wysiwyg editor (is PimcoreQuillBundle enabled in config/bundles.php?). Falling back to CKEditor.`)}if("default"===t){if(null!==S)return void e.override({component:S,name:I});console.warn(`${$} ckeditor_studio.editor is "default", but Studio's built-in editor was not found. Falling back to CKEditor.`)}e.override({component:C,name:I})}};void 0!==(e=i.hmd(e)).hot&&e.hot.accept();let U={name:"ckeditor-studio-editor-slot-probe",priority:-1e3,onStartup:e=>{let{moduleSystem:t}=e;t.registerModule(A)}},T={name:"ckeditor-studio-plugin",priority:1e3,onInit:()=>{},onStartup:e=>{let{moduleSystem:t}=e;t.registerModule(R)}}}}]);