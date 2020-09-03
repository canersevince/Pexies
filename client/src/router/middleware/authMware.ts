export default function authMiddleware({store, next}: any) {
    if (!store.state.auth.auth) {
        return
    }
    return
}
