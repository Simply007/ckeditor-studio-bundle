# CKEditor Studio Bundle (demo)

CKEditor rich text editor mounted as the wysiwyg editor in Pimcore Studio. Built for
the talk "AI Best Practices for Your Product" at Pimcore Community Dev Days 2026, as
the missing CKEditor counterpart to `pimcore/quill-bundle`, whose 2026.x architecture
this bundle mirrors.

Status: first draft, statically validated only. Runtime test plan: see `TESTING.md`.
Experiment log on the agent skills used to build it: see `SKILL-FINDINGS.md`.

## What it does

- Registers a Studio UI plugin (module federation remote) that overrides the single
  component `wysiwyg.editor` in the Studio ComponentRegistry, exactly as quill-bundle does.
- The replacement component implements Studio's `WysiwygProps` / `WysiwygEditorRef`
  contract and mounts CKEditor (classic editor, open source build, npm packages
  `ckeditor5` + `@ckeditor/ckeditor5-react`, `licenseKey: 'GPL'`).
- Covers documents (wysiwyg editable) and data object wysiwyg fields, since both render
  through the same registry component.
- Asset/document/object drag and drop inserts images and links with `pimcore_id` /
  `pimcore_type` attributes; `GeneralHtmlSupport` keeps those attributes (plus
  class/id/style) in the data.

## Layout

```
composer.json                PHP package (type: pimcore-bundle, PSR-4 Chrastina\CKEditorStudioBundle)
src/                         Bundle class, prepended studio_ui.yaml, entry point provider
config/studio_ui.yaml        Tags the provider for Studio UI (incl. document editor iframe)
assets/studio/               TypeScript frontend (rsbuild + module federation, port 3033)
public/studio/build/<id>/    Committed frontend build (entrypoints.json consumed by PHP)
```

## Out of scope (timeboxed demo)

Premium features, config UIs, mapping Pimcore's Quill-shaped `editorConfig` to CKEditor
options, translations, applying pimcore_* attributes when linking an existing text
selection, tests.
