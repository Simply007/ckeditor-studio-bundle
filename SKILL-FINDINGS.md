# Skill findings: building the CKEditor Studio bundle with agent skills

Experiment log for the PCDD 2026 talk. Each entry: what the step was, which skill
guided it, where the skill was missing, wrong or insufficient, and where the fallback
was reading quill-bundle source or vendor code. Dated 2026-11-05.

## Step 0: finding the skills at all (2026-11-05)

- The repo symlinks `.claude/skills/*` into `skills-vendor/` git submodules. In a fresh
  git worktree the submodules are empty, so every Pimcore skill file 404s until
  `git submodule update --init` is run. Gap in the official distribution model (clone +
  symlink): skills silently vanish in worktrees and shallow clones. The CKEditor skills
  (vendored as real files in `.agents/skills/`) survived the worktree without any step.

## Step 1: PHP bundle scaffold

- Guided by: `pimcore-studio-bundle-setup`. Provided the complete recipe: bundle class
  extending `AbstractPimcoreBundle`, `composer.json` with `type: pimcore-bundle` and
  `extra.pimcore.bundles`, the `WebpackEntryPointProvider` with the
  `pimcore_studio_ui.webpack_entry_point_provider` tag, and the services yaml. All of it
  matched the real quill-bundle shape closely. Genuinely useful.
- Gap 1 (version drift): the skill says `@pimcore/studio-ui-bundle` "has no stable
  release yet, only canary versions" and pins `^1.0` in composer. Reality on 2026-11-05:
  npm `latest` is stable `2026.3.4` and quill-bundle requires `^2026.2.1`. The skill
  predates the 2026 versioning switch.
- Gap 2 (distribution route): the skill only knows the `entrypoints.json` glob route.
  quill-bundle actually ships its frontend as a committed zip (`BuildArchiveProviderInterface`
  + `BuildArchiveExtractionTrait`, extracted on demand, read-only-FS aware). Neither that
  interface nor when to prefer it is mentioned anywhere in the 33 official skills. Fallback:
  read `vendor/pimcore/studio-ui-bundle/src/Build/*` to confirm the glob
  (`<targetDir>/*/entrypoints.json`) so the plain-provider route stays compatible.
- Gap 3: the skill does not mention `PrependExtensionInterface` guarding the services
  load with `hasExtension('pimcore_studio_ui')` (quill does this so the bundle survives
  installs without Studio). Fallback: quill-bundle source.

## Step 2: finding the wysiwyg editor extension point (the core of this task)

- Guided by: NO skill. This was the single most important fact of the whole build (how
  does a bundle replace the Studio wysiwyg editor?) and none of the 33 official skills
  mentions `componentConfig.wysiwyg.editor`, `WysiwygProps`, `WysiwygEditorRef` or the
  pattern "override the wysiwyg.editor single component".
- `pimcore-studio-ui-using-sdk-in-bundles` got close: it documents
  `ComponentRegistry` with `override(name, component)` and `registerToSlot`. Two problems:
  its override signature is wrong for 2026.3 (actual API takes one object:
  `override({ component, name })`), and it points to `component-config.ts` without saying
  the wysiwyg editor is one of those single components.
- Fallback: quill-bundle source (`modules/quill-editor/index.tsx`) gave the exact
  registration in 8 lines, and `vendor/pimcore/studio-ui-bundle/assets/js/src/core/modules/wysiwyg/`
  gave the `WysiwygProps`/`WysiwygEditorRef` contract and confirmed the resolver
  (`ComponentRenderer` with `componentConfig.wysiwyg.editor.name`). Without the quill
  blueprint this would have been a long vendor-source archaeology session.
- Correct serviceId also came from quill source: `serviceIds['App/ComponentRegistry/ComponentRegistry']`,
  not the `serviceIds.componentRegistry` spelling the SDK skill uses in one example.

## Step 3: rsbuild + module federation config

- Guided by: `pimcore-studio-bundle-setup` for the overall shape (entry stub `main.ts`,
  `exposes: { '.': './js/src/plugins.ts' }`, shared react singletons, unique name/port,
  assetPrefix rule).
- Wrong/stale in the skill vs quill 2026.x reality, found only by diffing quill source:
  - buildId: skill generates `uuid.v4()` per build; quill uses
    `getBuildGroupId(__dirname)` + `pluginWriteBuildId` from
    `@pimcore/studio-ui-bundle/bundler/build-id` (content-group based, required so
    `studio-package-build` picks the right dir).
  - remote: skill uses `createDynamicRemote('pimcore_studio_ui_bundle')` from
    `rsbuild/utils`; quill inlines a promise-based remote reading
    `window.StudioUIBundleRemoteUrl`. Took quill's proven variant.
  - assetPrefix: skill says `/bundles/<name>/build/`; quill (and the committed-output
    convention `public/studio/build/`) needs `/bundles/<name>/studio/build/`.
  - `inversify` must be in module federation `shared` with `eager: true` and version
    `6.1.x`; the skill omits it entirely.
- `pimcore-studio-ui-bundle-structure` correctly predicted the `assets/studio/` layout
  (the setup skill says `assets/` without the `studio/` level; quill confirms `assets/studio/`).
- Carried-over upstream bug, noted: quill's own `tsconfig.json` has
  `baseUrl: "./assets/js/"` which does not exist at that level; used `./js/` per the
  setup skill instead. Type-check passes.
- rsbuild does not empty the build dir it writes into: a dev build followed by a prod
  build left mixed artifacts in the same `<build-id>` dir (quill's config only cleans
  OTHER build dirs). Had to `rm -rf` and rebuild. No skill warns about this; quill's
  config comment hints at it for a different reason.

## Step 4: CKEditor integration

- Guided by: `ckeditor` skill (`.agents/skills/ckeditor/`). Its decision router worked
  as designed: npm install method (build step exists), free fork (`licenseKey: 'GPL'`),
  classic editor type, official React wrapper, single-package model (`ckeditor5` +
  `ckeditor5/ckeditor5.css`, no deprecated predefined builds, no deep imports, no
  hand-written webpack loaders). `references/installation.md` was current (v49.1.0,
  wrapper v12). This skill was accurate end to end; no fallback needed for the CKEditor
  side.
- One mismatch with the skill's verification tier: it demands a browser/runtime check,
  which this lane explicitly must not do (live stack belongs to another lane). Logged as
  "unproven" in TESTING.md instead; the skill's tier 3 ("instruct the user") covers it.
- The `ckeditor-bundle` skill, which the task listed as mandatory reading, is about a
  completely different "bundle": the CKEditor Cloud Services server-side editor bundle.
  Correctly out of scope here, and its own "do not apply" section says so. Finding for
  the talk: the word "bundle" collides hard between the Pimcore world (Symfony bundle)
  and the CKEditor world (server editor build); an agent following name similarity would
  have read 8 reference files for nothing.
- Impedance mismatch no skill covers: Pimcore passes `editorConfig` (Quill-shaped in
  2026.x) and quill-bundle re-implements Pimcore drop semantics (`pimcore_id`/
  `pimcore_type` Parchment attributors, thumbnail routing). The CKEditor equivalents
  (GeneralHtmlSupport allow-list, `data.toModel` HTML insertion, link command limits on
  applying custom attributes to a selection) had to be designed from CKEditor docs
  knowledge + quill behavior, with no guidance from either skill family. This is exactly
  the gap a would-be official `pimcore-wysiwyg-editor-integration` skill should fill:
  the WysiwygProps contract, the drop payload shape, and the pimcore_* attribute
  conventions.

## Step 5: validation

- `pimcore-studio-ui-bundle-structure` provided the safety rule actually followed:
  never start/stop dev servers, builds only when no dev server runs (this package is
  isolated, so its own build was safe), `check-types` always safe.
- php -l clean (3 files), `tsc --noEmit` clean, production build 3.1 MB with
  `entrypoints.json` containing the `exposeRemote` entry the PHP provider declares.
  Runtime behavior is untested by design; see TESTING.md.

## Step 6: blog content model demo (user-requested extension, 2026-11-05)

- Ondrej asked mid-build for a visible use case: a BlogPost class (content model in the
  database) with the CKEditor wysiwyg field, plus blog listing/detail pages.
- Guided by: no skill. The 33 official skills are Studio-bundle-only; the CORS `pimcore`
  platform skill was not consulted for this (timebox). Everything came from vendor source
  verification: `ClassDefinition\Data\Wysiwyg` and `Data\Date` exist,
  `Layout::addChild()` exists, skeleton `config/routes.yaml` auto-imports attribute
  routes from `src/Controller/`.
- Observation for the talk: "define a class programmatically and render it on a page"
  is the first thing a Pimcore newcomer does, and no skill in either repo covers the
  `ClassDefinition` builder API or the Listing/controller/Twig loop. The in-repo
  `pimcore-onboarding` skill is the natural home.

## Step 7: configurable license key, toolbar and premium gates (2026-11-05)

Branch `feat/configurable-ckeditor`: license-key gating (env CKEDITOR_LICENSE_KEY),
yaml toolbar presets and scaffolded premium gates (CKEditor AI, real-time
collaboration), surfaced to the frontend at runtime.

- Guided by: the `ckeditor` skill's `references/licensing.md`. Accurate and
  sufficient for the CKEditor side: GPL vs commercial key semantics, the portal,
  `ckeditor5-premium-features` at the exact same version as `ckeditor5`, Cloud
  Services credentials for collaboration, "is a feature premium" heuristic. No
  fallback needed there.
- Guided by: NO Pimcore skill. The mechanism this whole task runs on, bundle config
  reaching the Studio frontend at runtime, is `AppConfigProviderInterface` + the
  `pimcore_studio_ui.app_config_provider` tag (merged into the `data-app-config`
  attribute on the Studio shell page, read back via the `appConfig` export of
  `@pimcore/studio-ui-bundle/app`). None of the 33 official skills mentions it; the
  interface's own docblock in vendor source is the only documentation, and the
  frontend-side `appConfig` export was found by reading `sdk/app/index.ts`
  re-exports. This is the natural companion fact to the `componentConfig` override
  from step 2 and belongs in the same missing skill.
- Decision: runtime injection via the app config provider instead of build-time env
  substitution (rsbuild define). Build-time would bake license keys into the
  committed build output and require a rebuild per config change; runtime needs only
  `cache:clear`. The env default pattern (`$container->setParameter('env(CKEDITOR_LICENSE_KEY)', '')`)
  is standard Symfony, not skill-covered, but training data sufficed.
- Decision: the premium path stays scaffolded and `ckeditor5-premium-features` is NOT
  installed, so the committed build remains a clean open source (GPL) build. Enabled
  flags without wiring log a console warning and keep the free feature set instead of
  breaking the editor.
- Found while wiring the toolbar: Studio core already merges
  `appConfig.wysiwyg.defaultEditorConfig.dataObject|document` into the `editorConfig`
  prop (dynamic-type wysiwyg definitions), so there are two legitimate config layers;
  README now documents the precedence (bundle defaults < ckeditor_studio.toolbar <
  editorConfig pass-through). No skill on either side mentions this collision.
- Verification (full loop, stack booted): `tsc --noEmit` and the production build
  pass; `cache:clear` compiles the new Configuration + tagged service;
  `assets:install` publishes the new build id; `curl` of the Studio shell page shows
  the `ckeditorStudio` key with `licenseKey: null` and the default toolbar in
  `data-app-config`; `debug:container --env-var=CKEDITOR_LICENSE_KEY` confirms "" by
  default and the real value when the env var is set on the container.

## Step 8: real premium wiring, dynamically loaded (2026-11-05)

Branch `feat/configurable-ckeditor`, continued: the premium gates from step 7 are now
real. `ckeditor5-premium-features@49.1.0` (exact version match with `ckeditor5`) is
installed and loaded through dynamic import() only when a license key is configured
and a gate is enabled; CKEditor AI and real-time collaboration are wired.

- Guided by: the hosted CKEditor docs MCP (`search_ck_editor_knowledge_sources`),
  which turned out to be the decisive source here, above the vendored skill. The
  `ckeditor` skill's `references/licensing.md` correctly gives the durable premium
  concepts (same-version rule, portal, premium CSS, "which package is it imported
  from" heuristic) but nothing feature-specific. The MCP answered the two questions
  that decide the implementation: the current CKEditor AI plugin set on 49.x
  (`AIEditorIntegration` required core + `AIChat`, `AIChatShortcuts`,
  `AIQuickActions`, `AIReviewMode`, `AITranslate`; the mandatory `ai.container` UI
  config; Cloud Services `tokenUrl` authentication) and the RTC setup
  (`RealTimeCollaborativeEditing`, `cloudServices.tokenUrl` + `webSocketUrl`,
  per-document `collaboration.channelId`, `PresenceList` needing a container
  element). Training data would have confidently wired the legacy `AIAssistant`
  instead: the product moved under its feet in 2025/2026, exactly the trap the
  repo's "prefer skills and live docs" rule exists for.
- Skill gap (CKEditor side): the `ckeditor` skill has no reference for dynamic or
  conditional premium loading. The pattern "ship one build, fetch premium chunks
  only when the key exists" seems common for products embedding CKEditor (any
  CMS/DAM/PIM bundle with optional premium) and needed three non-obvious moves:
  dynamic `import('ckeditor5-premium-features')` plus dynamic CSS import so the
  bundler splits them, a TypeScript `declare module '*.css'` shim (the exports map
  does not type the CSS entry for dynamic import), and a static chunk-graph check
  that no premium chunk sits on the default load path.
- Found while verifying (module federation detail no skill covers): listing
  `ckeditor5-premium-features` in MF `shared` (inherited from
  `...packages.dependencies`) does NOT put it on the default path. The share
  registration in `remoteEntry.js` holds only the name and a lazy factory; the 3 MB
  code chunk is fetched when the factory runs, which happens on the first consume,
  which is the dynamic import. Also observed: adding the package re-chunked the
  shared `ckeditor5` library from one chunk into two (both still loaded together by
  the ckeditor5 share factory), so "did my chunk list change" is not the same
  question as "did my default fetch set change"; `mf-manifest.json` (exposes and
  shared assets with their sync/async split) is the file that answers the real
  question.
- Channel id derivation (the open design point from step 7, no skill on either
  side): the Studio SDK exports `useOptionalElementContext()` (element type + id)
  from `modules/element`, undocumented in the 33 official skills. The field name is
  nowhere in the typed `WysiwygProps` contract; for data object fields Studio core
  spreads the whole field definition into the wysiwyg component, so an untyped
  `name` prop arrives at runtime (vendor source archaeology again:
  `dynamic-type-object-data-wysiwyg.tsx` spreads, the document editable component
  does not). channelId = `pimcore-<elementType>-<id>-<fieldName>`; document
  editables fall back to a warning plus the free set unless an explicit
  `collaboration.channelId` is passed per field. A real
  `pimcore-wysiwyg-editor-integration` skill should document which props actually
  reach the editor slot on each surface.
- RTC behavior consequence worth a skill note: with `RealTimeCollaborativeEditing`
  active the document state lives in Cloud Services, so the component's external
  `setData()` reset path must be disabled or it forks the shared state. Nothing in
  the docs states the integration rule "no setData while RTC is on" directly.
- Verification (no key configured, the default): `tsc --noEmit` clean; production
  build passes; `entrypoints.json` and `mf-manifest.json` show the premium code only
  in its own async chunk (`749`, 3 MB) and premium CSS chunk (`29`), neither
  reachable from the default path (free-path chunk hashes for the react wrapper,
  antd-style and the editor CSS are unchanged); `cache:clear` plus `assets:install`
  on the running stack; `curl http://localhost/pimcore-studio/` still injects
  `ckeditorStudio` with `licenseKey: null` and gates off, referencing only the new
  build id. Unproven without a real trial key (Ondrej's manual step, README
  "Testing premium locally"): license validation, the AI service round trip, and a
  two-browser collaboration session.

## Step 9: end to end with a real trial, live in Studio (2026-11-05)

Token endpoint in the bundle, trial credentials in `.env.local` (env var names only:
`CKEDITOR_LICENSE_KEY`, `CKEDITOR_CS_ENVIRONMENT_ID`, `CKEDITOR_CS_ACCESS_KEY`,
`CKEDITOR_CS_WEBSOCKET_URL`, gates `CKEDITOR_PREMIUM_AI` / `CKEDITOR_PREMIUM_RTC`),
tested in Chrome on `/blog/hello-ckeditor`.

- Guided by: the CKEditor docs MCP again, decisively. The token claim shape
  (`aud` = environment id, `iat`, `exp`, `sub`, `user`, `auth.collaboration`) matched
  Ondrej's earlier blockspace token worker, but blockspace only grants collaboration.
  The AI half (`auth.ai.permissions`, the "end user" profile, the warning that a
  misspelled scope signs fine and grants nothing, and the zero-cost
  `GET https://ai.cke-cs.com/v1/models/1` token check) came from the Cloud Services AI
  authentication and permissions guides. That models call returned `agent-1`
  allowed before any browser was opened, which made the later browser debugging
  fast: the token was known good. The vendored `ckeditor` skill has nothing on token
  endpoints or AI permissions (its licensing reference stops at "obtain credentials
  in the portal").
- Pimcore side, no skill: route ownership. A bundle route is auto-loaded from
  `<bundle>/config/pimcore/routing.yaml` (Pimcore's `BundleRoutingLoader` +
  `BundleConfigLocator`, found in vendor source). Placing the route under
  `/pimcore-studio/api` reuses Studio's firewall and the `ROLE_PIMCORE_USER`
  access rule from the skeleton's `security.yaml`, so "only authenticated Studio
  users" needed no security code of our own (`#[IsGranted]` added as a second line).
  Anonymous request: `401`. None of the 33 official skills covers adding a backend
  endpoint that rides on the Studio session.
- Live failure 1, `ai-missing-channel-id` (editor mount crashed): Studio passes the
  data object field `name` as a form path ARRAY (`['content']`), not a string, so
  the step 8 derivation silently produced null. Found only by walking the React
  fiber of the mounted component in the browser. The usable prop is
  `combinedFieldName` (`'content'`, dotted for nested fields). Second lesson: CKEditor
  AI hard-requires `collaboration.channelId` even without collaboration, and the
  error takes the whole editor down instead of disabling AI. Fallback added: a
  per-mount random id for AI when nothing is derivable. Neither fact is in a skill;
  the AI integration guide mentions channelId only in passing in its sample.
- Live failure 2, blocked network (AI `ai-request-failed` with an empty original
  error, then `cloudservices-init` "number of initial connection attempts exceeded"):
  Pimcore Studio's Content Security Policy `connect-src` allows only `'self'` and a
  few Pimcore hosts, so the browser never sent the AI or WebSocket requests (they do
  not even show in the network log). The CKEditor error messages point at "Internet
  connection, antivirus or firewall", not at CSP, which is the real cause in any
  CSP-hardened host. Fix: a bundle subscriber on Studio's `CspEvent` adds the Cloud
  Services origins and the license usage endpoint, only while premium is active.
  Studio's `CspEvent` and `ContentSecurityPolicyHandlerInterface::addAllowedUrls()`
  are undocumented in the Pimcore skills (vendor source again). Worth a line in both
  skill families: "premium features call *.cke-cs.com and wss://*.cke-cs.com from
  the browser; whitelist them in connect-src."
- Found statically before the test, which would have been live failure 3: the free
  `SourceEditing` plugin throws `source-editing-incompatible-with-real-time-collaboration`
  next to `RealTimeCollaborativeEditing` unless
  `sourceEditing.allowCollaborationFeatures` is set (spotted by grepping the built
  chunk for the RTC plugin name). The default toolbar includes source editing, so
  every RTC-enabled field would have crashed.
- Verified live (screenshots kept outside the repo): trial license notice in the
  console with no license error; token endpoint `200` with the Studio session;
  AI panel in Studio's side panel, AI and AI Quick Actions buttons in the toolbar, a
  chat round trip summarizing the current post; presence list with the Pimcore user
  from the token `sub`; channel `pimcore-data-object-3-content`; an edit in a second
  tab appeared live in the first, and Studio marked the object modified. Two tabs of
  one Pimcore user show one avatar (expected de-duplication); a second Pimcore user
  would show two. Gates off: Studio's CSP back to its original `connect-src`.
- Secret hygiene note for the talk: the CKEditor AI init error serializes the whole
  editor config into the console, license key included. Harmless (license keys are
  public by design), but anyone pasting console logs into an issue or an agent chat
  should know it.

## Step 10: editor height and Fullscreen (2026-11-05)

- Long data object content grew the wrapper to the full content height (1162px for
  object 5): no internal scroll, toolbar scrolled away, bottom border flush on
  Studio's scroll container. Fix was plain CSS (70vh cap when the field has no
  height, `min-height: 0` on `.ck-editor` and `.ck-editor__main`, bottom margin).
  No skill needed; the one thing to verify was that the React wrapper puts
  `.ck-editor` directly under our wrapper (it does, so the flex chain holds).
- `Fullscreen` is free (in `ckeditor5`) and worked inside Studio unchanged: it covers
  the whole Studio window, carries the AI panel and the connected users list along,
  and restores the editor, toolbar and presence list on exit. I had pre-written a
  README note claiming the AI panel would be lost in fullscreen; the live test
  proved it wrong. Lesson kept for the talk: write the note after the test.

## Step 11: one AI chat per element (shared Context) and a docked AI panel (2026-11-05)

- Guided by: the CKEditor docs MCP ("AI in multi-root and multi-editor setups",
  `AIContainerSidebar`). It gave the exact split (AI feature plugins and
  `ai.container` on the `Context`, `AIEditorIntegration` + `AIQuickActions` per
  editor, the Context's own `collaboration.channelId`, `root.title` /
  `root.description` per editor) and the warning that a positioned sidebar host
  needs `ai.overlayContainer`. The `ckeditor` skill has no multi-editor or AI
  container reference at all; this is a gap for any CMS integration, where "several
  rich text fields on one entity" is the normal case, not the exception.
- Which props tell an editor its element and field (no skill on either side, all
  found by inspecting the live React fiber and the iframe DOM):
  - Data objects: element id and type from `useOptionalElementContext()`
    (`modules/element`), field from the untyped `combinedFieldName` prop (the
    `name` prop is a form path array), title from the untyped `title` prop.
  - Documents: editables render in the editmode iframe, where
    `useOptionalElementContext()` returns null and no name or title prop is passed
    (the editable component forwards only value, config and sizing props). The
    element id is a page global (`window.pimcore_document_id`, also the
    `documentId` query parameter), the field is the `#pimcore_editable_<name>`
    container (`data-name`, `data-real-name`, block suffixes in the id). Neither is
    an SDK contract; both are markup conventions.
- Real-time collaboration interaction no doc spells out: `root.title` is stored on
  the root and synced through RTC, so a collaboration channel created before titles
  were configured keeps its stored, title-less root and the config value is ignored
  (object 5 had no title until fixed; the brand-new document channels had theirs).
  Fix: re-apply the configured title and description to the root after ready.
- Studio extension points for a side panel: documents have a sidebar manager
  (`Document/Editor/Sidebar/PageSidebarManager` and friends, `registerEntry`), data
  objects have none, and the document sidebar lives in the parent window while
  document editables (and CKEditor's CSS) live in the editmode iframe. So the
  bundle docks its own panel next to the content. Two Studio behaviors shaped it,
  both found live, not in a skill: inactive element tabs are hidden with
  `visibility: hidden` (layout and size unchanged, so no resize signal; the panel
  is therefore mounted inside the tab's scroll container and inherits it), and an
  ancestor in Studio's tree is the containing block of `position: fixed` elements
  (the first attempt rendered off screen; the panel now measures and corrects its
  offset).
- Verified live: Home document, five editables, one shared Context (all five
  editors in `context.editors`, channel `pimcore-document-1`, AI plugins and
  PresenceList on it), per-editor channels `pimcore-document-1-<editable>`, titles
  "Intro", "Found resources", ... on the roots; the chat listed all five by title,
  and "add a sentence to the end of the Intro that points to the ecosystems in
  Reference points" produced a change that landed only in Intro (undone afterwards).
  Object 5: chat docked next to the field without overlap, separate Context
  (`pimcore-data-object-5`), RTC still on, editor height cap intact, panel hidden
  while another Studio tab is active, fullscreen takes the chat along and returns
  it, closing the tab destroyed its Context and panel. Not verified live: laptop
  widths (the window resize call did not change the viewport) and the `overlay`
  option.

## The 3 biggest skill gaps (summary)

1. No skill documents the wysiwyg editor extension point (`componentConfig.wysiwyg.editor`
   override + `WysiwygProps` contract), the one fact this task lived on; quill-bundle
   source was the only teacher, and the SDK skill's `override()` signature is stale.
2. `pimcore-studio-bundle-setup` has drifted from the 2026.x toolchain: npm versioning
   (canary-only vs stable 2026.3.4), buildId mechanism (`getBuildGroupId` +
   `pluginWriteBuildId`), `assets/studio/` layout, `/studio/` assetPrefix segment, eager
   shared `inversify`, and it does not know the committed-zip `BuildArchiveProviderInterface`
   distribution route that Pimcore's own bundles use.
3. Nothing bridges ecosystems: Pimcore skills stop at "register a component", CKEditor
   skills stop at "editor renders in your app". The actual integration surface
   (drop payloads, pimcore_* attributes, Quill-shaped `editorConfig`, HTML persistence
   expectations) is undocumented on both sides.
