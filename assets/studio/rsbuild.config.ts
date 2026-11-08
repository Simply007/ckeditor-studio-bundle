import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { pluginModuleFederation } from '@module-federation/rsbuild-plugin'
import { pluginGenerateEntrypoints, pluginWriteBuildId } from '@pimcore/studio-ui-bundle/rsbuild/plugins'
import { getBuildGroupId } from '@pimcore/studio-ui-bundle/bundler/build-id'
import path from 'path'
import fs from 'fs'
import packages from './package.json'

const ckeditorVersion: string = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'node_modules', 'ckeditor5', 'package.json'), 'utf8')).version
const buildId = getBuildGroupId(__dirname)
const buildRoot = path.resolve(__dirname, '..', '..', 'public', 'studio', 'build')
const buildPath = path.resolve(buildRoot, buildId)

// Single build target: remove stale build dirs so only the current build remains.
if (fs.existsSync(buildRoot)) {
  for (const file of fs.readdirSync(buildRoot)) {
    if (file !== buildId && file !== 'studio-npm-package.tgz' && file !== '.gitkeep') {
      fs.rmSync(path.resolve(buildRoot, file), { recursive: true, force: true })
    }
  }
}

if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath, { recursive: true })
}

const nodeEnv = process.env.NODE_ENV
let env: 'development' | 'production' = 'production'

const isDevServer = nodeEnv === 'dev-server'
if (nodeEnv !== env) {
  env = 'development'
}

export default defineConfig({
  mode: env,
  server: {
    port: 3033
  },
  dev: {
    ...(!isDevServer ? { assetPrefix: '/bundles/ckeditorstudio/studio/build/' + buildId } : {}),
    client: {
      host: 'localhost',
      port: 3033,
      protocol: 'ws'
    }
  },
  source: {
    entry: {
      main: './js/src/main.ts'
    },
    // The premium path loads CKEditor from the CDN at exactly the version the
    // open source build is compiled against (see modules/ckeditor-editor/core.ts).
    define: {
      __CKEDITOR_VERSION__: JSON.stringify(ckeditorVersion)
    },
    decorators: {
      version: 'legacy'
    }
  },
  output: {
    manifest: true,
    assetPrefix: '/bundles/ckeditorstudio/studio/build/' + buildId,
    distPath: {
      root: buildPath
    }
  },
  tools: {
    bundlerChain: (chain) => {
      chain.output.uniqueName('ckeditor_studio_bundle')
    }
  },
  plugins: [
    pluginWriteBuildId({ buildId }),
    pluginGenerateEntrypoints(),
    pluginReact(),
    pluginModuleFederation({
      name: 'ckeditor_studio_bundle',
      filename: 'static/js/remoteEntry.js',
      exposes: {
        '.': './js/src/plugins.ts'
      },
      dts: false,
      remotes: {
        '@pimcore/studio-ui-bundle': `promise new Promise(resolve => {
          const studioUIBundleRemoteUrl = window.StudioUIBundleRemoteUrl
          const script = document.createElement('script')

          let hasScript = false;

          document.querySelectorAll('script').forEach((el) => {
            const elPathname = el.src.replace(/https?:\\/\\/[^/]+/, '')
            const studioUIBundleRemoteUrlPathname = studioUIBundleRemoteUrl.replace(/https?:\\/\\/[^/]+/, '')

            if (elPathname === studioUIBundleRemoteUrlPathname) {
              hasScript = true;
              return;
            }
          })

          if (hasScript) {
            resolve({
              get: (request) => window['pimcore_studio_ui_bundle'].get(request),
              init: (...arg) => {
                try {
                  return window['pimcore_studio_ui_bundle'].init(...arg)
                } catch(e) {
                  console.log('remote container already initialized')
                }
              }
            })
            return
          }

          script.src = studioUIBundleRemoteUrl
          script.onload = () => {
            const proxy = {
              get: (request) => window['pimcore_studio_ui_bundle'].get(request),
              init: (...arg) => {
                try {
                  return window['pimcore_studio_ui_bundle'].init(...arg)
                } catch(e) {
                  console.log('remote container already initialized')
                }
              }
            }
            resolve(proxy)
          }
          document.head.appendChild(script);
        })
        `
      },
      shared: {
        ...packages.dependencies,
        react: {
          singleton: true,
          eager: true,
          requiredVersion: false
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: false
        },
        inversify: {
          eager: true,
          version: '6.1.x',
          requiredVersion: '6.1.x'
        }
      }
    })
  ]
})
