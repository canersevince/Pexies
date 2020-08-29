import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

axios.defaults.baseURL = "http://" + location.host
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        curated: [],
        random: [],
        favourites: [],
        loading: true
    },
    mutations: {
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
        storeFavourites(state, payload){
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
        }
    },
    actions: {
        loadFavourites(state){
            let liked = localStorage.getItem('likedPhotos')
            if (liked) {
                liked = JSON.parse(liked)
                state.commit('storeFavourites', liked)
            }
            state.commit('hideLoader')
        },
        likePhoto(state,photo){
            const lStorage = localStorage.getItem('likedPhotos')
            if(lStorage){
                const parsed = JSON.parse(lStorage)
                parsed.push(photo)
                localStorage.setItem('likedPhotos', JSON.stringify(parsed))
            } else {
                localStorage.setItem('likedPhotos', '['+JSON.stringify(photo)+']')
            }
        },
        dislikePhoto(state,photo){
            const lStorage$ = localStorage.getItem('likedPhotos')
            if(lStorage$) {
                const lStorage = JSON.parse(lStorage$)
                if(lStorage !== null){
                    const foundItem = lStorage.findIndex((i: any) => i.url == photo.url)
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
    modules: {}
})
