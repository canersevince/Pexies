import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {Photo} from "../models/photo";
import { authModule } from "./auth";
import * as Cookie from 'js-cookie'

axios.defaults.baseURL = location.protocol + "//" + location.host
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth: authModule
    },
    state: {
        nightMode: false,
        curated: [],
        random: [],
        favourites: [],
        loading: true
    },
    mutations: {
        switchNightMode(state, payload) {
            state.nightMode = payload
            Cookie.set('nm', payload)
        },
        hideLoader(state) {
            state.loading = false
        },
        showLoader(state) {
            state.loading = true
        },
        storeCurated(state, payload) {
            state.curated = payload
        },
        storeRandom(state, payload) {
            state.random = payload
        },
        storeFavourites(state, payload) {
            state.favourites = payload
        }
    },
    getters: {
        getCuratedPhotos(state) {
            return state.curated
        },
        getRandomPhotos(state) {
            return state.random
        },
        getFavourites(state) {
            return state.favourites
        },
        getNightMode(state) {
            return state.nightMode
        }
    },
    actions: {
        expandPhoto(state, {$buefy, $el}) {
            // tslint:disable-next-line
            $buefy.modal.open({content: [$el]})
            setTimeout(() => {
                state.commit('hideLoader')
            }, 500)
        },
        loadFavourites(state) {
            let liked = localStorage.getItem('likedPhotos')
            if (liked) {
                liked = JSON.parse(liked)
                state.commit('storeFavourites', liked)
            }
            state.commit('hideLoader')
        },
        likePhoto(state, photo) {
            const lStorage = localStorage.getItem('likedPhotos')
            if (lStorage) {
                const parsed = JSON.parse(lStorage)
                parsed.push(photo)
                localStorage.setItem('likedPhotos', JSON.stringify(parsed))
            } else {
                localStorage.setItem('likedPhotos', '[' + JSON.stringify(photo) + ']')
            }
        },
        dislikePhoto(state, photo) {
            const lStorage$ = localStorage.getItem('likedPhotos')
            if (lStorage$) {
                const lStorage = JSON.parse(lStorage$)
                if (lStorage !== null) {
                    const foundItem = lStorage.findIndex((i: Photo) => i.url == photo.url)
                    lStorage.splice(foundItem, 1)
                    localStorage.setItem('likedPhotos', JSON.stringify(lStorage))
                    state.dispatch('loadFavourites')
                    console.log(lStorage)
                }
            }
        },
        async getRandom(state, $buefy) {
            state.commit('showLoader')
            try {
                const {data} = await axios.get('/api/photos/random')
                console.log(data)
                state.commit('storeRandom', data.photos)
                state.commit('hideLoader')
            } catch (e) {
                state.commit('hideLoader')
                $buefy.toast.open({
                    message: 'Can\'t reach api.',
                    type: 'is-danger'
                })
            }
        },
        async getCurated(state, $buefy) {
            try {
                const {data} = await axios.get('/api/photos/curated')
                state.commit('storeCurated', data)
                state.commit('hideLoader')
            } catch (e) {
                state.commit('hideLoader')
                $buefy.toast.open({
                    message: 'Can\'t reach api.',
                    type: 'is-danger'
                })
            }
        },
    },
})
