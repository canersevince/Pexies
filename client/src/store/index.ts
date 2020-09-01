/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import {Photo} from "../models/photo";
import { authModule } from "./auth";
import * as Cookie from 'js-cookie'
import FlickrUrlGenerator from './generators/flickr-url'
import {flickrPhoto} from '../models/flickr-photo'
import UnsplashGenerator from './generators/unsplash-img'
axios.defaults.baseURL = location.protocol + "//" + location.host
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        auth: authModule
    },
    state: {
        flickrSearchResultTotal:1,
        unsplashSearchResultTotal:1,
        pexelsSearchResultTotal:1,
        nightMode: false,
        curated: [],
        random: [],
        searchResults: {
            pexies: [],
            flickr:[],
            pexels: [],
            unsplash:[]
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
        updateFlickrPhotos(state ,payload){
            state.searchResults = payload
        },
        updateTags(state, payload){
            state.tags = payload
        },
        updateSearchResults(state, payload){
            state.searchResults.flickr = payload.flickr
            state.searchResults.pexels = payload.pexels
            state.searchResults.pexies = payload.pexies
            state.searchResults.unsplash = payload.unsplash
            console.log('search results:')
            console.log(state.searchResults)
        },
        updatePages(state:any, {pageName, count}){
            console.log(pageName, count)
            state[pageName] = count
        }
    },
    getters: {
        getTags(state){
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
        getSearchResults(state){
            return state.searchResults
        },
        getCurrentUsersFavourites(state: any){
            return state.auth.user.favourites
        },
        updateNewFavourite(state: any, payload: Photo){
            state.auth.user.favourites.push(payload)
        },
        getCurrentUser(state: any){
            return state.auth.user
        },
        getAuth(state:any){
            return state.auth.auth
        }
    },
    actions: {
        fetchTags(state){
          axios.get('/api/tags/get').then(res => {
              console.log(res.data)
              state.commit('updateTags', res.data)
          })
        },
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
            if(store.state.auth.auth){
                console.log('Favouriting...')
                axios.post('/api/user/favourite', {username, photo}).then(res => {
                    if(res.data.code == 200){
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
        dislikePhoto(state, photo) {
            const lStorage$ = localStorage.getItem('likedPhotos')
            if (lStorage$) {
                const lStorage = JSON.parse(lStorage$)
                if (lStorage !== null) {
                    const foundItem = lStorage.findIndex((i: Photo) => i.url == photo.url)
                    lStorage.splice(foundItem, 1)
                    localStorage.setItem('likedPhotos', JSON.stringify(lStorage))
                    state.dispatch('loadFavourites')
                }
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
        async searchOnAllPlatforms(state, {word, page, perPage, $buefy}){
            state.commit('showLoader')
            const modelledFlickrPhotos: Photo[] = []
            const modelledUnsplashPhotos: Photo[] = []
            let modelledPexelsPhotos: Photo[] = []

            try {
                const { data } = await axios.get(`/api/search/photos/${word}/${page}/${perPage}`)
                console.log(data)
                const { flickr, pexels, pexies, unsplash } = data
                state.commit('updatePages', {pageName: 'flickrSearchResultTotal', count: parseInt(flickr.total)})
                state.commit('updatePages', {pageName: 'pexelsSearchResultTotal', count: parseInt(pexels.total_results)})
                state.commit('updatePages', {pageName: 'unsplashSearchResultTotal', count: parseInt(unsplash.total)})
                if(flickr.photo && flickr.photo.length>0){
                    flickr.photo.forEach((p: flickrPhoto) => {
                        const newPhoto = new Photo()
                        newPhoto.liked = false
                        newPhoto.url = FlickrUrlGenerator(p, 'o')
                        // tslint:disable-next-line
                        newPhoto.photographer_url = `https://www.flickr.com/people/${p.owner}/`
                        newPhoto.photographer = p.title
                        newPhoto.src = {
                            original: FlickrUrlGenerator(p, 'b'),
                            large2x: FlickrUrlGenerator(p, 't'),
                            large: FlickrUrlGenerator(p, 't'),
                            small: FlickrUrlGenerator(p, 'n'),
                            portrait: FlickrUrlGenerator(p, 'n'),
                            landscape: FlickrUrlGenerator(p, 'c'),
                            tiny: FlickrUrlGenerator(p, 's'),
                            medium : FlickrUrlGenerator(p, 'n')
                        }
                        modelledFlickrPhotos.push(newPhoto)
                    })
                }
                if(unsplash.results && unsplash.results.length >0){
                    unsplash.results.forEach((p:any) =>{
                        const formattedPhoto:Photo = UnsplashGenerator(p)
                        modelledUnsplashPhotos.push(formattedPhoto)
                    })
                }
                if(pexels.photos && pexels.photos.length>0){
                    modelledPexelsPhotos = pexels.photos
                }
                const SearchResults = {
                    flickr: modelledFlickrPhotos,
                    unsplash:modelledUnsplashPhotos,
                    pexels: modelledPexelsPhotos,
                    pexies: []
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
        }
    },
})
