import { type AbstractModule, container } from '@pimcore/studio-ui-bundle'
import { serviceIds } from '@pimcore/studio-ui-bundle/app'
import { type ComponentRegistry, componentConfig } from '@pimcore/studio-ui-bundle/modules/app'
import CKEditorEditor from './ckeditor-editor'

export const CKEditorEditorModule: AbstractModule = {
  onInit: (): void => {
    const componentRegistry = container.get<ComponentRegistry>(serviceIds['App/ComponentRegistry/ComponentRegistry'])

    componentRegistry.override({
      component: CKEditorEditor,
      name: componentConfig.wysiwyg.editor.name
    })
  }
}
