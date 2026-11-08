/**
 * Where the CKEditor code comes from.
 *
 * - Open source path (no license key, or every premium gate off): the
 *   `ckeditor5` npm package bundled with this build, loaded lazily.
 * - Premium path (license key and at least one premium gate on): CKEditor core
 *   AND the premium features from the CKEditor CDN, at exactly the version this
 *   build was compiled against. The premium features are commercial code, so
 *   they are never part of this package; CKSource serves them under the
 *   customer's license.
 *
 * The two sources must never both run on one page: CKEditor refuses to start
 * when its core is evaluated twice (error `ckeditor-duplicated-modules`). That
 * is why nothing in this bundle imports `ckeditor5` statically at runtime (type
 * imports only), and why the premium path takes every class, including the
 * editor and the open source plugins, from the CDN.
 */
import { loadCKEditorCloud } from '@ckeditor/ckeditor5-react'
import type * as CKEditorCore from 'ckeditor5'
import type * as CKEditorPremiumFeatures from 'ckeditor5-premium-features'

export type Core = typeof CKEditorCore
export type Premium = typeof CKEditorPremiumFeatures

declare const __CKEDITOR_VERSION__: string

/** The `ckeditor5` version this build was compiled against (set by rsbuild). */
export const CKEDITOR_VERSION: string = __CKEDITOR_VERSION__

let openSource: Promise<Core> | null = null
let cloud: Promise<{ core: Core, premium: Premium }> | null = null
let cloudLoaded = false

/** The bundled open source CKEditor (one shared promise per page). */
export const loadOpenSourceCore = async (): Promise<Core> => {
  openSource ??= import('ckeditor5')
  return await openSource
}

/** CKEditor core and premium features from the CDN (one shared promise per page). */
export const loadCloudCore = async (): Promise<{ core: Core, premium: Premium }> => {
  cloud ??= loadCKEditorCloud({ version: CKEDITOR_VERSION as '49.1.0', premium: true }).then((result) => {
    cloudLoaded = true
    return {
      core: result.CKEditor as unknown as Core,
      premium: result.CKEditorPremiumFeatures as unknown as Premium
    }
  })
  return await cloud
}

/**
 * True once the CDN build ran on this page. From then on the bundled open
 * source core must not be loaded any more, so fallbacks reuse the CDN core.
 */
export const isCloudCoreLoaded = (): boolean => cloudLoaded
