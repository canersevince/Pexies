<template>
  <div class="photo_link_wrapper" v-if="propCopy">
    <b-tag type="is-primary" class="photographer">
      <a target="_blank" v-if="propCopy.photographer_url" style="color: white" :href="propCopy.photographer_url">
        {{
          propCopy.photographer && propCopy.photographer.length > 15 ? propCopy.photographer.substring(0, 15) + '...' :
              propCopy.photographer + 'unknown'
        }}
      </a>
    </b-tag>
    <transition-group tag="div" name="fade" mode="out-in" class="like_button">
            <span :key="'like'" v-show="isPhotoLikeable(propCopy) && path !== '/favourites'" @click="like(propCopy)">
                <i class="fa fa-heart btn_icon"></i>
            </span>
      <span :key="'dislike'" v-show="!isPhotoLikeable(propCopy)" @click="dislike(propCopy)">
                <i class="fa fa-times btn_icon"></i>
            </span>
    </transition-group>
    <span @click="expand" class="expand_button">
            <i class="fa fa-expand btn_icon"></i>
        </span>
    <span @click="visit" class="visit_button">
            <i class="fa fa-search btn_icon"></i>
        </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Photo} from "@/models/photo";

export default Vue.extend({
  props: ['photo'],
  data() {
    return {
      propCopy: <Photo>{}
    }
  },
  created() {
    this.propCopy = JSON.parse(JSON.stringify(this.photo))
    this.$emit('like')
  },
  mounted(){
    this.$emit('like')
  },
  methods: {
    expand(event: Event) {
      this.$store.commit('showLoader')
      var img = document.createElement('img')
      img.src = this.propCopy.src.original
      img.onload = function (e: any) {
        if (e.path && e.path[0]) {
          const aspect$ = e.path[0].naturalWidth / e.path[0].naturalHeight
          send(aspect$)
        }
      }
      const self = this;

      function send(aspectRatio: number) {
        let className;
        if (aspectRatio < 0.5) {
          className = "4by3"
        } else {
          className = "16by9"
        }
        const h = self.$createElement
        const vnode = h('p', {class: `image modal_image is-${className}`}, [
          h('img', {attrs: {src: self.propCopy.src.original}})
        ])
        self.$store.dispatch('expandPhoto', {$el: vnode, $buefy: self.$buefy})
      }

    },
    visit() {
      window.open(this.propCopy.url, '_blank')
    },
    like(photo: Photo) {
      if (!this.isPhotoLikeable(photo)) {
        this.$buefy.toast.open({
          message: "You already liked this photo.",
          type: "is-danger"
        })
        return
      }
      this.propCopy.liked = true
      this.$store.dispatch('likePhoto', {photo, username: this.$store.state.auth.user.username, $buefy: this.$buefy})
      this.$emit('like')

    },
    dislike(photo: any) {
      const username = this.$store.getters.getCurrentUser.username
      this.$store.dispatch('dislikePhoto', {photo, username, $buefy:this.$buefy})
      this.$emit('like')
    },
    isPhotoLikeable(p: Photo) {
      const exists = this.likedImgs.find((val: Photo) => {
        return val.url == p.url
      })
      if (exists) {
        return false
      }
      return true
    }
  },

  computed: {
    path() {
      return this.$route.path
    },
    likedImgs() {
      const i = localStorage.getItem('likedPhotos')
      const a = this.$store.getters.getCurrentUsersFavourites
      if (!a && i) return JSON.parse(i)
      if (i && a) return [...JSON.parse(i), ...a]
      return []
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.photo
  filter grayscale(90%)
  position relative
  background-size cover
  background-position center
  background-repeat no-repeat
  transition 300ms
  display flex
  align-items center
  justify-content center
  align-content center
  box-shadow 0 12px 20px #bebebe, -6px -12px 20px rgba(#cdcdcd, 0.4);
  border-radius 30px
  margin 2%
  cursor pointer

.photo:hover
  filter grayscale(0)!important
  transform scale(1.1)!important
  box-shadow 10px 12px 20px #bebebe, -10px -12px 20px rgba(#ccc, 0.3)!important;

.photo_link_wrapper
  width: 100%
  height 100%
  background transparent
  position absolute
  top 0
  left 0

.photographer
  position absolute
  top 10px
  right 10px

.like_button, .visit_button, .expand_button
  z-index 999
  transition 200ms ease
  padding 4px
  border-radius 4px
  background rgba(0, 0, 0, 0.5)
  position absolute
  left 10px
  bottom 10px
  height 32px
  width 32px
  text-align center
  overflow hidden

.visit_button
  left unset
  bottom 10px
  right 10px

.expand_button
  left unset
  margin 0 auto
  right: calc(50% - 16px)

.not_likable {
  color #555
}

.like_button:hover > *
  transform scale(1.08)

.modal_image {
  width 100%
  height auto
}

.btn_icon
  color pink

  &:hover
    transform scale(1.05)!important
    color hotpink!important

@media screen and (max-width: 425px)
  .photo
    width 150px
    height 150px

.is-16by9, .is-4by3
  text-align center

.is-16by9 > img
  height 100% !important
  width auto !important
  margin 0 auto

.disable_grayscale
  filter none !important

</style>
