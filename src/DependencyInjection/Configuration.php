<?php
declare(strict_types=1);

/**
 * CKEditor integration bundle for Pimcore Studio.
 *
 * Conference demo (Pimcore Community Dev Days 2026), modeled architecturally
 * on pimcore/quill-bundle. MIT licensed.
 */

namespace Chrastina\CKEditorStudioBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\TreeBuilder;
use Symfony\Component\Config\Definition\ConfigurationInterface;

/**
 * ckeditor_studio:
 *   license_key: '%env(CKEDITOR_LICENSE_KEY)%'   # default; empty = free feature set with licenseKey 'GPL'
 *   toolbar: [ 'undo', 'redo', '|', ... ]        # default preset below
 *   premium:
 *     ai:
 *       enabled: false
 *       config: {}                               # raw CKEditor "ai" config (adapter etc.), passed through
 *     realtime_collaboration:
 *       enabled: false
 *       token_url: null                          # required when enabled
 *       web_socket_url: null                     # required when enabled
 */
final class Configuration implements ConfigurationInterface
{
    /**
     * Default toolbar preset. Every item here is backed by a plugin the frontend
     * build ships (open source feature set), so it works with and without a
     * license key.
     *
     * @var string[]
     */
    public const DEFAULT_TOOLBAR = [
        'undo', 'redo', '|',
        'heading', '|',
        'bold', 'italic', 'underline', '|',
        'alignment', '|',
        'bulletedList', 'numberedList', 'outdent', 'indent', '|',
        'blockQuote', 'link', 'insertTable', '|',
        'sourceEditing',
    ];

    public function getConfigTreeBuilder(): TreeBuilder
    {
        $treeBuilder = new TreeBuilder('ckeditor_studio');

        $treeBuilder->getRootNode()
            ->children()
                ->scalarNode('license_key')
                    ->info(
                        'CKEditor license key. Defaults to the CKEDITOR_LICENSE_KEY environment variable. '
                        . 'Empty or unset: the editor runs the open source feature set with licenseKey "GPL". '
                        . 'Set: the key is used as licenseKey and premium features may be enabled below.'
                    )
                    ->defaultValue('%env(CKEDITOR_LICENSE_KEY)%')
                ->end()
                ->arrayNode('toolbar')
                    ->info(
                        'CKEditor toolbar items (strings, "|" is a separator). Items must be backed by a plugin '
                        . 'the frontend build ships; unknown items are skipped by CKEditor with a console warning.'
                    )
                    ->scalarPrototype()->end()
                    ->defaultValue(self::DEFAULT_TOOLBAR)
                ->end()
                ->arrayNode('premium')
                    ->info('Premium feature gates. Scaffolded: see the frontend premium.ts and the bundle README before enabling.')
                    ->addDefaultsIfNotSet()
                    ->children()
                        ->arrayNode('ai')
                            ->addDefaultsIfNotSet()
                            ->children()
                                ->booleanNode('enabled')
                                    ->info('Enable CKEditor AI. Requires license_key and the scaffolded frontend wiring (ckeditor5-premium-features).')
                                    ->defaultFalse()
                                ->end()
                                ->variableNode('config')
                                    ->info('Raw CKEditor "ai" configuration (adapter, model, endpoints). Passed to the frontend as-is.')
                                    ->defaultValue([])
                                ->end()
                            ->end()
                        ->end()
                        ->arrayNode('realtime_collaboration')
                            ->addDefaultsIfNotSet()
                            ->children()
                                ->booleanNode('enabled')
                                    ->info('Enable real-time collaboration. Requires license_key, Cloud Services credentials and the scaffolded frontend wiring.')
                                    ->defaultFalse()
                                ->end()
                                ->scalarNode('token_url')
                                    ->info('CKEditor Cloud Services token endpoint (cloudServices.tokenUrl).')
                                    ->defaultNull()
                                ->end()
                                ->scalarNode('web_socket_url')
                                    ->info('CKEditor Cloud Services WebSocket URL (cloudServices.webSocketUrl).')
                                    ->defaultNull()
                                ->end()
                            ->end()
                            ->validate()
                                ->ifTrue(static fn (array $rtc): bool => $rtc['enabled'] === true
                                    && ($rtc['token_url'] === null || $rtc['web_socket_url'] === null))
                                ->thenInvalid('ckeditor_studio.premium.realtime_collaboration needs token_url and web_socket_url when enabled.')
                            ->end()
                        ->end()
                    ->end()
                ->end()
            ->end();

        return $treeBuilder;
    }
}
