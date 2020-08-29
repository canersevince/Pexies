import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
axios.defaults.baseURL = "http://" + location.host
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        curated: []
    },
    mutations: {
        storeCurated(state, payload) {
            state.curated = payload
        }
    },
    getters: {
        getCuratedPhotos(state){
            return state.curated
        }
    },
    actions: {
        async getCurated(state) {
            const { data } = await axios.get('/api/photos/curated')
            console.log(data)
            state.commit('storeCurated', data)
        }
    },
    modules: {}
})
