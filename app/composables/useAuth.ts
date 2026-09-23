// Sign-in with the shared ninosaur account (Google, through the backend's
// OAuth). Tokens live in cookies on this site; the user is shared state.
export interface AuthUser {
    id: number
    username: string
    first_name?: string
    is_staff?: boolean
}

const MAX_AGE = 60 * 60 * 24 * 100 // refresh token lifetime on the backend

export function useAuth() {
    const token = useCookie<string | null>('bap_token', {maxAge: MAX_AGE, sameSite: 'lax'})
    const refresh = useCookie<string | null>('bap_refresh', {maxAge: MAX_AGE, sameSite: 'lax'})
    const user = useState<AuthUser | null>('auth-user', () => null)
    const api = apiBase()

    // Authenticated request; on a 401 it refreshes the access token once.
    async function request<T>(url: string, opts: Record<string, any> = {}): Promise<T> {
        const go = () => ($fetch as (u: string, o: object) => Promise<T>)(url, {
            baseURL: api, ...opts,
            headers: {...(opts.headers || {}), ...(token.value ? {Authorization: `Bearer ${token.value}`} : {})},
        })
        try {
            return await go()
        } catch (e: any) {
            if (e?.statusCode !== 401 || !refresh.value) throw e
            const r = await $fetch<{ access: string }>('/auth/token/refresh', {baseURL: api, method: 'POST', body: {refresh: refresh.value}}).catch(() => null)
            if (!r?.access) { signOut(); throw e }
            token.value = r.access
            return go()
        }
    }

    async function loadUser() {
        if (!token.value) { user.value = null; return null }
        user.value = await request<AuthUser>('/auth/user').catch(() => null)
        return user.value
    }

    // Google sign-in through the backend; it comes back to /auth/callback.
    function signInUrl(next = '/') {
        const origin = import.meta.client ? window.location.origin : useRequestURL().origin
        const back = `${origin}/auth/callback?next=${encodeURIComponent(next)}`
        return `${api}/auth/google?state=${encodeURIComponent(back)}`
    }

    function signOut() {
        token.value = null
        refresh.value = null
        user.value = null
    }

    return {token, refresh, user, request, loadUser, signInUrl, signOut}
}
