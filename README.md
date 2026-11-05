# CKEditor Studio Bundle (demo)

CKEditor rich text editor mounted as the wysiwyg editor in Pimcore Studio. Built for
the talk "AI Best Practices for Your Product" at Pimcore Community Dev Days 2026, as
the missing CKEditor counterpart to `pimcore/quill-bundle`, whose 2026.x architecture
this bundle mirrors.

Status: the core integration is runtime-tested end to end on the demo stack (see
`TESTING.md`); the runtime configuration described below is build-tested and
statically verified, and the premium feature path is scaffolded only. Experiment log
on the agent skills used to build it: see `SKILL-FINDINGS.md`.

## What it does

- Replaces the Quill editor with CKEditor for every wysiwyg surface in Pimcore
  Studio: data object wysiwyg fields and document wysiwyg editables (both render
  through the same registry component).
- Classic editor, open source build (npm packages `ckeditor5` +
  `@ckeditor/ckeditor5-react`), with license-key gating for premium use (see below).
- Asset/document/object drag and drop inserts images and links with `pimcore_id` /
  `pimcore_type` attributes; `GeneralHtmlSupport` keeps those attributes (plus
  class/id/style) in the data.

## How it works

Pimcore Studio is a module-federation host. This bundle contributes a remote:

1. The Symfony bundle (`Chrastina\CKEditorStudioBundle`) registers a
   `WebpackEntryPointProvider` (tag `pimcore_studio_ui.webpack_entry_point_provider`,
   plus the document editor iframe tag) that points Studio at the committed rsbuild
   output in `public/studio/build/<build-id>/entrypoints.json`.
2. The frontend (`assets/studio/`, rsbuild + module federation, dev server port 3033)
   exposes a Studio plugin. On startup it grabs the `ComponentRegistry` from the
   Studio SDK container and calls
   `componentRegistry.override({ component, name: componentConfig.wysiwyg.editor.name })`:
   the single `wysiwyg.editor` component slot now renders CKEditor.
3. The replacement component implements Studio's `WysiwygProps` / `WysiwygEditorRef`
   contract (value/onChange, drag and drop hook, maxCharacters), so Studio core treats
   it exactly like the built-in editor.
4. Runtime configuration travels the other way: a `StudioAppConfigProvider` (tag
   `pimcore_studio_ui.app_config_provider`) merges a `ckeditorStudio` key into the
   `data-app-config` JSON on the Studio shell page, and the editor reads it back
   through `appConfig` from `@pimcore/studio-ui-bundle/app`. Config changes therefore
   need only a `cache:clear`, never a frontend rebuild.

## Install and enable

In this repository everything is pre-wired (path repository in the root
`composer.json`, bundle active in `config/bundles.php`). From scratch:

```bash
# 1. Composer (path repository route; see "Extracting this bundle" for standalone)
composer require chrastina/ckeditor-studio-bundle:@dev

# 2. Enable the bundle (writes config/bundles.php)
docker compose exec php bin/console pimcore:bundle:enable CKEditorStudioBundle

# 3. Publish assets and clear cache
docker compose exec php bin/console assets:install --symlink
docker compose exec php bin/console cache:clear
```

Then disable other wysiwyg editor bundles (see Limitations) and open Studio: wysiwyg
fields render CKEditor.

## Configuration

All configuration lives under the `ckeditor_studio` key, for example in
`config/packages/ckeditor_studio.yaml`. Everything is optional; with no config at all
the editor runs the open source feature set with the default toolbar.

### License key gating

- No key configured (default): the editor runs with `licenseKey: 'GPL'` and the
  current free feature set. The "Powered by CKEditor" logo is part of that deal.
- Key configured: it is passed to CKEditor as `licenseKey` and unlocks the premium
  gates below. The simplest route is the environment variable the config defaults to:

```bash
# .env.local (never commit real keys)
CKEDITOR_LICENSE_KEY=your-key-from-portal.ckeditor.com
```

or explicitly in yaml:

```yaml
ckeditor_studio:
  license_key: '%env(CKEDITOR_LICENSE_KEY)%'
```

The key reaches the browser through the Studio shell page. That is how CKEditor
licensing works everywhere (the key is validated client side and is not a secret in
the server sense), but keep genuinely secret values, such as an AI provider API key,
on the server.

### Toolbar

The toolbar is a plain list of CKEditor toolbar items, in the spirit of TYPO3 RTE
presets or Drupal editor config. The default preset is:

```yaml
ckeditor_studio:
  toolbar:
    - undo
    - redo
    - '|'
    - heading
    - '|'
    - bold
    - italic
    - underline
    - '|'
    - alignment
    - '|'
    - bulletedList
    - numberedList
    - outdent
    - indent
    - '|'
    - blockQuote
    - link
    - insertTable
    - '|'
    - sourceEditing
```

Change it by overriding the whole list; `'|'` is a separator. A minimal preset:

```yaml
ckeditor_studio:
  toolbar: ['undo', 'redo', '|', 'bold', 'italic', 'link']
```

Items must be backed by a plugin the frontend build ships (currently: Essentials,
Paragraph, Heading, Bold, Italic, Underline, Alignment, Link, List, Indent,
BlockQuote, Table, Image, ImageResize, SourceEditing, GeneralHtmlSupport). Unknown
items are skipped by CKEditor with a console warning, nothing breaks. Adding an item
that needs a new plugin means adding the plugin in
`assets/studio/js/src/modules/ckeditor-editor/editor.tsx` and rebuilding.

Per-field tweaks remain possible: whatever a field definition or
`pimcore_studio_ui.wysiwyg.default_editor_config` passes as `editorConfig` is spread
over the bundle config last, so genuine CKEditor options set there win (note that
Pimcore 2026.x writes that config Quill-shaped; CKEditor ignores unknown keys).

### Premium feature gates (scaffolded)

Two premium features have prepared gates. They are scaffolded, not wired: enabling a
flag today logs a console warning explaining the missing steps and keeps the free
feature set, so a misconfigured instance never breaks. The single wiring point is
`assets/studio/js/src/modules/ckeditor-editor/premium.ts`, which documents the exact
steps (install `ckeditor5-premium-features` at the same version as `ckeditor5`,
uncomment the marked blocks, rebuild).

```yaml
ckeditor_studio:
  license_key: '%env(CKEDITOR_LICENSE_KEY)%'   # required for any premium feature
  premium:
    ai:
      enabled: true
      # Raw CKEditor "ai" configuration, passed to the frontend as-is:
      # the AI adapter (endpoint or Cloud Services based), model options, etc.
      config: {}
    realtime_collaboration:
      enabled: true
      # CKEditor Cloud Services credentials, both required when enabled:
      token_url: 'https://example.cke-cs.com/token'
      web_socket_url: 'wss://example.cke-cs.com/ws'
```

Extra requirements per feature:

- CKEditor AI: a license key covering AI, an AI adapter configuration (`premium.ai.config`),
  and the AI toolbar item added via `ckeditor_studio.toolbar`.
- Real-time collaboration: a license key covering collaboration, Cloud Services
  credentials (`token_url`, `web_socket_url`), and a per-field collaboration
  `channelId`, which this integration still has to derive from the Studio element id
  plus field name (noted in `premium.ts`).

## Limitations

- Registry has no arbitration: every editor bundle overrides the same
  `wysiwyg.editor` slot and the last `override()` call wins, in entry point
  registration order, which is not guaranteed. Other editor bundles must therefore be
  disabled (this repo sets `PimcoreQuillBundle => ['all' => false]` in
  `config/bundles.php`). Tracked as
  [issue #2](https://github.com/Simply007/pcdd26-pimcore-ai-guidepost/issues/2)
  (configurable editor selection).
- Premium features are scaffolded only (see above).
- Pimcore's per-field `editorConfig` is Quill-shaped in 2026.x; no mapping to
  CKEditor options is implemented (pass-through only).
- Dropping an element onto selected text applies only `href`, not the `pimcore_id` /
  `pimcore_type` attributes.
- No translations shipped; no automated tests.

## Layout

```
composer.json                PHP package (type: pimcore-bundle, PSR-4 Chrastina\CKEditorStudioBundle)
src/                         Bundle class, configuration, app config provider, entry point provider
config/studio_ui.yaml        Tags the providers for Studio UI (incl. document editor iframe)
assets/studio/               TypeScript frontend (rsbuild + module federation, port 3033)
public/studio/build/<id>/    Committed frontend build (entrypoints.json consumed by PHP)
```

## Extracting this bundle

The bundle is self-contained under `packages/ckeditor-studio-bundle` and extraction
to its own repository is tracked as
[issue #3](https://github.com/Simply007/pcdd26-pimcore-ai-guidepost/issues/3). A
standalone install needs:

- Distribution: copy this directory to its own repository; `composer.json` already
  carries the metadata (name, description, license, autoload, `type: pimcore-bundle`,
  `extra.pimcore.bundles`). Consumers then either add a VCS/path repository entry and
  `composer require chrastina/ckeditor-studio-bundle`, or the package gets published
  to Packagist and the repository entry disappears.
- Frontend build: the committed build under `public/studio/build/<build-id>/` ships
  with the package, so consumers need no Node toolchain. Maintainers rebuild with
  `npm ci && npm run build` in `assets/studio/` and commit the output. (Pimcore's own
  bundles ship a zip via `BuildArchiveProviderInterface` instead; switching to that
  route is optional polish.)
- Studio registration: nothing manual. `extra.pimcore.bundles` makes
  `pimcore:bundle:enable CKEditorStudioBundle` work, the prepended `studio_ui.yaml`
  registers the entry point and app config providers only when
  `pimcore_studio_ui` is present, and `assets:install` publishes the build.
- Versioning: pin `pimcore/studio-ui-bundle` (composer) and
  `@pimcore/studio-ui-bundle` (npm) to the same minor line; the frontend consumes
  Studio's SDK types at build time and its module federation remote at runtime.
