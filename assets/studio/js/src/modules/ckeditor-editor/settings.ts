/**
 * Runtime settings for the CKEditor Studio integration.
 *
 * The Symfony side of this bundle (StudioAppConfigProvider) merges a
 * `ckeditorStudio` key into Studio's app config, which Studio core renders into
 * the `data-app-config` attribute on the shell page. The frontend reads it back
 * here through `appConfig` from the Studio SDK. Everything is optional: without
 * the PHP bundle (for example on the standalone dev server) the defaults below
 * apply, which match the previous hardcoded behavior.
 */
import { appConfig } from '@pimcore/studio-ui-bundle/app'

export interface CKEditorStudioPremiumSettings {
  ai: {
    enabled: boolean
    /** Raw CKEditor "ai" configuration (adapter, model, ...), passed through from yaml. */
    config: Record<string, unknown>
  }
  realtimeCollaboration: {
    enabled: boolean
    /** CKEditor Cloud Services token endpoint (cloudServices.tokenUrl). */
    tokenUrl: string | null
    /** CKEditor Cloud Services WebSocket URL (cloudServices.webSocketUrl). */
    webSocketUrl: string | null
  }
}

export interface CKEditorStudioSettings {
  /** The value handed to CKEditor: a configured commercial key, or 'GPL'. */
  licenseKey: string
  /** True only when a real key is configured (CKEDITOR_LICENSE_KEY / ckeditor_studio.license_key). */
  hasLicenseKey: boolean
  toolbar: string[]
  premium: CKEditorStudioPremiumSettings
}

/** Shape of the `ckeditorStudio` app config key as the PHP provider emits it. */
interface CKEditorStudioAppConfig {
  licenseKey?: string | null
  toolbar?: unknown
  premium?: {
    ai?: { enabled?: boolean, config?: Record<string, unknown> }
    realtimeCollaboration?: { enabled?: boolean, tokenUrl?: string | null, webSocketUrl?: string | null }
  }
}

/**
 * Default toolbar preset. Keep in sync with Configuration::DEFAULT_TOOLBAR on
 * the PHP side; every item is backed by a plugin registered in editor.tsx.
 */
export const DEFAULT_TOOLBAR: string[] = [
  'undo', 'redo', '|',
  'heading', '|',
  'bold', 'italic', 'underline', '|',
  'alignment', '|',
  'bulletedList', 'numberedList', 'outdent', 'indent', '|',
  'blockQuote', 'link', 'insertTable', '|',
  'sourceEditing'
]

const DEFAULT_PREMIUM: CKEditorStudioPremiumSettings = {
  ai: { enabled: false, config: {} },
  realtimeCollaboration: { enabled: false, tokenUrl: null, webSocketUrl: null }
}

const isToolbarConfig = (value: unknown): value is string[] =>
  Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === 'string')

export const getStudioSettings = (): CKEditorStudioSettings => {
  const raw: CKEditorStudioAppConfig =
    (appConfig as unknown as Record<string, CKEditorStudioAppConfig | undefined>).ckeditorStudio ?? {}

  const configuredKey = typeof raw.licenseKey === 'string' && raw.licenseKey !== '' ? raw.licenseKey : null

  return {
    licenseKey: configuredKey ?? 'GPL',
    hasLicenseKey: configuredKey !== null,
    toolbar: isToolbarConfig(raw.toolbar) ? raw.toolbar : DEFAULT_TOOLBAR,
    premium: {
      ai: {
        enabled: raw.premium?.ai?.enabled === true,
        config: raw.premium?.ai?.config ?? DEFAULT_PREMIUM.ai.config
      },
      realtimeCollaboration: {
        enabled: raw.premium?.realtimeCollaboration?.enabled === true,
        tokenUrl: raw.premium?.realtimeCollaboration?.tokenUrl ?? null,
        webSocketUrl: raw.premium?.realtimeCollaboration?.webSocketUrl ?? null
      }
    }
  }
}
