<template>
  <div v-show="!$store.state.transition" id="intersection" class="photos">
    <div style="display:flex;
         flex-wrap:wrap; align-items:center;
         justify-content:center;
         height: 100%; width: 100%">
      <div
          class="photo"
          style="width: 200px; height: 200px; transition: 300ms!important"
          :style="{ opacity: i<perPage ? 1 : 0}"
          :class="[!lightMode ? 'light' : 'dark_shadows', i<perPage ? '' : 'intersect', !isPhotoLikeable(photo) ? 'disable_grayscale' : '']"
          v-for="(photo, i) in photos" :key="i+''+Math.random()"
      >
        <lazy-component style="height: 100%; width: 100%; z-index: 1;">
            <img style="width: 100%; height: 100%;object-fit: cover;"
                 :src="photo.src.medium ? photo.src.medium : photo.src.small">
        </lazy-component>
        <div style="z-index: 2; background: transparent">
          <Photo @like="callbackFunc()" :photo="photo"></Photo>
        </div>
      </div>
    </div>
    <b-message style="animation-duration: 100ms" key="message" class="my-2"
               v-if="photos && photos.length == 0 || !photos"
               type="is-danger">There is nothing here...
    </b-message>
  </div>
</template>

<script>
import Photo from "@/components/Photo.vue";

export default {
  props: ["name", "userPhotos", "pageStart", "pageEnd"],
  data() {
    return {
      offsetTop: 0,
      currentPage: 1,
      total: null,
      loaded: false,
    }
  },
  watch: {
    photos() {
      this.callbackFunc()
    },
    offsetTop(cur) {
      this.callbackFunc()
    }
  },
  components: {Photo},
  computed: {
    likedImgs() {
      const i = localStorage.getItem('likedPhotos')
      const a = this.$store.getters.getCurrentUsersFavourites
      if ((!a) && i) {
        return JSON.parse(i)
      }
      const parsed = JSON.parse(i)
      if (a && i) {
        return [...parsed, ...a]
      }
      console.log(a, i)
      return []
    },
    perPage() {
      if (window.innerWidth >= 1920) return 24
      if (window.innerWidth >= 1440) return 16
      if (window.innerWidth >= 1280) return 12
      if (window.innerWidth >= 768) return 12
      return 8
    },
    lightMode() {
      return this.$store.getters['getNightMode']
    },
    photos() {
      if (this.$props.name == 'curated') {
        console.log(this.pageStart, this.pageEnd)
        return this.$store.getters.getCuratedPhotos.slice(this.pageStart, this.pageEnd)
      }
      if (this.$props.name == 'random') {
        return this.$store.getters.getRandomPhotos
      }
      if (this.$props.name == 'user') {
        const userFavs = this.$store.getters.getCurrentUsersFavourites.slice(this.pageStart, this.pageEnd)
        if (userFavs) {
          return userFavs
        }
        return []
      }
      if (this.$props.name == 'guest') {
        const guestFavs = this.$store.getters.getFavourites.slice(this.pageStart, this.pageEnd)
        if (guestFavs) {
          return guestFavs
        }
        return []
      }
      if (this.$props.name == 'search') {
        return this.$store.getters.getSearchResults
      }
      if (this.$props.name == 'profile') {
        const usersFav = this.$store.getters.getCurrentUsersFavourites.slice(this.pageStart, this.pageEnd)
        return usersFav
      }
      if (this.$props.name == 'profileID') {
        const usersFav = this.$props.userPhotos.slice(this.pageStart, this.pageEnd)
        return usersFav
      }
      if(this.$props.name == 'dashboard'){
        return this.$store.getters.getDashboard.slice(this.pageStart,this.pageEnd)
      }

      return []
    }
  },
  methods: {
    isPhotoLikeable(p) {
      if(!this.likedImgs){
        return true
      }
      const likedImgs = this.likedImgs.slice()
      if(likedImgs.length ===0){
        return true
      }
      const exists = likedImgs.find((val) => {
        return val.url == p.url
      })
      if (exists) {
        return false
      }
      return true
    },
    onScroll(e) {
      console.log('scrolling')
      const item = document.getElementById('intersection')
      this.offsetTop = item.scrollTop
    },
    isElementInViewport(el) {
      const item = document.getElementById('intersection')
      const rect = el.getBoundingClientRect();
      return (
          rect.top >= -100 &&
          rect.bottom <= (item.innerHeight || item.clientHeight) + 400
      );
    },
    callbackFunc() {
      const items = document.querySelectorAll(".intersect");
      for (let i = 0; i < items.length; i++) {
        if (this.isElementInViewport(items[i])) {
          items[i].classList.add("in-view");
          items[i].classList.add("animation_enter");
          items[i].classList.remove("animation_enter");
        } else {
          items[i].classList.remove("in-view");
          items[i].classList.remove("animation_enter");
        }
      }
    },
  },
  async mounted() {
    const self = this;
    const item = document.getElementById('intersection')
    item.addEventListener('scroll', this.onScroll);
    this.$store.commit('showLoader')
    switch (this.$props.name) {
      case "curated":
        this.$store.dispatch('getCuratedPexels', this.$buefy)
        break;
      case "random":
        setTimeout(() => {
          if (self) {
            self.$store.dispatch('getRandomPexels', this.$buefy)
          }
        }, 300)
        break;
      case "user":
        break;
      case "guest":
        this.$store.dispatch('loadFavourites', this.$buefy)
        break;
    }
    this.callbackFunc()
    setTimeout(() => {
      if (self) {
        self.loaded = true
      }
    }, 2000)
  },
  destroyed() {
    const item = document.getElementById('intersection')
    item.removeEventListener('scroll', this.onScroll);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.photos
  display flex
  align-items center
  justify-content center
  flex-wrap wrap
  padding-bottom 50px
  overflow-y scroll
  max-height 75vh
  will-change: scroll-position

  .media-content
    color #333 !important


.in-view {
  transition 300ms ease-in-out!important
  opacity: 1 !important;
}

.animation_enter
  animation: scale .5s ease forwards !important;

.not-in-view {
  opacity: 0 !important;
}

.scale-enter-active, .scale-leave-active {
  transition: opacity 0.3s, cubic-bezier(0.215, 0.61, 0.355, 1)
}

.scale-enter, .scale-leave, .scale-leave-to {
  opacity: 0;
  transform: scale3d(0, 0, 1)
}
.photo{
  overflow hidden
}
@keyframes scale {
  0% {
    transition: all 200ms, opacity 0.2s, transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)
    opacity: 0;
    transform: scale3d(0, 0, 1)
  }
  100% {
    transform none
    opacity 1
  }
}



</style>
