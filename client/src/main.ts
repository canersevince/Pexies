import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Buefy from 'buefy'
import 'buefy/dist/buefy.min.css'
import VueLazyload from "vue-lazyload";
Vue.use(Buefy)
Vue.use(VueLazyload,{
    preLoad: 1.3,
    error: '/error.png',
    loading: '/loading.gif',
    attempt: 1,
    lazyComponent: true
})
Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
