import { type AbstractModule, container } from '@pimcore/studio-ui-bundle'
import { serviceIds } from '@pimcore/studio-ui-bundle/app'
import { type ComponentRegistry, componentConfig } from '@pimcore/studio-ui-bundle/modules/app'
import type React from 'react'
import CKEditorEditor from './ckeditor-editor'
import { getStudioSettings } from './settings'

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

/** Runs last among plugin modules: applies the configured editor. */
export const CKEditorEditorModule: AbstractModule = {
  onInit: (): void => {
    const componentRegistry = registry()
    const { editor } = getStudioSettings()
    const current = componentRegistry.has(SLOT) ? componentRegistry.get(SLOT) : null
    const otherBundleRegistered = current !== null && current !== builtInEditor && current !== CKEditorEditor

    if (editor === 'quill') {
      if (otherBundleRegistered) {
        // Keep the other editor bundle's registration (for example Quill).
        return
      }
      console.warn(
        `${TAG} ckeditor_studio.editor is "quill", but no other editor bundle registered the wysiwyg editor ` +
        '(is PimcoreQuillBundle enabled in config/bundles.php?). Falling back to CKEditor.'
      )
    }

    if (editor === 'default') {
      if (builtInEditor !== null) {
        componentRegistry.override({ component: builtInEditor, name: SLOT })
        return
      }
      console.warn(`${TAG} ckeditor_studio.editor is "default", but Studio's built-in editor was not found. Falling back to CKEditor.`)
    }

    componentRegistry.override({ component: CKEditorEditor, name: SLOT })
  }
}
