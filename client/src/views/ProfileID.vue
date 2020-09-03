<template>
  <div :class="darkMode ? 'bg-dark' : ''" class="profile_page box" v-if="user && user.username">
    <div class="profile_header" style="position: relative"
         :style="`background-image: url(${user.preferences.profile_cover})`">

      <div class="profile_picture">
        <div v-if="$store.state.PPloading" class="pp_loader">
          <QSpinnerInfinity style="color: hotpink"></QSpinnerInfinity>
        </div>
        <img class="profile_picture_img" :alt="user.username"
             :src="user.preferences.profile_picture">
      </div>
      <div class="profile_props">
        <p class="my-2 text-bold profile_name" style="font-size: 16px; display: inline-block; cursor: default">
          {{ user.username }}</p>
        <ul class="profile_stats">
          <li class="stat_box">
            <div class="stat text-bold">
              <i style="color: deeppink" class="fas fa-heart"></i>
              <span class="mt-1">{{ user.favourites.length }}</span>
            </div>
            <br>
          </li>
          <li class="stat_box">
            <div type="is-primary" class="stat text-bold">
              <i style="color: deeppink" class="fas fa-users"></i>
              <span class="mt-1">{{ user.followers.length }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="profile_content">
      <b-tabs type="is-toggle is-warning" expanded>
        <b-tab-item label="Favourites" icon-pack="fa" icon="heart">
          <Photos name="profileID" :userPhotos="user.favourites"></Photos>
        </b-tab-item>
        <b-tab-item label="Followers" icon-pack="fa" icon="users">
          <p style="text-align: center; width: 50%; margin: 0 auto">This feature is not available right now. Come back soon:)</p>
        </b-tab-item>
        <b-tab-item label="Following" icon-pack="fa" icon="user">
          <p style="text-align: center; width: 50%; margin: 0 auto">This feature is not available right now. Come back soon:)</p>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import Photos from "@/components/Photos";
import Axios from 'axios'

export default {
  name: "Profile",
  components: {
    Photos,
  },
  data() {
    return {
      user: null
    }
  },
  computed: {
    notBusy() {
      return this.$store.state.PPloading
    },
    darkMode() {
      return this.$store.getters['getNightMode']
    }
  },
  async created() {
    const id = this.$route.params.username
    if (id) {
      const { data } = await Axios.get(`/api/user/getbyusername/${id}`)
      this.user = data
      console.log(data)
      this.$store.commit('hideLoader')
    }
  }
}
</script>

<style lang="stylus">

flex_column()
  display flex
  align-items center
  justify-content center
  flex-direction column

.profile_page
  padding 0
  width 80vw
  margin 0 auto
  flex_column()

  .profile_header
    width calc(100% - 1px)
    background-position center
    background-size cover
    background-repeat no-repeat
    padding 10px
    transition 150ms ease
    border-bottom-left-radius 0!important
    border-bottom-right-radius 0!important
    flex_column()

    #cover_add
      transition 150ms ease-in-out
      z-index 9999


      #cover_add {
        opacity 1 !important
        transform scale(1.1)
      }

    .profile_picture
      width 200px
      height 200px
      margin 0 auto
      border-radius 50%
      overflow hidden
      padding 0
      position relative
      transition 200ms ease-in-out

      &:hover
        filter grayscale(80%)

        span
          opacity 1 !important;

      .profile_picture_img
        width 200px
        height 200px

  .profile_props
    width: 100%;

    .profile_stats
      display flex
      width 80%
      align-items flex-start
      justify-content center
      margin 0 auto

.stat_box
  cursor pointer
  margin-left 10px
  width 70px
  height 50px

  &:first-child
    margin-left 0

  span
    font-size 14px

.profile_name
  padding 3px 6px
  background #333
  border-radius 3px
  margin-top 5px
  color #ddd

.stat
  background rgba(#333, 0.75)
  border-radius 6px
  color white
  padding 5px 10px
  max-height 58px
  flex_column()

.profile_content
  width 100%

.pp_loader
  position absolute
  top 0
  left 0
  background rgba(#555, 0.7)
  display flex
  align-items center
  justify-content center
  width 100%
  height 100%
  z-index 9999
  pointer-events none

@media screen and (max-width: 768px)
  .profile_page
    width 100%

</style>
