import React, { forwardRef } from 'react'
import { type AbstractModule, container } from '@pimcore/studio-ui-bundle'
import { serviceIds } from '@pimcore/studio-ui-bundle/app'
import { type ComponentRegistry, componentConfig } from '@pimcore/studio-ui-bundle/modules/app'
import { type WysiwygEditorRef, type WysiwygProps } from '@pimcore/studio-ui-bundle/modules/wysiwyg'
import CKEditorEditor from './ckeditor-editor'
import { type EditorChoice, getStudioSettings } from './settings'

/**
 * Editor selection for Studio's single `wysiwyg.editor` slot.
 *
 * Studio's component registry has no arbitration: every editor bundle calls
 * `override()` and the last call wins. The order is deterministic, though:
 * Studio registers its built-in editor in a core module first, then plugin
 * modules initialize in plugin `priority` order (ascending). This bundle
 * therefore ships two plugins (see plugins.ts):
 *
 * - a probe at the lowest priority, which records Studio's built-in editor
 *   right after Studio registered it, before any editor bundle touches the slot;
 * - the selector at the highest priority, which runs after every other editor
 *   bundle (for example pimcore/quill-bundle) and applies
 *   `ckeditor_studio.editor` from the Symfony config:
 *     ckeditor  CKEditor (default)
 *     quill     keep the editor another bundle registered; when none did, fall
 *               back to CKEditor with a console warning
 *     default   Studio's built-in editor
 *
 * So editor bundles can stay enabled side by side and one config value decides.
 *
 * Per field, the editor config can override the global choice with an
 * `editor` key (`ckeditor`, `quill` or `default`): a Twig option on a document
 * editable (`pimcore_wysiwyg('teaser', { editor: 'quill' })`) or the editor
 * config of a data object field. The selector therefore registers a small
 * dispatcher that renders the chosen editor for each field.
 */

const TAG = '[ckeditor-studio-bundle]'
const SLOT = componentConfig.wysiwyg.editor.name

let builtInEditor: React.ComponentType<any> | null = null

const registry = (): ComponentRegistry =>
  container.get<ComponentRegistry>(serviceIds['App/ComponentRegistry/ComponentRegistry'])

/** Runs first among plugin modules: remembers Studio's built-in editor. */
export const EditorSlotProbeModule: AbstractModule = {
  onInit: (): void => {
    const componentRegistry = registry()
    builtInEditor = componentRegistry.has(SLOT) ? componentRegistry.get(SLOT) : null
  }
}

const CHOICES: readonly EditorChoice[] = ['ckeditor', 'quill', 'default']

let otherEditor: React.ComponentType<any> | null = null
let globalChoice: EditorChoice = 'ckeditor'
const warned = new Set<string>()

const warnOnce = (key: string, message: string): void => {
  if (!warned.has(key)) {
    warned.add(key)
    console.warn(`${TAG} ${message}`)
  }
}

/** The editor component for a choice, falling back to CKEditor with a warning. */
const resolveEditor = (choice: EditorChoice): React.ComponentType<any> => {
  if (choice === 'quill') {
    if (otherEditor !== null) {
      return otherEditor
    }
    warnOnce('quill', 'The editor "quill" is selected, but no other editor bundle registered the wysiwyg editor ' +
      '(is PimcoreQuillBundle enabled in config/bundles.php?). Falling back to CKEditor.')
  }

  if (choice === 'default') {
    if (builtInEditor !== null) {
      return builtInEditor
    }
    warnOnce('default', 'The editor "default" is selected, but Studio\'s built-in editor was not found. Falling back to CKEditor.')
  }

  return CKEditorEditor
}

const isChoice = (value: unknown): value is EditorChoice =>
  typeof value === 'string' && (CHOICES as readonly string[]).includes(value)

/** Renders the editor chosen for this field (editorConfig.editor), or the global choice. */
export const SelectedEditor = forwardRef<WysiwygEditorRef, WysiwygProps>((props, ref): React.JSX.Element => {
  const { editor: requested, ...editorConfig } = (props.editorConfig ?? {}) as Record<string, unknown>
  if (requested !== undefined && !isChoice(requested)) {
    warnOnce(`invalid-${String(requested)}`, `Unknown editor "${String(requested)}" in a field's editor config; expected ckeditor, quill or default.`)
  }
  const Component = resolveEditor(isChoice(requested) ? requested : globalChoice)

  return (
    <Component
      { ...props }
      editorConfig={ editorConfig }
      ref={ ref }
    />
  )
})
SelectedEditor.displayName = 'SelectedEditor'

/** Runs last among plugin modules: applies the configured editor. */
export const CKEditorEditorModule: AbstractModule = {
  onInit: (): void => {
    const componentRegistry = registry()
    const { editor } = getStudioSettings()
    const current = componentRegistry.has(SLOT) ? componentRegistry.get(SLOT) : null
    otherEditor = current !== null && current !== builtInEditor && current !== CKEditorEditor && current !== SelectedEditor
      ? current
      : null
    globalChoice = editor

    componentRegistry.override({ component: SelectedEditor, name: SLOT })
  }
}
