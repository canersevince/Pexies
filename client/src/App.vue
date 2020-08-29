<template>
    <div id="app">
        <div id="loader" v-if="$store.state.loading">
            <q-spinner-ios style="color: white" size="48"></q-spinner-ios>
        </div>
        <div id="nav">
            <router-link class="router-link" to="/" tag="a"><i class="fas fa-dice-six"></i></router-link>
            |
            <router-link class="router-link" to="/curated" tag="a"><i class="fas fa-heart"></i></router-link>
            |
            <router-link class="router-link" to="/favourites" tag="a"><i class="fas fa-thumbs-up"></i></router-link>
        </div>
        <transition name="fade" style="animation-duration: 0.2s" mode="out-in">
            <router-view/>
        </transition>
    </div>
</template>

<script>
    import {QSpinnerIos} from 'quasar'

    export default {
        components: {
            QSpinnerIos
        }
    }
</script>
<style lang="stylus">
    body {
        background #dfdfdf
        min-height 100vh
        width 100vw
        overflow-x hidden
    }

    #app
        font-family Avenir, Helvetica, Arial, sans-serif
        -webkit-font-smoothing antialiased
        -moz-osx-font-smoothing grayscale
        text-align center
        color #2c3e50

        #nav
            padding 20px
            *
                text-decoration none
                color #333
                font-weight 500

        #loader
            z-index 9999
            display flex
            align-items center
            justify-content center
            width 100vw
            height 100vh
            position: fixed
            top 0
            left 0
            background rgba(0, 0, 0, .8)
    #nav *
        font-size 32px
        transition 200ms ease

    .router-link:hover > *, .router-link:hover,
        color pink!important
        transform scale(1.03)!important

    .router-link-exact-active > *, .router-link-exact-active
        color hotpink

    .photos
        overflow-x hidden

    .title
        text-transform uppercase
        padding 4px
        font-size 18px
        font-weight 600
        font-family sans-serif
        color #333
        text-align center

</style>
