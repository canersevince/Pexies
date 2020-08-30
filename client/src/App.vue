<template>
  <div id="app" :class="darkMode ? 'bg-dark' : ''">
    <div id="loader" v-if="$store.state.loading">
      <q-spinner-ios style="color: white" size="48"></q-spinner-ios>
    </div>
    <div class="nightMode">
      <b-switch
          v-model="nm"
          passive-type='is-dark'
          type='is-warning'>
        <span :style="{'color' : darkMode ? '#ddd' : '#333'}">{{ darkMode ? "Dark Mode" : "Light Mode" }}</span>
      </b-switch>
    </div>
    <div id="nav">
      <div class="routes">
        <router-link class="router-link" to="/" tag="a"><i class="fas fa-dice-six link"></i></router-link>
        <span class="mx-1">|</span>
        <router-link class="router-link" to="/curated" tag="a"><i class="fas fa-heart link"></i></router-link>
        <span class="mx-1">|</span>
        <router-link class="router-link" to="/favourites" tag="a"><i class="fas fa-thumbs-up link"></i></router-link>
        <span class="mx-1">|</span>
        <a v-if="$store.state.auth.auth == false " @click.prevent="showLogin()"><i class="fas fa-key link"></i></a>
        <span class="mx-1" v-if="$store.state.auth.auth == false">|</span>
        <a v-if="$store.state.auth.auth == false" @click.prevent="showSignup()"><i class="fa fa-user-plus link"></i></a>
        <a v-if="$store.state.auth.auth == true"><i class="fa fa-user link"></i></a>
      </div>
    </div>
    <b-modal
        v-model="isSignupModalActive"
        has-modal-card
        trap-focus
        :destroy-on-hide="false"
        aria-role="dialog"
        aria-modal>
      <template #default="props">
        <Signup :showLogin="showLogin" @close="props.close"></Signup>
      </template>
    </b-modal>
    <b-modal
        v-model="isLoginModalActive"
        has-modal-card
        trap-focus
        :destroy-on-hide="false"
        aria-role="dialog"
        aria-modal>
      <template #default="props">
        <Login :newUser="newUser" @close="props.close"></Login>
      </template>
    </b-modal>
    <transition name="fade" style="animation-duration: 0.2s" mode="out-in">
      <router-view appear :key="path"/>
    </transition>
  </div>
</template>

<script>
import {QSpinnerIos} from 'quasar'
import Signup from "@/components/Signup";
import * as Cookie from 'js-cookie'
import Login from "@/components/Login";
export default {
  components: {
    QSpinnerIos,
    Signup,
    Login
  },
  data() {
    return {
      newUser: null,
      isSignupModalActive: false,
      isLoginModalActive: false,
      nm: null
    }
  },
  methods: {
    showSignup() {
      this.isSignupModalActive = true;
    },
    showLogin(newUser=null){
      if(newUser) {
        this.newUser = newUser
      }
      this.isLoginModalActive = true;
    }
  },
  watch: {
    nm(a) {
      this.$store.commit('switchNightMode', a)
      if (a == true) {
        document.body.classList.add('bg-dark')
      } else {
        document.body.classList.remove('bg-dark')
      }
    }
  },
  computed: {
    darkMode() {
      return this.$store.getters['getNightMode']
    }
  },
  mounted() {
    const nmCookie = Cookie.get('nm')
    if (nmCookie) {
      console.log('Cookies found!')
      const nm = JSON.parse(nmCookie)
      this.nm = nm
      this.$store.commit('switchNightMode', nm)
      if (nm === true) {
        document.body.classList.add('bg-dark')
      } else {
        document.body.classList.remove('bg-dark')
      }
    }
  }
}
</script>
<style lang="stylus">
body {
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
    padding 10px
    display flex
    align-items center
    justify-content center

    .routes *
      font-size 32px
      text-decoration none
      font-weight 500
      transition 150ms ease

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

.link
  color #FFC200

.link:hover
  color pink !important
  transform scale(1.05) !important

.router-link-exact-active > svg
  color hotpink !important

.photos
  overflow-x hidden
  padding 10px 0

.title
  text-transform uppercase
  padding 4px
  font-size 18px
  font-weight 600
  font-family sans-serif
  color #333
  text-align center

.nightMode
  z-index 9999
  position: fixed;
  bottom 0
  left 5px
  transform scale(0.6)
  transform-origin center

.bg-dark
  background #333 !important
  color #ccc!important
  * {
    color #ccc!important
  }
  .field .control input {
    color #333!important
  }

.dark_shadows
  box-shadow 0 6px 10px #222, -6px -6px 12px #111 !important;

.dark_shadows:hover
  box-shadow 10px 6px 12px #222, -6px -6px 12px #111 !important;
</style>
