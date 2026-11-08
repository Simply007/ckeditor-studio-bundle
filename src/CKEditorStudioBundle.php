<?php
declare(strict_types=1);

/**
 * CKEditor integration bundle for Pimcore Studio.
 *
 * Modeled architecturally on pimcore/quill-bundle. Licensed under
 * GPL-2.0-or-later, see LICENSE.
 */

namespace Simply007\CKEditorStudioBundle;

use Simply007\CKEditorStudioBundle\DependencyInjection\CKEditorStudioExtension;
use Pimcore\Extension\Bundle\AbstractPimcoreBundle;
use Symfony\Component\DependencyInjection\Extension\ExtensionInterface;

class CKEditorStudioBundle extends AbstractPimcoreBundle
{
    public function getContainerExtension(): ExtensionInterface
    {
        return new CKEditorStudioExtension();
    }

    public function getPath(): string
    {
        return dirname(__DIR__);
    }
}
