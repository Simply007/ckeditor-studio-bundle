/**
 * Premium feature wiring: CKEditor AI and real-time collaboration.
 *
 * The `ckeditor5-premium-features` package (same version as `ckeditor5`) is
 * loaded through dynamic import() ONLY when a license key is configured AND at
 * least one premium gate is enabled. The premium code and CSS therefore live in
 * their own async chunks: with no key, or with all gates off, the editor
 * initializes exactly as the plain open source (GPL) build and no premium chunk
 * is even fetched.
 *
 * Gate behavior stays forgiving: an enabled gate whose prerequisites are
 * missing (no key, no Cloud Services credentials, no collaboration channel id)
 * logs a console warning and keeps the free feature set, so a misconfigured
 * instance never breaks.
 */
import { type EditorConfig } from 'ckeditor5'
import { type CKEditorStudioSettings } from './settings'

export interface PremiumExtensions {
  plugins: NonNullable<EditorConfig['plugins']>
  config: Partial<EditorConfig>
  /** True when real-time collaboration is active for this editor instance. */
  realtimeCollaborationActive: boolean
  /** Toolbar items the active premium features add (appended unless already present). */
  toolbarItems: string[]
}

/** The no-premium result: shared by the GPL path and every fallback. */
export const EMPTY_PREMIUM_EXTENSIONS: PremiumExtensions = Object.freeze({
  plugins: [],
  config: {},
  realtimeCollaborationActive: false,
  toolbarItems: []
})

const TAG = '[ckeditor-studio-bundle]'

/**
 * Whether the premium module should be loaded at all: a real license key is
 * configured and at least one premium gate is enabled. Owns the "gates enabled
 * but no key" warning, so the free fallback behaves exactly as before.
 */
export const isPremiumRequested = (settings: CKEditorStudioSettings): boolean => {
  const { ai, realtimeCollaboration: rtc } = settings.premium

  if (!ai.enabled && !rtc.enabled) {
    return false
  }

  if (!settings.hasLicenseKey) {
    console.warn(
      `${TAG} Premium features are enabled in ckeditor_studio config but no license key is configured ` +
      '(CKEDITOR_LICENSE_KEY / ckeditor_studio.license_key). Falling back to the free feature set.'
    )
    return false
  }

  return true
}

export interface PremiumLoadOptions {
  /**
   * Collaboration channel id for this editor instance, or null when none could
   * be derived. Derived by the editor component from the open Pimcore element
   * (type + id) and the field name; an explicit per-field
   * `editorConfig.collaboration.channelId` wins.
   */
  channelId: string | null
  /** Container element for the presence list UI, rendered by the editor component. */
  presenceListContainer?: HTMLElement | null
}

/**
 * Dynamically imports `ckeditor5-premium-features` (code + CSS) and builds the
 * plugin list and config for the enabled gates. Callers must guard with
 * isPremiumRequested(): this function assumes a license key is present.
 */
export const loadPremiumExtensions = async (
  settings: CKEditorStudioSettings,
  options: PremiumLoadOptions
): Promise<PremiumExtensions> => {
  const { ai, realtimeCollaboration: rtc } = settings.premium

  // The only reference to the premium package: rspack splits it (and its CSS)
  // into async chunks that are fetched here and only here.
  const [premium] = await Promise.all([
    import('ckeditor5-premium-features'),
    import('ckeditor5-premium-features/ckeditor5-premium-features.css')
  ])

  const extensions: PremiumExtensions = {
    plugins: [],
    config: {},
    realtimeCollaborationActive: false,
    toolbarItems: []
  }

  // CKEditor Cloud Services connection, shared by real-time collaboration and
  // the CKEditor AI service authentication (config.cloudServices.tokenUrl).
  const cloudServices: { tokenUrl?: string, webSocketUrl?: string } = {}
  if (rtc.tokenUrl !== null && rtc.tokenUrl !== '') {
    cloudServices.tokenUrl = rtc.tokenUrl
  }
  if (rtc.webSocketUrl !== null && rtc.webSocketUrl !== '') {
    cloudServices.webSocketUrl = rtc.webSocketUrl
  }
  if (cloudServices.tokenUrl !== undefined || cloudServices.webSocketUrl !== undefined) {
    extensions.config.cloudServices = cloudServices
  }

  if (ai.enabled) {
    extensions.plugins.push(
      // AIEditorIntegration is the required core integration (ships the
      // 'toggleAi' toolbar button); the rest are the standalone AI features.
      premium.AIEditorIntegration,
      premium.AIChat,
      premium.AIChatShortcuts,
      premium.AIQuickActions,
      premium.AIReviewMode,
      premium.AITranslate
    )

    // The AI UI needs a container; 'overlay' works without a dedicated DOM
    // element, which fits the Studio detail view. Everything from
    // ckeditor_studio.premium.ai.config is spread over it, so integrators can
    // override the container or add adapter, chat, serviceUrl, ... options.
    extensions.config.ai = {
      container: { type: 'overlay' },
      ...ai.config
    } as EditorConfig['ai']

    // The AI buttons only exist with the AI plugins loaded, so they are added
    // here instead of in the yaml toolbar (which would warn on the free path).
    // 'toggleAi' opens the AI panel (chat), 'aiQuickActions' the quick actions.
    extensions.toolbarItems.push('toggleAi', 'aiQuickActions')

    if (cloudServices.tokenUrl === undefined) {
      console.warn(
        `${TAG} ckeditor_studio.premium.ai is enabled without a Cloud Services token endpoint ` +
        '(ckeditor_studio.premium.realtime_collaboration.token_url, used for AI authentication even when the ' +
        'realtime_collaboration gate is off). The AI features will not reach the AI service unless ' +
        'premium.ai.config provides its own authentication (for example a legacy AI Assistant adapter).'
      )
    }
  }

  if (rtc.enabled) {
    if (cloudServices.tokenUrl === undefined || cloudServices.webSocketUrl === undefined) {
      console.warn(
        `${TAG} ckeditor_studio.premium.realtime_collaboration is enabled but token_url and/or web_socket_url ` +
        'is missing. Skipping real-time collaboration for this editor; the free feature set stays active.'
      )
    } else if (options.channelId === null) {
      console.warn(
        `${TAG} ckeditor_studio.premium.realtime_collaboration is enabled but no collaboration channel id could ` +
        'be derived for this field (no open element context or no field name, for example in document editables). ' +
        'Skipping real-time collaboration for this editor. You can set an explicit ' +
        'editorConfig.collaboration.channelId per field to opt in.'
      )
    } else {
      extensions.plugins.push(premium.RealTimeCollaborativeEditing)
      extensions.realtimeCollaborationActive = true

      // SourceEditing (part of the free plugin set) refuses to initialize next
      // to RealTimeCollaborativeEditing (error
      // source-editing-incompatible-with-real-time-collaboration) unless this
      // flag acknowledges that source mode edits overwrite concurrent changes.
      extensions.config.sourceEditing = { allowCollaborationFeatures: true }

      // Presence list (who is editing this field) when the editor component
      // rendered a container for it. Remote selections and carets are part of
      // RealTimeCollaborativeEditing itself.
      if (options.presenceListContainer !== null && options.presenceListContainer !== undefined) {
        extensions.plugins.push(premium.PresenceList)
        extensions.config.presenceList = { container: options.presenceListContainer }
      }
    }
  }

  // Channel id also scopes CKEditor AI chat history and context, and CKEditor
  // AI refuses to initialize without one (error ai-missing-channel-id, which
  // fails the whole editor mount). So: the derived id whenever it is known;
  // for AI without a derivable id (document editables) a per-mount random id,
  // which keeps AI working at the cost of chat history across reloads.
  if (options.channelId !== null && (ai.enabled || extensions.realtimeCollaborationActive)) {
    extensions.config.collaboration = { channelId: options.channelId }
  } else if (ai.enabled) {
    extensions.config.collaboration = { channelId: `pimcore-ai-${randomId()}` }
  }

  return extensions
}

const randomId = (): string =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
