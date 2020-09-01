<template>
  <div class="favourites">
    <div class="title">
      <h1 :style="{'color' : !nm ? '#333' : '#ddd'}">Favourites</h1>
      <div :style="!nm ? '' : 'background-color: #333; border: 1px solid #555'"  v-if="$store.getters.getAuth" @click="syncFavs()" class="sync bg-warning mt-2">
        <QSpinnerInfinity style="font-size: 21px; color: #444!important;"></QSpinnerInfinity>
      </div>
      <p v-if="!$store.getters.getAuth" style="width: 50%; font-size: 12px; margin: 5px auto; font-weight: 400; opacity: 0.75">Hello guest. Login to sync your favourites to your account.</p>
      <div :style="!nm ? '' : 'background-color: #444; border: 1px solid #555'"  v-if="!$store.getters.getAuth" class="sync bg-warning">
        <QSpinnerInfinity style="font-size: 21px; color: #333!important; opacity: 60%"></QSpinnerInfinity>
      </div>
    </div>
    <Photos :name="$store.getters.getAuth ? 'user' : 'guest'"/>
    <div class="error_secondary" v-if="loaded && favourites == 0">
      <b-message type="is-warning">
        You didn't save any pictures, yet.
      </b-message>
      <b-button type="is-warning" @click="$router.push('/')">Show me some!</b-button>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import Photos from '@/components/Photos.vue'
import {QSpinnerInfinity} from 'quasar'

export default {
  name: 'Favourites',
  data(){
    return {
      loaded: false
    }
  },
  computed: {
    favourites() {
      const i = this.$store.getters.getFavourites
      return i.length
    },
    nm() {
      return this.$store.getters.getNightMode
    }
  },
  methods:{
    syncFavs(){
      this.$store.dispatch('syncFavs', {$buefy: this.$buefy})
    }
  },
  components: {
    Photos,
    QSpinnerInfinity
  }
}
</script>

<style lang="stylus">
.error_message
  width 50%
  margin 25px auto
.sync
  width 40px
  height 40px
  margin 0 auto
  display: flex!important
  align-items center
  justify-content center
  flex-direction column
  text-align center
  background-color #ffc200
  padding 3px
  border-radius 50%
  cursor pointer
  *
    color #333
    box-shadow 0 -4 6px rgba(0,0,0,0.2)

</style>
