export default defineNuxtPlugin(async () => {
    const {token, loadUser} = useAuth()
    if (token.value) await loadUser()
})
