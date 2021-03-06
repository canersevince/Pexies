/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {Photo} from "../models/photo";
import {authModule} from "./auth";
import * as Cookie from 'js-cookie'
import UnsplashGenerator from './generators/unsplash-img'
import FlickrFormatter from './generators/flickr-formatter'

axios.defaults.baseURL = location.protocol + "//" + location.host
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth: authModule
    },
    state: {
        isAppAvailable$: false,
        flickrSearchResultTotal: 1,
        unsplashSearchResultTotal: 1,
        pexelsSearchResultTotal: 1,
        nightMode: null,
        curated: [],
        random: [],
        dashboardContent: [],
        searchResults: {
            pexies: [],
            flickr: [],
            pexels: [],
            unsplash: []
        },
        favourites: [],
        loading: true,
        PPloading: false,
        tags: []
    },
    mutations: {
        switchNightMode(state, payload) {
            state.nightMode = payload
            Cookie.set('nm', payload)
        },
        isAppAvailable(state, payload) {
            state.isAppAvailable$ = payload
        },
        hideLoader(state) {
            state.loading = false
        },
        showLoader(state) {
            state.loading = true
        },
        showPPLoader(state) {
            state.PPloading = true
        },
        hidePPLoader(state) {
            state.PPloading = false
        },
        storeCurated(state, payload) {
            state.curated = payload
        },
        storeRandom(state, payload) {
            state.random = payload
        },
        storeFavourites(state, payload) {
            state.favourites = payload
        },
        updateFlickrPhotos(state, payload) {
            state.searchResults = payload
        },
        updateTags(state, payload) {
            state.tags = payload
        },
        updateSearchResults(state, payload) {
            state.searchResults.flickr = payload.flickr
            state.searchResults.pexels = payload.pexels
            state.searchResults.pexies = payload.pexies
            state.searchResults.unsplash = payload.unsplash
        },
        updatePages(state: any, {pageName, count}) {
            state[pageName] = count
        },
        pushNewPage(state: any, {platform, photos}) {
            state.searchResults[platform] = photos
        },
        removeFav(state: any, photo: Photo) {
            state.loading = true
            const idx = state.auth.user.favourites.findIndex((v: any) => {
                return v.url == photo.url
            })
            state.favourites = state.favourites.filter((val: Photo) => {
                return val.url !== photo.url
            })
            state.auth.user.favourites.splice(idx, 1)
            state.loading = false;
        },
        updateDashboard(state, payload) {
            state.dashboardContent = payload
        }
    },
    getters: {
        getTags(state) {
            return state.tags
        },
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
        },
        getDashboard(state) {
            return state.dashboardContent
        },
        getSearchResults(state) {
            return state.searchResults
        },
        getCurrentUsersFavourites(state: any) {
            if(state.auth.user.favourites){
                return state.auth.user.favourites
            }
            return []
        },
        updateNewFavourite(state: any, payload: Photo) {
            state.auth.user.favourites.push(payload)
        },
        getCurrentUser(state: any) {
            return state.auth.user
        },
        getAuth(state: any) {
            return state.auth.auth
        }
    },
    actions: {
        async getDashboard(store, activeTag = null) {
            let interests = localStorage.getItem('interests')
            if(interests) interests = JSON.parse(interests)
            const tags = interests
            let url
            if(activeTag){
                url ='/api/user/dashboard/'+activeTag
            } else {
                url = '/api/user/dashboard'
            }
            const {data} = await axios.post(url, {
                tags,
                username: store.getters['getCurrentUser'].username
            })
            let formatted = [] as Photo[]
            if(data.unsplash){
                data.unsplash.forEach((p:any) =>{
                    const P:Photo = UnsplashGenerator(p)
                    formatted.push(P)
                })
            }
            store.commit('updateDashboard', formatted)
            store.commit('hideLoader')
        },
        fetchTags(store) {
            axios.get('/api/tags/get').then(res => {
                store.commit('updateTags', res.data)
            })
        },
        async expandPhoto(store, {$buefy, $el}) {
            // tslint:disable-next-line
            await $buefy.modal.open({content: [$el]})
            setTimeout(() => {
                store.commit('hideLoader')
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
        likePhoto(store, {photo, username, $buefy}) {
            const lStorage = localStorage.getItem('likedPhotos')
            if (lStorage) {
                const parsed = JSON.parse(lStorage)
                parsed.push(photo)
                localStorage.setItem('likedPhotos', JSON.stringify(parsed))
            } else {
                localStorage.setItem('likedPhotos', '[' + JSON.stringify(photo) + ']')
            }
            // @ts-ignore
            if (store.state.auth.auth) {
                axios.post('/api/user/favourite', {username, photo}).then(res => {
                    if (res.data.code == 200) {
                        store.commit('pushNewFav', photo)
                        $buefy.toast.open({
                            message: "Liked!",
                            type: "is-success"
                        })
                    } else {
                        $buefy.toast.open({
                            message: "There was en error. Please try again.",
                            type: "is-warning"
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        dislikePhoto(store, {photo, $buefy, username}) {
            const lStorage$ = localStorage.getItem('likedPhotos')
            if (lStorage$) {
                const lStorage = JSON.parse(lStorage$)
                if (lStorage !== null) {
                    const foundItem = lStorage.findIndex((i: Photo) => i.url == photo.url)
                    lStorage.splice(foundItem, 1)
                    localStorage.setItem('likedPhotos', JSON.stringify(lStorage))
                    store.dispatch('loadFavourites')
                }
            }
            // @ts-ignore
            if (store.state.auth.auth) {
                axios.post('/api/user/unfav', {username, photo}).then(res => {
                    if (res.data.code == 200) {
                        store.commit('removeFav', photo)
                        $buefy.toast.open({
                            message: "Removed!",
                            type: "is-success"
                        })
                    } else {
                        $buefy.toast.open({
                            message: "There was en error. Please try again.",
                            type: "is-warning"
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        async getRandomPexels(state, $buefy) {
            state.commit('showLoader')
            try {
                const {data, headers} = await axios.get('/api/photos/pexels/random')
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
        async getCuratedPexels(state, $buefy) {
            state.commit('showLoader')
            try {
                const {data} = await axios.get('/api/photos/pexels/curated')
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
        async searchOnAllPlatforms(state, {word, page, perPage, $buefy}) {
            state.commit('showLoader')
            let modelledFlickrPhotos: Photo[] = []
            const modelledUnsplashPhotos: Photo[] = []
            let modelledPexelsPhotos: Photo[] = []
            try {
                const {data} = await axios.get(`/api/search/photos/${word}/${page}/${perPage}`)
                const {flickr, pexels, pexies, unsplash} = data
                state.commit('updatePages', {pageName: 'flickrSearchResultTotal', count: parseInt(flickr.total)})
                state.commit('updatePages', {
                    pageName: 'pexelsSearchResultTotal',
                    count: parseInt(pexels.total_results)
                })
                state.commit('updatePages', {pageName: 'unsplashSearchResultTotal', count: parseInt(unsplash.total)})
                if (flickr.photo && flickr.photo.length > 0) {
                    modelledFlickrPhotos = FlickrFormatter(flickr, word)
                }
                if (unsplash.results && unsplash.results.length > 0) {
                    unsplash.results.forEach((p: any) => {
                        const formattedPhoto: Photo = UnsplashGenerator(p, word)
                        modelledUnsplashPhotos.push(formattedPhoto)
                    })
                }
                if (pexels.photos && pexels.photos.length > 0) {
                    modelledPexelsPhotos = pexels.photos
                }
                const SearchResults = {
                    flickr: modelledFlickrPhotos,
                    unsplash: modelledUnsplashPhotos,
                    pexels: modelledPexelsPhotos,
                    pexies: pexies
                }
                state.commit('updateSearchResults', SearchResults)
                state.commit('hideLoader')
            } catch (e) {
                state.commit('hideLoader')
                $buefy.toast.open({
                    message: 'Can\'t reach api.',
                    type: 'is-danger'
                })
            }
        },
        async searchNewPage(state, {word, page, perPage, $buefy, platform}) {
            const {data} = await axios.get(`/api/search/photos/${word}/${page}/${perPage}/${platform}`)
            if (data && data.error) {
                $buefy.toast.open({
                    message: "Error while loading new photos, please try again.",
                    type: "is-danger"
                })
                return
            }
            if (platform == 'pexels') {
                if (data.photos) {
                    state.commit('pushNewPage', {platform, photos: data.photos})
                }
            } else if (platform == 'unsplash') {
                if (!data.results) return
                const formatted: Photo[] = []
                data.results.forEach((p: any) => {
                    const formattedPhoto: Photo = UnsplashGenerator(p, word)
                    formatted.push(formattedPhoto)
                })
                state.commit('pushNewPage', {platform, photos: formatted})
            } else if (platform == 'flickr') {
                const formatted: Photo[] = FlickrFormatter(data, word)
                state.commit("pushNewPage", {platform, photos: formatted})
            } else if (platform == 'pexies') {
                state.commit('pushNewPage', {platform, photos: data.photos})
            }
        }
    },
})
