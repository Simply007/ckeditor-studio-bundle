/**
 * Side-effect CSS imports (static and dynamic) handled by the bundler.
 * Needed for dynamic import() of stylesheets, for example
 * `import('ckeditor5-premium-features/ckeditor5-premium-features.css')`,
 * which TypeScript cannot resolve through the package exports map.
 */
declare module '*.css'
