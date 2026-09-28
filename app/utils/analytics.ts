// Firebase (GA4 property G-LV2P7252XL). The web config is public by design.
const firebaseConfig = {
    apiKey: 'AIzaSyB6jLM3okoGPrYvKIFiYIO63E8ew0vKB98',
    authDomain: 'beadpattern-b965c.firebaseapp.com',
    projectId: 'beadpattern-b965c',
    storageBucket: 'beadpattern-b965c.firebasestorage.app',
    messagingSenderId: '165605052422',
    appId: '1:165605052422:web:973d558c25092801aa7387',
    measurementId: 'G-LV2P7252XL',
}

type Params = Record<string, string | number | boolean>
type Log = (name: string, params?: Params) => void

let log: Log | null = null
const queue: [string, Params?][] = []

// Called once from the client plugin. Page views are sent by GA itself
// (enhanced measurement follows the router's history changes).
export async function initAnalytics() {
    const [{initializeApp}, {getAnalytics, isSupported, logEvent}] = await Promise.all([
        import('firebase/app'), import('firebase/analytics'),
    ])
    if (!(await isSupported())) return
    const analytics = getAnalytics(initializeApp(firebaseConfig))
    log = (name, params) => logEvent(analytics, name, params)
    for (const [name, params] of queue.splice(0)) log(name, params)
}

// Safe to call anywhere: events before Firebase has loaded are queued, and
// the server never sends any.
export function track(name: string, params?: Params) {
    if (import.meta.server) return
    if (log) log(name, params)
    else if (queue.length < 50) queue.push([name, params])
}
