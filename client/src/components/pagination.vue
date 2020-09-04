<template>
  <transition v-if="getTotal>0 && pagination && perPage" tag="div" name="fade" mode="out-in">
    <b-pagination
        :style="{'color' : !nm ? '#222!important' : '#333!important'}"
        type="is-warning"
        v-model="curr"
        order="is-centered"
        icon-pack="fa"
        :total="getTotal"
        :range-before="pagination.rangeBefore"
        :range-after="pagination.rangeAfter"
        :per-page="perPage"
        @change="pageChange($event)"
    >
    </b-pagination>
  </transition>
</template>

<script>
export default {
name: "pagination",
  props: ["perPage", "pagination", "user"],
  data(){
  return{
    curr:1
  }
  },
  methods:{
    pageChange(e){
      this.$emit('pageChange', e)
    }
  },
  computed:{
    getTotal() {
      console.log(this.pagination.name)
      if(!this.pagination) return 0
      if(this.pagination.name == "pexiesRandom") return this.$store.getters.getRandomPhotos.length
      if(this.pagination.name == "curated") return this.$store.getters.getCuratedPhotos.length
      if(this.pagination.name == "userFav") return this.$store.getters.getCurrentUsersFavourites.length
      if(this.pagination.name == "localFav") return this.$store.getters.getFavourites.length
      if(this.pagination.name == "profileID") {
        if(this.user && this.user.favourites){
          return this.user.favourites.length
        } else return 0
      }
      return 0
    },
    nm() {
      return this.$store.getters.getNightMode
    }
  }
}
</script>

<style lang="stylus">
.pagination-link
  background-color rgba(#ffc200, 0.7) !important

.is-current
  background-color #ffc200 !important
  border-color #ffc200 !important
</style>
