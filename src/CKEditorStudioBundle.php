<?php
declare(strict_types=1);

/**
 * CKEditor integration bundle for Pimcore Studio.
 *
 * Conference demo (Pimcore Community Dev Days 2026), modeled architecturally
 * on pimcore/quill-bundle. MIT licensed.
 */

namespace Chrastina\CKEditorStudioBundle;

use Chrastina\CKEditorStudioBundle\DependencyInjection\CKEditorStudioExtension;
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
