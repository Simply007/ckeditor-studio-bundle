/**
 * One shared CKEditor `Context` per Pimcore element edit tab (premium AI path only).
 *
 * CKEditor AI reads and edits across every editor that shares a `Context`
 * ("AI in multi-root and multi-editor setups", stable since v48.3): the AI
 * feature plugins (chat, chat history, shortcuts, review, translate) and the
 * `ai.container` live on the Context, each editor keeps only
 * `AIEditorIntegration` + `AIQuickActions` and describes itself through
 * `root.title` / `root.description`. So a Pimcore element with several
 * wysiwyg fields (the Home document has five editables) gets ONE chat that
 * sees all of them.
 *
 * Lifecycle: the Context is created lazily by the first editor of an element,
 * reference counted, and destroyed (after a short grace period that absorbs
 * remounts) when the last editor of that element unmounts, i.e. when the
 * element tab closes.
 *
 * The AI UI is docked in a panel owned by this registry: fixed to the right
 * edge of the scroll container that holds the element's editors (the editmode
 * iframe body for documents, Studio's scrolling edit panel for data objects),
 * with matching right padding on that container so the content is pushed
 * aside instead of covered. `premium.ai.container: overlay` restores the
 * floating overlay instead.
 *
 * This module is imported only from premium.ts on the premium path, and takes
 * every CKEditor class from the CDN-loaded core and premium features (see
 * core.ts), so it never runs on the free path.
 */
import type { Context, ContextConfig } from 'ckeditor5'
import type { Core, Premium } from './core'

export type AIContainerMode = 'sidebar' | 'overlay'

export interface SharedContextOptions {
  /** Registry key and Context channel base: `pimcore-<elementType>-<elementId>`. */
  key: string
  /** Any DOM element of the first editor; used to find the document and scroll root. */
  anchor: HTMLElement
  licenseKey: string
  cloudServices: { tokenUrl?: string, webSocketUrl?: string }
  aiConfig: Record<string, unknown>
  container: AIContainerMode
  /** Share one presence list across the element's editors (RTC gate on). */
  presence: boolean
}

interface Entry {
  refs: number
  contextPromise: Promise<Context>
  destroyTimer: ReturnType<typeof setTimeout> | null
  panel: DockedPanel | null
}

const TAG = '[ckeditor-studio-bundle]'
const DESTROY_GRACE_MS = 1500

const registry = new Map<string, Entry>()

/**
 * Returns the shared Context for an element (creating it on first use) and a
 * release callback. Every acquire must be paired with exactly one release.
 */
export const acquireSharedContext = (
  premium: Premium,
  core: Core,
  options: SharedContextOptions
): { contextPromise: Promise<Context>, release: () => void } => {
  let entry = registry.get(options.key)

  if (entry === undefined) {
    const panel = options.container === 'sidebar' ? new DockedPanel(options.anchor, options.presence) : null
    entry = {
      refs: 0,
      destroyTimer: null,
      panel,
      contextPromise: createContext(premium, core, options, panel)
    }
    registry.set(options.key, entry)
  }

  if (entry.destroyTimer !== null) {
    clearTimeout(entry.destroyTimer)
    entry.destroyTimer = null
  }
  entry.refs++

  const acquired = entry
  let released = false

  return {
    contextPromise: acquired.contextPromise,
    release: () => {
      if (released) {
        return
      }
      released = true
      acquired.refs--
      if (acquired.refs > 0) {
        return
      }
      acquired.destroyTimer = setTimeout(() => {
        if (acquired.refs > 0 || registry.get(options.key) !== acquired) {
          return
        }
        registry.delete(options.key)
        acquired.contextPromise
          .then(async (context) => { await context.destroy() })
          .catch((error) => { console.warn(`${TAG} Destroying the shared AI context failed.`, error) })
          .finally(() => { acquired.panel?.destroy() })
      }, DESTROY_GRACE_MS)
    }
  }
}

const createContext = async (premium: Premium, core: Core, options: SharedContextOptions, panel: DockedPanel | null): Promise<Context> => {
  const plugins: NonNullable<ContextConfig['plugins']> = [
    // AI feature plugins live on the Context: one Chat / History / Review /
    // Translate UI shared by every editor of the element.
    core.CloudServices,
    premium.AIChat,
    premium.AIChatHistory,
    premium.AIChatShortcuts,
    premium.AIReviewMode,
    premium.AITranslate
  ]

  const config: ContextConfig & Record<string, unknown> = {
    licenseKey: options.licenseKey,
    cloudServices: options.cloudServices,
    // The Context needs its own channel, separate from the per-editor ones;
    // AI chat history is scoped to it (ai-chat-missing-channel-id otherwise).
    collaboration: { channelId: options.key },
    ai: {
      container: panel !== null
        ? { type: 'sidebar', element: panel.aiHost, visibleByDefault: true, collapsible: true }
        : { type: 'overlay' },
      // The docked panel is position: fixed, so anchor AI balloons and dialogs
      // to the page body instead of the positioned panel (CKEditor docs:
      // "If the sidebar container is positioned ... configure an overlay UI
      // container too").
      ...(panel !== null ? { overlayContainer: panel.ownerDocument.body } : {}),
      ...options.aiConfig
    }
  }

  if (options.presence && panel !== null) {
    plugins.push(premium.PresenceList)
    config.presenceList = { container: panel.presenceHost }
  }

  config.plugins = plugins

  const context = await core.Context.create(config)
  panel?.attach(context)
  return context
}

/**
 * The docked AI panel: a fixed column on the right edge of the element's scroll
 * root, plus matching padding on that root so content moves aside. Follows the
 * root's size and position, and collapses (padding removed) whenever the AI UI
 * is hidden through the AI toggle button.
 */
class DockedPanel {
  readonly ownerDocument: Document
  readonly element: HTMLDivElement
  readonly aiHost: HTMLDivElement
  readonly presenceHost: HTMLDivElement
  private readonly root: HTMLElement
  private readonly isBodyRoot: boolean
  private readonly previousPaddingRight: string
  private readonly resizeObserver: ResizeObserver | null
  private readonly onWindowResize: () => void
  private visible = true

  constructor (anchor: HTMLElement, presence: boolean) {
    this.ownerDocument = anchor.ownerDocument
    this.root = findScrollRoot(anchor)
    this.isBodyRoot = this.root === this.ownerDocument.body || this.root === this.ownerDocument.documentElement
    this.previousPaddingRight = this.root.style.paddingRight

    ensurePanelStyles(this.ownerDocument)

    this.element = this.ownerDocument.createElement('div')
    this.element.className = 'ckeditor-studio-ai-panel'

    this.presenceHost = this.ownerDocument.createElement('div')
    this.presenceHost.className = 'ckeditor-studio-ai-panel__presence'
    this.presenceHost.hidden = !presence

    this.aiHost = this.ownerDocument.createElement('div')
    this.aiHost.className = 'ckeditor-studio-ai-panel__ai'

    this.element.append(this.presenceHost, this.aiHost)
    // Mounted inside the scroll root (not the page body): Studio hides inactive
    // element tabs with visibility: hidden, which the panel then inherits, so a
    // background tab's panel never floats over the active one. position: fixed
    // keeps it pinned to the viewport while the root scrolls.
    ;(this.isBodyRoot ? this.ownerDocument.body : this.root).appendChild(this.element)

    const view = this.ownerDocument.defaultView ?? window
    this.onWindowResize = () => { this.layout() }
    view.addEventListener('resize', this.onWindowResize)
    this.resizeObserver = typeof view.ResizeObserver === 'function'
      ? new view.ResizeObserver(() => { this.layout() })
      : null
    this.resizeObserver?.observe(this.root)

    this.layout()
  }

  /** Hooks the AI tabs visibility (toggle button) to the panel visibility. */
  attach (context: Context): void {
    const plugins = context.plugins as unknown as { has: (name: string) => boolean, get: (name: string) => any }
    if (!plugins.has('AITabs')) {
      return
    }
    const view = plugins.get('AITabs').view
    if (view === undefined || view === null || typeof view.on !== 'function') {
      return
    }
    const sync = (): void => {
      this.visible = view.isVisible !== false
      this.layout()
    }
    view.on('change:isVisible', sync)
    sync()
  }

  layout (): void {
    const view = this.ownerDocument.defaultView ?? window
    const width = panelWidth(this.isBodyRoot ? view.innerWidth : this.root.getBoundingClientRect().width)

    // Covers roots removed from layout entirely (display: none, size 0); the
    // ResizeObserver on the root fires on that size change. Studio's own tab
    // switching (visibility: hidden) is inherited from the root instead.
    const rootRendered = this.isBodyRoot || this.root.getClientRects().length > 0
    const show = this.visible && rootRendered

    this.element.style.display = show ? '' : 'none'
    this.root.style.paddingRight = this.visible ? `${width + 12}px` : this.previousPaddingRight
    if (!show) {
      return
    }

    if (this.isBodyRoot) {
      Object.assign(this.element.style, { top: '0px', right: '0px', left: 'auto', bottom: '0px', width: `${width}px`, height: 'auto' })
      return
    }

    const rect = this.root.getBoundingClientRect()
    const scrollbar = Math.max(0, this.root.offsetWidth - this.root.clientWidth)
    const targetTop = rect.top
    const targetLeft = rect.right - scrollbar - width
    Object.assign(this.element.style, {
      top: `${targetTop}px`,
      left: `${targetLeft}px`,
      right: 'auto',
      bottom: 'auto',
      width: `${width}px`,
      height: `${this.root.clientHeight}px`
    })

    // Inside Studio's tree, an ancestor (transform, filter, contain) can be the
    // containing block of this position: fixed panel, which offsets viewport
    // coordinates. Measure and correct by the difference.
    const actual = this.element.getBoundingClientRect()
    const dx = actual.left - targetLeft
    const dy = actual.top - targetTop
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      this.element.style.left = `${targetLeft - dx}px`
      this.element.style.top = `${targetTop - dy}px`
    }
  }

  destroy (): void {
    const view = this.ownerDocument.defaultView ?? window
    view.removeEventListener('resize', this.onWindowResize)
    this.resizeObserver?.disconnect()
    this.root.style.paddingRight = this.previousPaddingRight
    this.element.remove()
  }
}

/** Panel width: a share of the available width, clamped for laptops and wide screens. */
const panelWidth = (available: number): number => Math.round(Math.min(440, Math.max(300, available * 0.32)))

/** Nearest scrolling ancestor; the document body when none (document editmode iframe). */
const findScrollRoot = (anchor: HTMLElement): HTMLElement => {
  const view = anchor.ownerDocument.defaultView ?? window
  let node: HTMLElement | null = anchor.parentElement
  while (node !== null && node !== anchor.ownerDocument.body) {
    const overflowY = view.getComputedStyle(node).overflowY
    if ((overflowY === 'auto' || overflowY === 'scroll') && node.clientHeight > 0) {
      return node
    }
    node = node.parentElement
  }
  return anchor.ownerDocument.body
}

const STYLE_ID = 'ckeditor-studio-ai-panel-styles'

const ensurePanelStyles = (doc: Document): void => {
  if (doc.getElementById(STYLE_ID) !== null) {
    return
  }
  const style = doc.createElement('style')
  style.id = STYLE_ID
  style.textContent = `
    .ckeditor-studio-ai-panel {
      position: fixed;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      background: var(--ck-color-base-background, #fff);
      border-left: 1px solid var(--ck-color-base-border, #ccced1);
    }
    .ckeditor-studio-ai-panel__presence:not([hidden]) {
      flex-shrink: 0;
      padding: 6px 8px;
      border-bottom: 1px solid var(--ck-color-base-border, #ccced1);
    }
    .ckeditor-studio-ai-panel__ai {
      flex: 1 1 auto;
      min-height: 0;
      display: flex;
    }
    .ckeditor-studio-ai-panel__ai .ck.ck-ai-tabs {
      width: 100%;
      height: 100%;
    }
  `
  doc.head.appendChild(style)
}
