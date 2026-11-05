<?php
declare(strict_types=1);

/**
 * CKEditor integration bundle for Pimcore Studio.
 *
 * Conference demo (Pimcore Community Dev Days 2026), modeled architecturally
 * on pimcore/quill-bundle. MIT licensed.
 */

namespace Chrastina\CKEditorStudioBundle\DependencyInjection;

use Symfony\Component\Config\FileLocator;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\DependencyInjection\Extension\Extension;
use Symfony\Component\DependencyInjection\Extension\PrependExtensionInterface;
use Symfony\Component\DependencyInjection\Loader\YamlFileLoader;

final class CKEditorStudioExtension extends Extension implements PrependExtensionInterface
{
    public function getAlias(): string
    {
        return 'ckeditor_studio';
    }

    public function load(array $configs, ContainerBuilder $container): void
    {
        // Default for the env-driven license key: empty string = not configured,
        // the editor stays on the open source feature set (licenseKey 'GPL').
        if (!$container->hasParameter('env(CKEDITOR_LICENSE_KEY)')) {
            $container->setParameter('env(CKEDITOR_LICENSE_KEY)', '');
        }

        $config = $this->processConfiguration(new Configuration(), $configs);

        $container->setParameter('ckeditor_studio.license_key', $config['license_key'] ?? '');
        $container->setParameter('ckeditor_studio.toolbar', $config['toolbar']);
        $container->setParameter('ckeditor_studio.premium', $config['premium']);
    }

    public function prepend(ContainerBuilder $container): void
    {
        $loader = new YamlFileLoader(
            $container,
            new FileLocator(__DIR__ . '/../../config')
        );

        if ($container->hasExtension('pimcore_studio_ui')) {
            $loader->load('studio_ui.yaml');
        }
    }
}
