/* eslint-disable  @typescript-eslint/no-explicit-any */
import axios from "axios";
import { User } from '../models/user'
import Cookie from 'js-cookie'
import Store from './index'
axios.defaults.baseURL = location.protocol + "//" + location.host
export const authModule = {
    state: {
        auth: false,
        user: {} as User
    },
    mutations: {
        successfulAuth(state: any, payload: User){
            state.auth = true
            state.user = payload
        },
        updatedUserPicture (state: any, payload: string){
            state.user.preferences.profile_picture = payload
        },
        updatedUserCover (state: any, payload: string){
            state.user.preferences.profile_cover = payload
        },
        updateFavs(state: any, payload: []){
            console.log('new favs!')
            console.log(payload)
            state.user.favourites = payload
        },
        pushNewFav(state: any, payload: []){
            console.log('new favs!')
            console.log(payload)
            state.user.favourites.push(payload)
        },

    },
    actions : {
        logout(store: any){
            Cookie.remove('pexies_token')
            Cookie.remove('pexies_username')
            location.reload()
        },
        signup(state: any, {$buefy, User, Login, Close}: any) {
            console.log('new user info:', User)
            axios.post('/api/user/signup', User).then(res => {
                const { data } = res
                if(data.error){
                    if(data.code == 'exists'){
                        $buefy.toast.open({
                            message: data.error,
                            type: "is-warning"
                        })
                    }
                } else {
                    if(data.username){
                        if (data.username.toString().toLowerCase() == User.username.toString().toLowerCase()) {
                            $buefy.toast.open({
                                message: "Account created!",
                                type: "is-success"
                            })
                            Close()
                            Login(data)
                        }
                    }
                }
            }).catch(err => {
                console.log(err)
                $buefy.toast.open({
                    message: "There was en error while authentication. Please retry."+err.data,
                    type: "is-warning"
                })
            })
        },
        login(state: any, {$buefy, User, $router, Close, Remember}: any) {
            axios.post('/api/user/login', User).then(res => {
                const { data } = res;
                if (data && data.username && data.username.toLowerCase() == User.username.toLowerCase()) {
                    state.commit('successfulAuth', data)
                    if(Remember){
                        Cookie.set('pexies_token', data.token)
                        Cookie.set('pexies_username', data.username)
                    }
                    $buefy.toast.open({
                        message: `Welcome, ${data.username.charAt(0)+data.username.substring(1,data.username.length)}!`,
                        type: "is-success"
                    })
                    Store.dispatch('syncFavs', {})
                    Close()
                } else if (data.error){
                    if(data.code == 'not_found'){
                        $buefy.toast.open({
                            message: data.error,
                            type: "is-danger"
                        })
                    } else {
                        $buefy.toast.open({
                            message: "There was en error while authentication. Please retry.",
                            type: "is-danger"
                        })
                    }
                }
            }).catch(err => {
                $buefy.toast.open({
                    message: "There was en error while authentication. Please retry."+ err.data
                })
            })
        },
        loginWithToken(state: any, {token, username, $buefy}: any){
            axios.post('/api/user/login_token', {pexies_token: token, username}).then(res => {
                const { data } = res;
                if (data && data.username && data.username.toLowerCase() == username.toLowerCase()) {
                    state.commit('successfulAuth', data)
                    $buefy.toast.open({
                        message: `Welcome back, ${data.username.charAt(0)+data.username.substring(1,data.username.length)}!`,
                        type: "is-success"
                    })
                    Store.dispatch('syncFavs', {})
                } else if (data.error){
                    if(data.code == 'not_found'){
                        $buefy.toast.open({
                            message: data.error,
                            type: "is-danger"
                        })
                    } else {
                        $buefy.toast.open({
                            message: "There was en error while authentication. Please retry.",
                            type: "is-danger"
                        })
                    }
                }
            }).catch(err => {
                console.log(err)
                Cookie.remove('pexies_token')
                Cookie.remove('pexies_username')
                $buefy.toast.open({
                    message: "There was en error while authentication. Please retry."+ err.data
                })
            })
        },
        syncFavs(store: any, {$buefy}: any){
            const favourites = store.getters.getFavourites
            const userFavs = store.getters.getCurrentUsersFavourites
            let payload;
            if(favourites && userFavs){
                payload = [...favourites, ...userFavs]
            } else {
                if($buefy){
                    $buefy.toast.open({
                        message: "There is nothing in your favourites...",
                        type: "is-warning"
                    })
                }
                return
            }
            store.commit('showLoader')
            axios.defaults.headers.username = store.state.user.username
            axios.post('/api/user/sync_favourites', payload).then(res => {
                console.log(res)
                store.commit('updateFavs', res.data.favourites)
                store.commit('hideLoader')
            })
        }
    },
    getters : {

    }
}
