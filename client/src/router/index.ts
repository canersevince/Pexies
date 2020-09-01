import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'
import Home from '../views/Home.vue'
import authMiddleware from './middleware/authMware'
import store from '../store/index'
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/Curated',
        name: 'Curated',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "favourites" */ '../views/Curated.vue')
    },
    {
        path: '/Favourites',
        name: 'Favourites',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "favourites" */ '../views/Favourites.vue')
    },
    {
        path: '/Search',
        name: 'Search',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue')
    },
    {
        path: '/Profile',
        name: 'Profile',
        meta: {
          requiresAuth : true
        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue')
    },
    {
        path: '/Profile/:username',
        name: 'ProfileID',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "profileID" */ '../views/ProfileID.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    // See if any of the matched routes has meta "requiresAuth"
    if (to.matched.some(route => route.meta.requiresAuth)) {
        // Yes this route requires authentication. See if the user is authenticated.
        if (store.getters.getAuth) {
            // User is authenticated, we allow access.
            next();
        } else {
            // User is not authenticated. We can redirect her to
            // our login page. Or wherever we want.
            next("/");
        }
    } else {
        next();
    }
});

export default router
