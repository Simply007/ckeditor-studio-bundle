/**
 * Premium feature scaffold: CKEditor AI and real-time collaboration.
 *
 * SCAFFOLDED ONLY. This module is the single place where premium plugins get
 * wired in once the project decides to use them. It currently ships no premium
 * code: the `ckeditor5-premium-features` package is deliberately NOT installed,
 * so the committed build stays a clean open source (GPL) build. With the flags
 * off (the default) this module is a no-op.
 *
 * To activate a premium feature for real:
 *
 * 1. Get a commercial or trial license key (https://portal.ckeditor.com/) and
 *    set it as CKEDITOR_LICENSE_KEY (or ckeditor_studio.license_key).
 * 2. In assets/studio: `npm install ckeditor5-premium-features@<same version as ckeditor5>`.
 * 3. Uncomment the marked blocks below (imports, CSS, plugin + config wiring).
 * 4. Enable the flag in config/packages/ckeditor_studio.yaml (see the bundle README).
 * 5. Rebuild (`npm run build`) and commit the new build output.
 *
 * Until step 3 happens, an enabled flag only logs a console warning and the
 * editor keeps the free feature set, so a misconfigured instance never breaks.
 */
import { type EditorConfig } from 'ckeditor5'
// Scaffold (step 3): uncomment when ckeditor5-premium-features is installed.
// import { AIAssistant, RealTimeCollaborativeEditing } from 'ckeditor5-premium-features'
// import 'ckeditor5-premium-features/ckeditor5-premium-features.css'
import { type CKEditorStudioSettings } from './settings'

export interface PremiumExtensions {
  plugins: NonNullable<EditorConfig['plugins']>
  config: Partial<EditorConfig>
}

const TAG = '[ckeditor-studio-bundle]'

export const resolvePremiumExtensions = (settings: CKEditorStudioSettings): PremiumExtensions => {
  const extensions: PremiumExtensions = { plugins: [], config: {} }
  const { ai, realtimeCollaboration: rtc } = settings.premium

  if (!ai.enabled && !rtc.enabled) {
    return extensions
  }

  if (!settings.hasLicenseKey) {
    console.warn(
      `${TAG} Premium features are enabled in ckeditor_studio config but no license key is configured ` +
      '(CKEDITOR_LICENSE_KEY / ckeditor_studio.license_key). Falling back to the free feature set.'
    )
    return extensions
  }

  if (ai.enabled) {
    console.warn(
      `${TAG} ckeditor_studio.premium.ai is enabled, but CKEditor AI is scaffolded only. ` +
      'Install ckeditor5-premium-features and uncomment the AI block in premium.ts. ' +
      'Extra requirements: an AI adapter configuration (ckeditor_studio.premium.ai.config, served as the ' +
      'CKEditor "ai" option: adapter endpoint or Cloud Services based), and an "aiAssistant"/AI toolbar item.'
    )
    // Scaffold (step 3):
    // extensions.plugins.push(AIAssistant)
    // extensions.config.ai = settings.premium.ai.config as EditorConfig['ai']
    // Add the AI toolbar button via ckeditor_studio.toolbar (for example 'aiAssistant').
  }

  if (rtc.enabled) {
    console.warn(
      `${TAG} ckeditor_studio.premium.realtime_collaboration is enabled, but real-time collaboration is ` +
      'scaffolded only. Install ckeditor5-premium-features and uncomment the RTC block in premium.ts. ' +
      'Extra requirements: CKEditor Cloud Services credentials (token_url + web_socket_url, already part of ' +
      'the yaml config), and a per-field collaboration channelId, which this integration still has to derive ' +
      'from the Studio element id + field name.'
    )
    // Scaffold (step 3):
    // extensions.plugins.push(RealTimeCollaborativeEditing)
    // extensions.config.cloudServices = {
    //   tokenUrl: rtc.tokenUrl ?? undefined,
    //   webSocketUrl: rtc.webSocketUrl ?? undefined
    // }
    // extensions.config.collaboration = { channelId: '<derive from element id + field name>' }
    // Note: with RTC active, setData()/initialData handling changes (the document state lives in
    // Cloud Services); revisit the defaultValue effect in editor.tsx when wiring this up.
  }

  return extensions
}
