<template>
  <div id="intersection" class="photos">
    <transition-group tag="div" name="fade" mode="out-in" style="display:flex;
         flex-wrap:wrap; align-items:center;
         justify-content:center;
         height: 100%; width: 100%;
         animation-duration: 0.1s!important">
      <div
          class="photo"
          style="width: 200px; height: 200px; animation-duration: 0.1s!important;"
          :style="{backgroundImage: `url(${photo.src.medium})`}"
          :class="[!lightMode ? 'light' : 'dark_shadows', !isPhotoLikeable(photo) ? 'disable_grayscale' : '']"
          v-for="(photo, i) in photos" :key="i+''+Math.random()"
      >
        <div>
          <Photo :photo="photo"></Photo>
        </div>
      </div>
    </transition-group>
    <b-message style="animation-duration: 100ms" key="message" class="my-2"
               v-if="photos && photos.length == 0 || !photos && searchTriggered"
               type="is-danger">{{platform == 'pexies' ? 'This feature is not avabilable yet... Stay tuned!  ' : 'There is nothing here...'}}
    </b-message>
  </div>
</template>

<script>
import Photo from "@/components/Photo.vue";

export default {
  props: ["name", "pageStart", "pageEnd", "platform", 'searchTriggered'],
  components: {Photo},
  data() {
    return {
      loaded: false
    }
  },
  computed: {
    likedImgs() {
      const i = localStorage.getItem('likedPhotos')
      const a = this.$store.getters.getCurrentUsersFavourites
      if (!a) return JSON.parse(i)
      if (a && i) return [...JSON.parse(i), ...a]
      return []
    },
    lightMode() {
      return this.$store.getters['getNightMode']
    },
    photos() {
      if (this.$props.platform) {
        switch (this.$props.platform) {
          case 'pexies':
            return this.$store.getters.getSearchResults.pexies;
          case 'pexels':
            return this.$store.getters.getSearchResults.pexels;
          case 'unsplash':
            return this.$store.getters.getSearchResults.unsplash;
          case 'flickr':
            return this.$store.getters.getSearchResults.flickr;
          default:
            return []
        }
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
  },
  mounted() {
    setTimeout(() => {
      this.loaded = true
    }, 5000)
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.photos
  display flex
  align-items center
  justify-content center
  flex-wrap wrap

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
