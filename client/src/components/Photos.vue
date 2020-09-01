<template>
  <div id="intersection" class="photos">
    <div style="display:flex;
         flex-wrap:wrap; align-items:center;
         justify-content:center;
         height: 100%; width: 100%">
      <div
          class="photo"
          style="width: 200px; height: 200px"
          :style="{backgroundImage: `url(${photo.src.medium})`, visibility : i<perPage ? '' : 'hidden', opacity: i<perPage ? 1 : 0}"
          :class="[!lightMode ? 'light' : 'dark_shadows', i<perPage ? '' : 'intersect', !isPhotoLikeable(photo) ? 'disable_grayscale' : '']"
          v-for="(photo, i) in photos" :key="i+''+Math.random()"
      >
        <div>
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
  props: ["name", "userPhotos"],
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
      if (!a) return JSON.parse(i)
      if (a && i) return [...JSON.parse(i), ...a]
      return []
    },
    perPage() {
      if (window.innerWidth >= 1920) return 21
      if (window.innerWidth >= 1440) return 15
      if (window.innerWidth >= 1280) return 10
      if (window.innerWidth >= 768) return 12
      return 4
    },
    lightMode() {
      return this.$store.getters['getNightMode']
    },
    photos() {
      if (this.$props.name == 'curated') {
        return this.$store.getters.getCuratedPhotos
      }
      if (this.$props.name == 'random') {
        return this.$store.getters.getRandomPhotos
      }
      if (this.$props.name == 'user') {
        const userFavs = this.$store.getters.getCurrentUsersFavourites
        if (userFavs) {
          return userFavs
        }
        return []
      }
      if (this.$props.name == 'guest') {
        const guestFavs = this.$store.getters.getFavourites
        if (guestFavs) {
          return guestFavs
        }
        return []
      }
      if (this.$props.name == 'search') {
        return this.$store.getters.getSearchResults
      }
      if (this.$props.name == 'profile') {
        const usersFav = this.$store.getters.getCurrentUsersFavourites
        console.log(usersFav)
        return usersFav.reverse()
      }
      if (this.$props.name == 'profileID') {
        const usersFav = this.$props.userPhotos
        return usersFav.reverse()
      }




      return []
    }
  },
  methods: {
    isPhotoLikeable(p) {
      const exists = this.likedImgs.find((val) => {
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
          rect.top >= 0 &&
          rect.bottom <= (item.innerHeight || item.clientHeight) + 300
      );
    },
    callbackFunc() {
      const items = document.querySelectorAll(".intersect");
      for (let i = 0; i < items.length; i++) {
        if (this.isElementInViewport(items[i])) {
          items[i].classList.add("in-view");
        } else {
          items[i].classList.remove("in-view");
        }
      }
    },
  },
  async mounted() {
    const item = document.getElementById('intersection')
    item.addEventListener('scroll', this.onScroll);
    switch (this.$props.name) {
      case "curated":
        this.$store.dispatch('getCuratedPexels', this.$buefy).then(res => {
          this.offsetTop = 100
          this.offsetTop = 0
        })
        break;
      case "random":
        this.$store.dispatch('getRandomPexels', this.$buefy).then(res => {
          this.offsetTop = 100
          this.offsetTop = 0
        })
        break;
      case "user":
        break;
      case "guest":
        this.$store.dispatch('loadFavourites', this.$buefy).then(res => {
          this.offsetTop = 100
          this.offsetTop = 0
        })
        break;
    }
    this.callbackFunc()
    setTimeout(() => {
      this.loaded = true
    }, 5000)
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
  visibility: visible !important;
  opacity: 1 !important;
  animation: scale .5s ease forwards !important;
}

.not-in-view {
  opacity: 0 !important;
  animation: scale .5s ease backwards !important;
}

.scale-enter-active, .scale-leave-active {
  transition: opacity 0.3s, transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1)
}

.scale-enter, .scale-leave, .scale-leave-to {
  opacity: 0;
  transform: scale3d(0, 0, 1)
}

@keyframes scale {
  0% {
    transition: opacity 0.2s, transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1), all 200ms
    opacity: 0;
    transform: scale3d(0, 0, 1)
  }
  100% {
    transform none
    opacity 1
  }
}
</style>
