/*! For license information please see __federation_expose_default_export.6d60369b.js.LICENSE.txt */
"use strict";(self.chunk_ckeditor_studio_bundle=self.chunk_ckeditor_studio_bundle||[]).push([["525"],{1020(e,t,i){var o=i(9673),l=Symbol.for("react.element"),n=Symbol.for("react.fragment"),r=Object.prototype.hasOwnProperty,a=o.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,d={key:!0,ref:!0,__self:!0,__source:!0};function u(e,t,i){var o,n={},u=null,s=null;for(o in void 0!==i&&(u=""+i),void 0!==t.key&&(u=""+t.key),void 0!==t.ref&&(s=t.ref),t)r.call(t,o)&&!d.hasOwnProperty(o)&&(n[o]=t[o]);if(e&&e.defaultProps)for(o in t=e.defaultProps)void 0===n[o]&&(n[o]=t[o]);return{$$typeof:l,type:e,key:u,ref:s,props:n,_owner:a.current}}t.Fragment=n,t.jsx=u,t.jsxs=u},4848(e,t,i){e.exports=i(1020)},4276(e,t,i){i.r(t),i.d(t,{CKEditorPlugin:()=>T,CKEditorSlotProbePlugin:()=>U});var o=i(2977),l=i(4781),n=i(2703),r=i(4848),a=i(9673),d=i(9869),u=i(8267);let s=(0,i(2262).createStyles)(e=>{let{css:t,token:i}=e;return{editor:t`
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
    `}});var c=i(874),m=i(1543),p=i(2696),f=i(3842);let b=["undo","redo","|","heading","|","bold","italic","underline","|","alignment","|","bulletedList","numberedList","outdent","indent","|","blockQuote","link","insertTable","|","sourceEditing","fullscreen"],g={},h=()=>{var e,t,i,o,n,r,a,d,u,s,c,m;let p,f=l.appConfig.ckeditorStudio??{},h="string"==typeof f.licenseKey&&""!==f.licenseKey?f.licenseKey:null;return{editor:"quill"===f.editor||"default"===f.editor?f.editor:"ckeditor",licenseKey:h??"GPL",hasLicenseKey:null!==h,toolbar:Array.isArray(p=f.toolbar)&&p.length>0&&p.every(e=>"string"==typeof e)?f.toolbar:b,premium:{ai:{enabled:(null==(t=f.premium)||null==(e=t.ai)?void 0:e.enabled)===!0,config:(null==(o=f.premium)||null==(i=o.ai)?void 0:i.config)??g,container:(null==(r=f.premium)||null==(n=r.ai)?void 0:n.container)==="overlay"?"overlay":"sidebar"},realtimeCollaboration:{enabled:(null==(d=f.premium)||null==(a=d.realtimeCollaboration)?void 0:a.enabled)===!0,tokenUrl:(null==(s=f.premium)||null==(u=s.realtimeCollaboration)?void 0:u.tokenUrl)??null,webSocketUrl:(null==(m=f.premium)||null==(c=m.realtimeCollaboration)?void 0:c.webSocketUrl)??null}}}},k=Object.freeze({plugins:[],config:{},realtimeCollaborationActive:!1,toolbarItems:[]}),y="[ckeditor-studio-bundle]",v=async(e,t)=>{let{ai:o,realtimeCollaboration:l}=e.premium,[n]=await Promise.all([i.e("746").then(i.t.bind(i,3641,23)),Promise.all([i.e("29"),i.e("595")]).then(i.bind(i,7806))]),r={plugins:[],config:{},realtimeCollaborationActive:!1,toolbarItems:[]},a={};null!==l.tokenUrl&&""!==l.tokenUrl&&(a.tokenUrl=l.tokenUrl),null!==l.webSocketUrl&&""!==l.webSocketUrl&&(a.webSocketUrl=l.webSocketUrl),(void 0!==a.tokenUrl||void 0!==a.webSocketUrl)&&(r.config.cloudServices=a);let d=o.enabled&&null!==t.element&&void 0!==t.element&&null!==t.anchor&&void 0!==t.anchor;if(o.enabled&&(r.toolbarItems.push("toggleAi","aiQuickActions"),void 0===a.tokenUrl&&console.warn(`${y} ckeditor_studio.premium.ai is enabled without a Cloud Services token endpoint (ckeditor_studio.premium.realtime_collaboration.token_url, used for AI authentication even when the realtime_collaboration gate is off). The AI features will not reach the AI service unless premium.ai.config provides its own authentication (for example a legacy AI Assistant adapter).`),null!==t.root&&void 0!==t.root&&(r.config.root={title:t.root.title,description:t.root.description})),d){let d=t.element,{acquireSharedContext:u}=await i.e("199").then(i.bind(i,5306)),s=u(n,{key:`pimcore-${d.type}-${d.id}`,anchor:t.anchor,licenseKey:e.licenseKey,cloudServices:a,aiConfig:o.config,container:o.container,presence:l.enabled&&void 0!==a.tokenUrl&&void 0!==a.webSocketUrl});r.release=s.release;try{r.config.context=await s.contextPromise}catch(e){throw s.release(),e}r.plugins.push(n.AIEditorIntegration,n.AIQuickActions)}else o.enabled&&(r.plugins.push(n.AIEditorIntegration,n.AIChat,n.AIChatShortcuts,n.AIQuickActions,n.AIReviewMode,n.AITranslate),r.config.ai={container:{type:"overlay"},...o.config});return l.enabled&&(void 0===a.tokenUrl||void 0===a.webSocketUrl?console.warn(`${y} ckeditor_studio.premium.realtime_collaboration is enabled but token_url and/or web_socket_url is missing. Skipping real-time collaboration for this editor; the free feature set stays active.`):null===t.channelId?console.warn(`${y} ckeditor_studio.premium.realtime_collaboration is enabled but no collaboration channel id could be derived for this field (no open element context or no field name, for example in document editables). Skipping real-time collaboration for this editor. You can set an explicit editorConfig.collaboration.channelId per field to opt in.`):(r.plugins.push(n.RealTimeCollaborativeEditing),r.realtimeCollaborationActive=!0,r.config.sourceEditing={allowCollaborationFeatures:!0},d||null===t.presenceListContainer||void 0===t.presenceListContainer||(r.plugins.push(n.PresenceList),r.config.presenceList={container:t.presenceListContainer}))),null!==t.channelId&&(o.enabled||r.realtimeCollaborationActive)?r.config.collaboration={channelId:t.channelId}:o.enabled&&(r.config.collaboration={channelId:`pimcore-ai-${w()}`}),r},w=()=>"u">typeof crypto&&"function"==typeof crypto.randomUUID?crypto.randomUUID():Math.random().toString(36).slice(2)+Date.now().toString(36),_=(0,a.forwardRef)((e,t)=>{let{defaultValue:i="",onTextChange:o,maxCharacters:n,editorConfig:d,placeholder:s="",readOnly:b=!1,fieldName:g,fieldTitle:w}=e,{t:_}=(0,l.useTranslation)(),x=(0,a.useRef)(null),$=(0,a.useRef)(null);(0,a.useImperativeHandle)(t,()=>({onDrop:e=>{let t=x.current;null!==t&&function(e,t){let i=t.data,o=i.id,l=i.fullPath,n=!e.model.document.selection.isCollapsed;if("asset"===t.type){if("image"===i.type&&!n){let t,n=600,r=!1;void 0!==i.width&&(l=(0,p.createImageThumbnailUrl)(o,{width:600,mimeType:"JPEG"}),i.width<600&&["jpg","jpeg","gif","png"].includes((t=i.fullPath.split("."))[t.length-1].toLowerCase())&&(l=i.fullPath,r=!0),i.width<600&&(n=i.width));let a=[`src="${K(l)}"`,'alt="asset_image"',`style="width:${(0,u.toCssDimension)(n)};"`,`pimcore_id="${K(String(o))}"`,'pimcore_type="asset"'];r&&a.push('pimcore_disable_thumbnail="true"'),P(e,`<img ${a.join(" ")}>`);return}j(e,l,o,"asset");return}"document"===i.elementType&&("page"===i.type||"hardlink"===i.type||"link"===i.type)?j(e,l,o,"document"):"object"===i.elementType?j(e,l,o,"object"):j(e,l,o)}(t,e)}}));let I=(0,a.useMemo)(h,[]),S=(0,a.useMemo)(()=>(e=>{let{ai:t,realtimeCollaboration:i}=e.premium;return(!!t.enabled||!!i.enabled)&&(!!e.hasLicenseKey||(console.warn(`${y} Premium features are enabled in ckeditor_studio config but no license key is configured (CKEDITOR_LICENSE_KEY / ckeditor_studio.license_key). Falling back to the free feature set.`),!1))})(I),[I]),A=(0,f.useOptionalElementContext)(),E=(0,a.useRef)(null),R=(0,a.useRef)(null),[U,T]=(0,a.useState)(S?null:k);(0,a.useEffect)(()=>{var e;if(!S)return;let t=function(e,t,i,o){let l=null;if(null!==t)l={type:String(t.elementType),id:t.id};else if(null!==e){var n;let t=null==(n=e.ownerDocument.defaultView)?void 0:n.pimcore_document_id;("number"==typeof t||"string"==typeof t)&&""!==String(t)&&(l={type:"document",id:t})}if(void 0!==i&&""!==i)return{element:l,field:{name:i,title:void 0!==o&&""!==o?o:C(i),kind:"field"}};let r=(null==e?void 0:e.closest('.pimcore_editable[id^="pimcore_editable_"]'))??null;if(null!==r){let e=r.id.slice(17),t=r.dataset.realName??r.dataset.name??e;return{element:l,field:{name:e,title:C(t),kind:"editable"}}}return{element:l,field:null}}(R.current,A,g,w),i=null==d||null==(e=d.collaboration)?void 0:e.channelId,o=null;"string"==typeof i&&""!==i?o=i:null!==t.element&&null!==t.field&&(o=`pimcore-${t.element.type}-${t.element.id}-${t.field.name}`);let l=!1,n=null;return v(I,{channelId:o,presenceListContainer:E.current,element:t.element,anchor:R.current,root:null!==t.field&&null!==t.element?{title:t.field.title,description:`Rich text ${t.field.kind} "${t.field.name}" of the Pimcore ${t.element.type.replace("-"," ")} with id ${t.element.id}.`}:null}).then(e=>{if(l){var t;null==(t=e.release)||t.call(e);return}n=e,T(e)}).catch(e=>{console.error("[ckeditor-studio-bundle] Loading ckeditor5-premium-features failed; falling back to the free feature set.",e),l||T(k)}),()=>{var e;l=!0,null==n||null==(e=n.release)||e.call(n)}},[]);let L=(0,a.useMemo)(()=>null===U?null:{licenseKey:I.licenseKey,plugins:[m.Essentials,m.Paragraph,m.Heading,m.Bold,m.Italic,m.Underline,m.Alignment,m.Link,m.List,m.Indent,m.BlockQuote,m.Table,m.TableToolbar,m.Image,m.ImageResize,m.SourceEditing,m.GeneralHtmlSupport,m.Fullscreen,...U.plugins],toolbar:0===U.toolbarItems.length?I.toolbar:[...I.toolbar,"|",...U.toolbarItems.filter(e=>!I.toolbar.includes(e))],table:{contentToolbar:["tableColumn","tableRow","mergeTableCells"]},htmlSupport:{allow:[{name:/^.*$/,attributes:["pimcore_id","pimcore_type","pimcore_disable_thumbnail","id"],classes:!0,styles:!0}]},initialData:i,...""!==s?{placeholder:s}:{},...U.config,...d??{}},[U]);return(0,a.useEffect)(()=>{let e=x.current;null===e||(null==U?void 0:U.realtimeCollaborationActive)!==!0&&i!==$.current&&i!==e.getData()&&e.setData(i)},[i,U]),(0,r.jsxs)(r.Fragment,{children:[S&&(0,r.jsx)("span",{hidden:!0,ref:R}),S&&I.premium.realtimeCollaboration.enabled&&(0,r.jsx)("div",{className:"ckeditor-presence-list",ref:E}),null!==L&&(0,r.jsx)(c.CKEditor,{config:L,disabled:b,editor:m.ClassicEditor,onChange:(e,t)=>{let i=t.getData();$.current=i,null==o||o(i),D(t,i)},onReady:e=>{x.current=e,function(e){var t;let i=null==(t=e.config.get("roots"))?void 0:t.main,o="string"==typeof(null==i?void 0:i.title)?i.title:null,l="string"==typeof(null==i?void 0:i.description)?i.description:null;if(null===o&&null===l)return;let n=e.model.document.getRoot();null!==n&&(n.getAttribute("$title")!==(o??void 0)||n.getAttribute("$description")!==(l??void 0))&&e.model.enqueueChange({isUndoable:!1},e=>{null!==o&&e.setAttribute("$title",o,n),null!==l&&e.setAttribute("$description",l,n)})}(e),D(e,e.getData())}})]});function D(e,t){let i=e.editing.view.getDomRoot();if(void 0===i)return;i.style.border="",i.setAttribute("title","");let o=t.replace(/<[^>]*>/g,"").length;"number"==typeof n&&0!==n&&o>n&&(i.style.border="1px solid red",i.setAttribute("title",_("maximum_length_is")+" "+String(n)))}function P(e,t){let i=e.data.processor.toView(t),o=e.data.toModel(i);e.model.insertContent(o)}function K(e){return e.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function j(e,t,i,o){if(!e.model.document.selection.isCollapsed)return void e.execute("link",t);let l=void 0!==o?` pimcore_type="${K(o)}"`:"";P(e,`<a href="${K(t)}" pimcore_id="${K(String(i))}"${l}>${K(t)}</a>`)}});function C(e){let t=e.replace(/[_-]+/g," ").replace(/([a-z])([A-Z0-9])/g,"$1 $2").trim().toLowerCase();return t.charAt(0).toUpperCase()+t.slice(1)}_.displayName="Editor";let x=(0,a.forwardRef)((e,t)=>{let{value:i,onChange:o,disabled:l,width:n,height:c,maxCharacters:m,placeholder:p,editorConfig:f,context:b,...g}=e,h=(0,a.useRef)(null),{styles:k}=s(),y=function(e){let t=e.combinedFieldName;if("string"==typeof t&&""!==t)return t;let i=e.name;return Array.isArray(i)&&i.length>0?i.map(String).join("."):"string"==typeof i&&""!==i?i:void 0}(g);(0,a.useImperativeHandle)(t,()=>({onDrop:e=>{var t;null==(t=h.current)||t.onDrop(e)}}));let v=b===d.WysiwygContext.DOCUMENT,w=(0,u.toCssDimension)(c),[C,x]=function(e){let t=(0,a.useRef)(null),[i,o]=(0,a.useState)(void 0);return(0,a.useLayoutEffect)(()=>{let i=t.current;if(!e||null===i)return void o(void 0);let l=function(e){let t=e.parentElement;for(;null!==t;){if(/(auto|scroll)/.test(getComputedStyle(t).overflowY))return t;t=t.parentElement}return null}(i),n=()=>{let e=Math.round(.7*window.innerHeight);if(null===l||0===l.clientHeight)return void o(e);let t=i.getBoundingClientRect().top-l.getBoundingClientRect().top+l.scrollTop;o(Math.max(320,Math.min(e,t<l.clientHeight?l.clientHeight-t-16:l.clientHeight-32)))};n();let r=new ResizeObserver(n);return null!==l&&r.observe(l),window.addEventListener("resize",n),()=>{r.disconnect(),window.removeEventListener("resize",n)}},[e]),[t,i]}(!v&&void 0===w);return(0,r.jsx)("div",{className:["ckeditor-editor",v?k["editor-document"]:k.editor].join(" "),ref:C,style:{maxWidth:(0,u.toCssDimension)(n),maxHeight:w??x},children:(0,r.jsx)(_,{defaultValue:i??"",editorConfig:f,fieldName:y,fieldTitle:"string"==typeof g.title?g.title:void 0,maxCharacters:m,onTextChange:e=>{null!=o&&o(e)},placeholder:p,readOnly:l,ref:h})})});x.displayName="CKEditorEditor";let $="[ckeditor-studio-bundle]",I=n.componentConfig.wysiwyg.editor.name,S=null,A=()=>o.container.get(l.serviceIds["App/ComponentRegistry/ComponentRegistry"]),E={onInit:()=>{let e=A();S=e.has(I)?e.get(I):null}},R={onInit:()=>{let e=A(),{editor:t}=h(),i=e.has(I)?e.get(I):null,o=null!==i&&i!==S&&i!==x;if("quill"===t){if(o)return;console.warn(`${$} ckeditor_studio.editor is "quill", but no other editor bundle registered the wysiwyg editor (is PimcoreQuillBundle enabled in config/bundles.php?). Falling back to CKEditor.`)}if("default"===t){if(null!==S)return void e.override({component:S,name:I});console.warn(`${$} ckeditor_studio.editor is "default", but Studio's built-in editor was not found. Falling back to CKEditor.`)}e.override({component:x,name:I})}};void 0!==(e=i.hmd(e)).hot&&e.hot.accept();let U={name:"ckeditor-studio-editor-slot-probe",priority:-1e3,onStartup:e=>{let{moduleSystem:t}=e;t.registerModule(E)}},T={name:"ckeditor-studio-plugin",priority:1e3,onInit:()=>{},onStartup:e=>{let{moduleSystem:t}=e;t.registerModule(R)}}}}]);