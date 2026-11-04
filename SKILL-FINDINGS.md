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
