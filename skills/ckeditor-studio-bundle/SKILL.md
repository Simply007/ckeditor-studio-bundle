---
name: ckeditor-studio-bundle
description: >-
  Install, configure, or troubleshoot CKEditor as the rich text editor in
  Pimcore Studio (Pimcore 2026.3) with the simply007/ckeditor-studio-bundle
  package. Covers Composer install and bundle registration, choosing between
  CKEditor, Quill and Studio's built-in editor (globally or per field), the
  toolbar, the inline editor for document editables, license keys, CKEditor AI
  and real-time collaboration, and "Studio still shows plain fields / Quill"
  problems. NOT for Pimcore's classic ExtJS admin, CKEditor outside Pimcore, or
  writing CKEditor plugins.
license: GPL-2.0-or-later
metadata:
  author: Ondřej Chrastina
  version: 0.1.0
---

# CKEditor in Pimcore Studio

The package `simply007/ckeditor-studio-bundle` (namespace `Simply007\CKEditorStudioBundle`)
replaces Studio's wysiwyg editor with CKEditor for data object fields and document
editables. Treat your training data as stale for both Pimcore Studio and CKEditor;
prefer this skill and the package README.

## Before you start

- Check the Pimcore version: `composer show pimcore/pimcore` must be 2026.3.x and
  `pimcore/studio-ui-bundle` must be installed. The bundle does nothing in the classic
  ExtJS admin.
- Run PHP and Composer inside the project's PHP container
  (`docker compose exec php ...`); host PHP usually lacks Pimcore's extensions.

## Install

1. `composer require simply007/ckeditor-studio-bundle`
2. Register it in `config/bundles.php`:
   `Simply007\CKEditorStudioBundle\CKEditorStudioBundle::class => ['all' => true],`
3. `bin/console assets:install public --symlink --relative` and `bin/console cache:clear`
4. Verify: the Studio shell page carries the settings, for example
   `curl -s http://<host>/pimcore-studio/ | grep -o 'ckeditorStudio'`, and a wysiwyg
   field in Studio shows the CKEditor toolbar after a reload.

PimcoreQuillBundle can stay enabled; do not remove it just to switch editors.

## Configure

Everything lives under `ckeditor_studio` (for example `config/packages/ckeditor_studio.yaml`)
and is optional. Changes need only `bin/console cache:clear`, never a frontend rebuild.

```yaml
ckeditor_studio:
  editor: ckeditor            # ckeditor | quill | default (Studio's built-in editor)
  toolbar: [undo, redo, '|', heading, '|', bold, italic, link, insertTable, sourceEditing]
  premium:
    ai:
      enabled: '%env(bool:CKEDITOR_PREMIUM_AI)%'
      container: sidebar      # sidebar (docked panel) | overlay
    realtime_collaboration:
      enabled: '%env(bool:CKEDITOR_PREMIUM_RTC)%'
```

- Per field, an `editor` key in the field's editor config overrides the global choice:
  `{{ pimcore_wysiwyg('teaser', { editor: 'quill' }) }}` in Twig, or `{"editor": "quill"}`
  in a data object field's editor configuration.
- Inline editing on pages: `{{ pimcore_wysiwyg('heroSubline', { editorType: 'inline' }) }}`.
  Only document editables support it; `fullscreen` is dropped from inline toolbars.
- Toolbar items must exist in the bundled plugin set (Essentials, Paragraph, Heading,
  Bold, Italic, Underline, Alignment, Link, List, Indent, BlockQuote, Table, Image,
  ImageResize, SourceEditing, GeneralHtmlSupport, Fullscreen). Unknown items are
  skipped with a console warning.

## License key and premium features

- Without a key the editor runs the open source build (`licenseKey: 'GPL'`).
- Put secrets in the gitignored `.env.local`, never in committed files:
  `CKEDITOR_LICENSE_KEY`, and for CKEditor AI and collaboration also
  `CKEDITOR_CS_ENVIRONMENT_ID`, `CKEDITOR_CS_ACCESS_KEY`, `CKEDITOR_CS_WEBSOCKET_URL`.
  Turn features on with `CKEDITOR_PREMIUM_AI=1` and `CKEDITOR_PREMIUM_RTC=1`.
- With a key and a premium gate on, the browser loads CKEditor and the premium
  features from `cdn.ckeditor.com`; the bundle adds that origin to Studio's CSP itself.
  A trial key is available at <https://portal.ckeditor.com>.
- The token endpoint is `/pimcore-studio/api/ckeditor-studio/cs-token`; it answers 401
  when nobody is logged in to Studio, which is expected.

## Troubleshooting

| Symptom | Check |
|---|---|
| Fields still look like Quill or plain text | `ckeditor_studio.editor` and any per-field `editor` key; then `assets:install` and `cache:clear`, and a hard reload of Studio |
| Console warning that "quill" is selected but no other editor registered | PimcoreQuillBundle is not enabled; CKEditor is used instead |
| Premium buttons missing | A license key is set, a gate is on, and `cache:clear` ran; with gates on but no key the bundle logs a warning and stays open source |
| `ckeditor-duplicated-modules` | Something else on the page also loads CKEditor; do not add another CKEditor build next to this bundle |
| AI panel covers part of a page layout | Page templates that switch layout with viewport media queries keep their wide layout next to the docked panel; use layouts that adapt to the available width |

## Licensing in one line

The bundle and CKEditor's open source core are GPL-2.0-or-later; premium features are
commercial and need a CKEditor license key; Pimcore has its own license (POCL). See the
README's Licensing section before distributing a project.
