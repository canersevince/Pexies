<template>
  <div id="app" :class="darkMode ? 'bg-dark' : ''">
    <GoToTop></GoToTop>
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
        <router-link v-show="!auth" class="router-link" to="/" tag="a"><i class="fas fa-home link"></i></router-link>

        <span v-show="!auth" class="mx-1">|</span>

        <router-link v-show="auth" class="router-link" to="/Dashboard" tag="a"><i class="fas fa-columns link"></i>
        </router-link>


        <span v-show="auth" class="mx-1">|</span>

        <router-link class="router-link" to="/randomizer" tag="a"><i class="fas fa-dice-six link"></i></router-link>

        <span class="mx-1">|</span>

        <router-link class="router-link" to="/curated" tag="a"><i class="fas fa-heart link"></i></router-link>

        <span class="mx-1">|</span>

        <router-link class="router-link" to="/favourites" tag="a"><i class="fas fa-thumbs-up link"></i></router-link>

        <span class="mx-1">|</span>

        <router-link class="router-link" to="/search" tag="a"><i class="fas fa-search link"></i></router-link>

        <span class="mx-1" v-if="auth">|</span>

        <router-link to="/profile" tag="a" v-if="auth == true"><i class="fa fa-user link"></i></router-link>
        <span key="a" class="mx-1">|</span>
        <span key="a2" v-if="auth == true" @click="logout()"><i class="fas fa-door-open link"></i></span>
        <span key="a4" v-if="auth == false" @click="showSignup"><i class="fas fa-key link"></i></span>
        <span key="a5" v-if="auth == false" class="mx-1">|</span>
        <span key="a6" v-if="auth == false" @click="showLogin" @close="showLogin($event)"><i class="fas fa-user-plus link"></i></span></div>
    </div>
    <b-modal
        v-model="isSignupModalActive"
        has-modal-card
        trap-focus
        :destroy-on-hide="false"
        aria-role="dialog"
        aria-modal>
      <template #default="props">
        <Signup :showLogin="showSignup" @close="props.close"></Signup>
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
    <transition v-if="isAppAvabilable" class="animation_router" name="fade" style="animation-duration: 0.1s"
                mode="out-in">
      <router-view style="overflow-x: hidden" appear :key="path"/>
    </transition>
  </div>
</template>

<script>
import {QSpinnerIos} from 'quasar'
import Signup from "@/components/Signup";
import * as Cookie from 'js-cookie'
import Login from "@/components/Login";
import GoToTop from "@/components/GoToTop";

export default {
  components: {
    QSpinnerIos,
    Signup,
    Login,
    GoToTop
  },
  data() {
    return {
      loaded: false,
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
    showLogin(newUser = null) {
      this.isLoginModalActive = true;
      if (newUser) {
        this.newUser = newUser
      }
    },
    logout() {
      this.$store.dispatch('logout')
    }
  },
  watch: {
    nm(a) {
      this.$store.commit('isAppAvailable', false)
      this.$store.commit('showLoader')
      const favicon = document.getElementById("favicon");
      this.$store.commit('switchNightMode', a)
      if (a == true) {
        document.body.classList.add('bg-dark')
        favicon.href = favicon.href.toString().includes('pink') ? favicon.href.toString().replace('faviconpink', 'favicon') : favicon.href
      } else {
        document.body.classList.remove('bg-dark')
        favicon.href = !favicon.href.toString().includes('pink') ? favicon.href.toString().replace('favicon', 'faviconpink') : favicon.href
      }
      this.$store.commit('hideLoader')
      this.$store.commit('isAppAvailable', true)
    }
  },
  computed: {
    path(){
      return this.$router.path
    },
    auth() {
      return this.$store.getters.getAuth
    },
    isAppAvabilable() {
      return this.$store.state.isAppAvailable$
    },
    darkMode() {
      return this.$store.getters['getNightMode']
    }
  },
  async mounted() {
    this.$store.dispatch('fetchTags')
    this.$store.commit('showLoader')
    const nmCookie = Cookie.get('nm')
    if (nmCookie && this.$store.getters.getNightMode == null) {
      const nm = JSON.parse(nmCookie)
      this.nm = nm
      this.$store.commit('switchNightMode', nm)
      const favicon = document.getElementById("favicon");
      if (nm === true) {
        document.body.classList.add('bg-dark')
        favicon.href = favicon.href.toString().includes('pink') ? favicon.href.toString().replace('faviconpink', 'favicon') : favicon.href
      } else {
        document.body.classList.remove('bg-dark')
        favicon.href = !favicon.href.toString().includes('pink') ? favicon.href.toString().replace('favicon', 'faviconpink') : favicon.href
      }
    }
    this.$store.commit('hideLoader')
    this.$store.commit('isAppAvailable', true)
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
  transition 200ms ease-in
  background #333 !important
  color #ccc !important

  * {
    color #ccc !important
  }

  .field .control input {
    color #333 !important
  }

.dark_shadows
  box-shadow 0 6px 10px #222, -6px -6px 12px #111 !important;

.dark_shadows:hover
  box-shadow 10px 6px 12px #222, -6px -6px 12px #111 !important;

.tabs.is-toggle li.is-active a
  background-color #ffc200 !important
  border-color #ffc200 !important
  color #333 !important

.tabs.is-toggle li.is-active a *
  color #333 !important

.tabs.is-toggle li:first-child a
  border-top-left-radius 0 !important

.tabs.is-toggle li:last-child a
  border-top-right-radius 0 !important

.message-body .media .media-content
  color #333 !important

.tabs.is-toggle a:hover
  background-color rgba(#ffc200, 0.7) !important
  color #444 !important

.avatar-cropper-btn:hover
  background-color rgba(#ffc200, 0.7) !important

.scale-enter-active, .scale-leave-active {
  transition: opacity 0.3s, transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)
}

.scale-enter, .scale-leave, .scale-leave-to {
  opacity: 0;
  transform: scale3d(0, 0, 1)
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #ffc200;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #ffc500;
}

.animation_router > * {
  animation-duration 0.2s !important
}

.sharer
  position absolute
  right 15px
  bottom 20px
  *
    color #ddd


@media screen and (max-width: 1920px) {
  .photos {
    max-height 70vh
  }
}

@media screen and (max-width: 1280px) {
  .photos {
    max-height 63vh !important
  }
}

@media screen and (max-width: 768px) {
  .photos {
    max-height 60vh !important
  }
}

@media screen and (max-width: 425px) {
  .tags {
    display flex
    align-items center
    justify-content center
    width 80%
    margin 0 auto
  }

  .columns {
    display flex
    align-items center
    justify-content center
    flex-direction column-reverse
  }

  .cover_add {
    top auto !important
  }

  .nightMode {
    z-index: 9999;
    position: fixed;
    bottom: 25px;
    left: -65px;
    transform: rotate(-90deg) scale(.6);
    transform-origin: top;
  }

  .photo {
    width 140px !important
    height 140px !important
  }

  .tag span a {
    font-size 10px
  }
}

.tag.is-warning > span {
  color #333 !important
}

.modal_image
  z-index 99999
</style>
