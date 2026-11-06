/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public origin of the site, without trailing slash. Used for canonical URLs, Open Graph and the sitemap. */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
