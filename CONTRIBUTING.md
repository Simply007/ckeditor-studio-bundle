# Contributing

Thanks for helping. This file explains how the bundle hooks into Pimcore Studio, where
things live, and how to build and release it. Usage and configuration are in the
[README](README.md).

## How the bundle plugs into Studio

Pimcore Studio is a React app that loads bundle frontends as module federation
remotes. This bundle uses four Studio extension points:

| Extension point | Where | What it does here |
|---|---|---|
| Webpack entry point provider (tag `pimcore_studio_ui.webpack_entry_point_provider`) | `src/Webpack/WebpackEntryPointProvider.php`, `config/studio_ui.yaml` | Points Studio (and the document editmode iframe) at the committed build in `public/studio/build/<build-id>/entrypoints.json` |
| App config provider (tag `pimcore_studio_ui.app_config_provider`) | `src/AppConfig/StudioAppConfigProvider.php` | Puts the `ckeditorStudio` settings (editor choice, license key, toolbar, premium gates) into the Studio shell's `data-app-config`; the frontend reads them through `appConfig`. Config changes need only `cache:clear` |
| Component registry slot `componentConfig.wysiwyg.editor` | `assets/studio/js/src/modules/ckeditor-editor/index.tsx` | Registers the editor dispatcher (`SelectedEditor`) that renders CKEditor, another bundle's editor or Studio's built-in one |
| Plugin priority | `assets/studio/js/src/plugins.ts` | A probe at priority -1000 records Studio's built-in editor before other bundles run; the selector at 1000 runs after them. Studio's registry has no arbitration, the last `override()` wins (see `docs/proposals/studio-editor-arbitration.md`) |

The PHP side also adds a Cloud Services token endpoint
(`src/Controller/CloudServicesTokenController.php`,
`src/CloudServices/CloudServicesTokenGenerator.php`) and widens Studio's Content
Security Policy only when premium features are on
(`src/EventSubscriber/PremiumCspSubscriber.php`).

## Frontend map

All under `assets/studio/js/src/modules/ckeditor-editor/`:

- `index.tsx`: editor selection (global `ckeditor_studio.editor`, per-field `editor` key).
- `ckeditor-editor.tsx`: the `WysiwygProps` / `WysiwygEditorRef` contract Studio expects, classic vs inline editor type, fitting data object fields to Studio's panel.
- `editor.tsx`: the CKEditor React component, toolbar and plugin list, Pimcore drag and drop (`pimcore_id` / `pimcore_type` attributes).
- `core.ts`: where CKEditor comes from. The open source path loads the bundled `ckeditor5` lazily; the premium path loads core and premium features from the CKEditor CDN at the bundled version. Never import `ckeditor5` statically at runtime (type imports only): two copies on one page fail with `ckeditor-duplicated-modules`.
- `premium.ts`: premium gates, Cloud Services, CKEditor AI and real-time collaboration config.
- `ai-context.ts`: one shared CKEditor `Context` per Pimcore element, so CKEditor AI sees every field, plus the docked AI panel.
- `settings.ts`: typed access to the `ckeditorStudio` app config.

## Build

```bash
cd assets/studio
npm ci
npm run check-types
npm run build      # writes public/studio/build/<build-id>/
```

- The build output is committed: consumers need no Node toolchain. Commit it together with the source change, in a separate `build(...)` commit.
- The build id is a fingerprint of the frontend source, so it changes exactly when the source changes. CI rebuilds and fails if the committed build id is stale.
- Chunk hashes inside a build differ between machines; that is expected.
- Do not run a build while the dev server (`npm run dev-server`, port 3033) is running.
- `ckeditor5-premium-features` is a dev dependency for types only. No premium code may end up in `public/`; check with `grep -rl "Premium features is licensed under a commercial" public/` (expect no output).

## Testing in a Pimcore project

There are no automated tests yet. To try a change in a Pimcore 2026.3 project, either:

- point Composer at your clone with a path repository (`{"type": "path", "url": "../ckeditor-studio-bundle", "options": {"symlink": true}}`) and require `simply007/ckeditor-studio-bundle:@dev`, or
- copy `src/`, `config/` and `public/` over the installed package in `vendor/simply007/ckeditor-studio-bundle/`, then run `composer reinstall simply007/ckeditor-studio-bundle` when you are done.

After each change: `bin/console assets:install public --symlink --relative` and `bin/console cache:clear`. Check both paths: without a license key (bundled open source build, nothing from the CDN) and with a key and a premium gate on (CDN). `TESTING.md` has the longer manual test plan.

## Releases

1. Update the build (see above) and push to `main`; CI must be green.
2. Tag `vX.Y.Z` and push the tag. Packagist picks up new tags automatically.
3. Breaking changes (namespace, config keys, minimum Pimcore version) bump the minor version while the package is below 1.0.

## Gotchas worth knowing

From building this bundle with agent skills (details in `SKILL-FINDINGS.md`):

- The wysiwyg editor slot (`componentConfig.wysiwyg.editor`) and the app config provider are not documented in Pimcore's agent skills; `pimcore/quill-bundle` is the reference implementation.
- `ComponentRegistry.override()` takes one object, `override({ component, name })`.
- The registry service id is `serviceIds['App/ComponentRegistry/ComponentRegistry']`.
- Module federation must share `inversify` (eager, 6.1.x) with Studio.
- rsbuild does not empty the build directory it writes into; `rsbuild.config.ts` removes stale build directories before each build.
- Studio merges `pimcore_studio_ui.wysiwyg.default_editor_config` into the `editorConfig` prop, and that config is written for Quill in 2026.x; CKEditor ignores unknown keys.

## Conventions

- Conventional Commits: `type(scope): imperative summary`; one logical change per commit.
- Never commit license keys, Cloud Services credentials or `.env.local` files.
- New PHP files carry the GPL-2.0-or-later header used in `src/`.
- No em dashes or en dashes in docs and messages.
