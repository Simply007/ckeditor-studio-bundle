import { type IAbstractPlugin } from '@pimcore/studio-ui-bundle'
import { CKEditorEditorModule, EditorSlotProbeModule } from './modules/ckeditor-editor'

if (module.hot !== undefined) {
  module.hot.accept()
}

/**
 * Plugins start (and register their modules) in ascending `priority` order,
 * and modules initialize in registration order. The probe runs before every
 * other editor bundle, the selector after all of them; see
 * modules/ckeditor-editor/index.tsx for the selection rules.
 */
export const CKEditorSlotProbePlugin: IAbstractPlugin = {
  name: 'ckeditor-studio-editor-slot-probe',
  priority: -1000,

  onStartup: ({ moduleSystem }): void => {
    moduleSystem.registerModule(EditorSlotProbeModule)
  }
}

export const CKEditorPlugin: IAbstractPlugin = {
  name: 'ckeditor-studio-plugin',
  priority: 1000,

  // Register and overwrite services here
  onInit: (): void => {
  },

  // Register modules here
  onStartup: ({ moduleSystem }): void => {
    moduleSystem.registerModule(CKEditorEditorModule)
  }
}
