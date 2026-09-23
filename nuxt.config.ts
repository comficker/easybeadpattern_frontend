// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: {enabled: false},
    css: ['./app/assets/css/main.css'],
    nitro: {
        compressPublicAssets: {gzip: true, brotli: true},
        routeRules: {
            // Fonts never change under the same name; icons and share cards rarely do.
            '/fonts/**': {headers: {'cache-control': 'public, max-age=31536000, immutable'}},
            '/icons/**': {headers: {'cache-control': 'public, max-age=604800, stale-while-revalidate=86400'}},
            '/og/**': {headers: {'cache-control': 'public, max-age=604800, stale-while-revalidate=86400'}},
        },
    },
    // Ship all CSS inside the HTML: no stylesheet request blocks the first paint.
    features: {inlineStyles: true},
    runtimeConfig: {
        public: {
            api: process.env.NUXT_PUBLIC_API || 'https://touch.ninosaur.com',
            siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://easybeadpattern.com',
        },
    },
    typescript: {
        tsConfig: {compilerOptions: {noUnusedLocals: false, noUnusedParameters: false}},
    },
    app: {
        head: {
            titleTemplate: '%s · EasyBeadPattern',
            htmlAttrs: {lang: 'en'},
            link: [
                {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
                {rel: 'apple-touch-icon', sizes: '180x180', href: '/og/apple-touch-icon.png'},
                // Rubik is self-hosted (public/fonts, OFL), so no third-party CSS blocks the first paint.
                {rel: 'preload', href: '/fonts/rubik-latin.woff2', as: 'font', type: 'font/woff2', crossorigin: ''},
                {rel: 'preconnect', href: 'https://touch.ninosaur.com'},
            ],
            meta: [
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                {name: 'theme-color', content: '#1f2a44'},
                {property: 'og:site_name', content: 'EasyBeadPattern'},
                {name: 'twitter:card', content: 'summary_large_image'},
            ],
        },
    },
})
