# Proposal: editor arbitration for Pimcore Studio's wysiwyg slot

Status: draft for discussion with the Pimcore Studio team. Not filed upstream yet.

## Problem

Pimcore Studio renders every rich text field (data object wysiwyg fields and document
editables) through one component registry slot, `componentConfig.wysiwyg.editor`. Any
bundle can replace it with `componentRegistry.override({ component, name })`, and the
last call wins. There is no way to:

- know which editors are installed,
- let a project choose one in configuration,
- choose per field or per class,
- detect that two bundles fight over the slot.

Today the outcome depends on plugin start order. This bundle works around it with two
plugins at extreme priorities (-1000 to record Studio's built-in editor, 1000 to apply
the configured choice after every other bundle) and a dispatcher component that picks
an editor per field. A third bundle using a similar trick could still race it.

## Proposal

Add a small editor registry next to the component registry:

```ts
interface WysiwygEditorDefinition {
  id: string                     // 'quill', 'ckeditor', 'builtin'
  label: string                  // shown in the class editor and settings
  component: React.ComponentType<WysiwygProps>
}

wysiwygEditorRegistry.register(definition)   // bundles call this instead of override()
wysiwygEditorRegistry.list(): WysiwygEditorDefinition[]
```

Selection, from most to least specific:

1. the field's editor config (`editor: 'ckeditor'`), for document editables in Twig and for data object fields in the class editor (a dropdown fed by `list()`),
2. a project default in `pimcore_studio_ui.wysiwyg.default_editor` (Symfony config, exposed through the app config like today's `default_editor_config`),
3. Studio's built-in editor.

Studio's own resolver for the `wysiwyg.editor` slot would apply these rules, so bundles
never touch the slot directly and the order of plugin start-up stops mattering.

## Compatibility

- Bundles that keep calling `override()` continue to work as today (last wins); a console warning could point them to `register()`.
- `default_editor_config` stays per context (`dataObject`, `document`); an editor-specific variant (`default_editor_config.ckeditor`) would remove today's mix of Quill-shaped and CKEditor-shaped options in one object.

## What this bundle would change

- Replace the probe and selector plugins with one `register()` call.
- Drop `ckeditor_studio.editor` in favor of the Studio-level default, keeping the per-field `editor` key.
- Keep the dispatcher only as a fallback for Studio versions without the registry.

## References

- Current workaround: `assets/studio/js/src/modules/ckeditor-editor/index.tsx`, `assets/studio/js/src/plugins.ts`
- Original discussion: <https://github.com/Simply007/pcdd26-pimcore-ai-guidepost/issues/2>
