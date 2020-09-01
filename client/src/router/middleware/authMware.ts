export default function authMiddleware({store, next}: any) {
    console.log('middleware')
    console.log(store)
    if (!store.state.auth.auth) {
        return console.log(store)
    }
    return console.log(store);
}
