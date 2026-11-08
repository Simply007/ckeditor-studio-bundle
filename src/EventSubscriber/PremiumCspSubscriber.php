<?php
declare(strict_types=1);

/**
 * CKEditor integration bundle for Pimcore Studio.
 *
 * Modeled architecturally on pimcore/quill-bundle. Licensed under
 * GPL-2.0-or-later, see LICENSE.
 */

namespace Simply007\CKEditorStudioBundle\EventSubscriber;

use Pimcore\Bundle\StudioUiBundle\Event\Csp\CspEvent;
use Pimcore\Bundle\StudioUiBundle\Security\Csp\ContentSecurityPolicyHandlerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Pimcore Studio sends a strict Content Security Policy whose connect-src
 * allows only 'self' and a few Pimcore hosts. The premium features talk to
 * CKEditor Cloud Services from the browser (CKEditor AI over HTTPS, real-time
 * collaboration over a WebSocket) and commercial/trial license keys report
 * usage to the CKEditor usage endpoint, so all of that would be blocked. On
 * the premium path the editor code itself (CKEditor core and the premium
 * features) is loaded from the CKEditor CDN, which needs script-src and
 * style-src.
 *
 * This subscriber widens the policy ONLY when a license key is configured
 * and at least one premium gate is on, so the free (GPL) path keeps Studio's
 * policy byte for byte.
 */
final class PremiumCspSubscriber implements EventSubscriberInterface
{
    /** Cloud Services hosts (US and EU regions, REST and WebSocket) and the license usage endpoint. */
    public const CONNECT_ORIGINS = [
        'https://*.cke-cs.com',
        'wss://*.cke-cs.com',
        'https://*.cke-cs-eu.com',
        'wss://*.cke-cs-eu.com',
        'https://proxy-event.ckeditor.com',
    ];

    /** CKEditor CDN: core and premium feature scripts and style sheets on the premium path. */
    public const CDN_ORIGIN = 'https://cdn.ckeditor.com';

    /**
     * @param array<string, mixed> $premium
     */
    public function __construct(
        private readonly string $licenseKey,
        private readonly array $premium,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [CspEvent::class => 'onCspEvent'];
    }

    public function onCspEvent(CspEvent $event): void
    {
        if (!$this->isPremiumActive()) {
            return;
        }

        $handler = $event->getCspHandler();
        $handler->addAllowedUrls(ContentSecurityPolicyHandlerInterface::CONNECT_OPT, [...self::CONNECT_ORIGINS, self::CDN_ORIGIN]);
        $handler->addAllowedUrls(ContentSecurityPolicyHandlerInterface::SCRIPT_OPT, [self::CDN_ORIGIN]);
        $handler->addAllowedUrls(ContentSecurityPolicyHandlerInterface::STYLE_OPT, [self::CDN_ORIGIN]);
    }

    private function isPremiumActive(): bool
    {
        if ($this->licenseKey === '') {
            return false;
        }

        return (bool) ($this->premium['ai']['enabled'] ?? false)
            || (bool) ($this->premium['realtime_collaboration']['enabled'] ?? false);
    }
}
