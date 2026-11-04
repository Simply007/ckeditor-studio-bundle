import { type IAbstractPlugin } from '@pimcore/studio-ui-bundle'
import { CKEditorEditorModule } from './modules/ckeditor-editor'

if (module.hot !== undefined) {
  module.hot.accept()
}

export const CKEditorPlugin: IAbstractPlugin = {
  name: 'ckeditor-studio-plugin',

  // Register and overwrite services here
  onInit: (): void => {
  },

  // Register modules here
  onStartup: ({ moduleSystem }): void => {
    moduleSystem.registerModule(CKEditorEditorModule)
  }
}
