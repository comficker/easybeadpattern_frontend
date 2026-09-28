// Firebase loads after the page is idle, so it never competes with the first paint.
export default defineNuxtPlugin(() => {
    if (import.meta.dev) return
    const start = () => initAnalytics().catch(() => {})
    const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(start, {timeout: 4000}) : setTimeout(start, 2000))
    if (document.readyState === 'complete') idle()
    else window.addEventListener('load', idle, {once: true})
})
