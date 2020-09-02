<template>
  <div class="curated">
    <div class="title">
      <h1 :style="{'color' : !nm ? '#333' : '#ddd'}">Curated</h1>
      <p style="font-size: 12px; opacity: 0.75; margin-top: 5px">Explore new content from Pexels curated list.</p>
    </div>
    <Photos :pageStart="pagination.current*perPage-perPage" :pageEnd="pagination.current*perPage" name="curated"/>
    <div v-if="getTotal>0" class="bottom-bar" :class="nm ? 'bg-dark' : ''"
         :style="{'color' : !nm ? '#333!important' : '#ddd!important'}">
      <transition v-if="getTotal>0" tag="div" name="fade" mode="out-in">
          <b-pagination
              :class="nm ? 'bg-dark' : ''" :style="{'color' : !nm ? '#333!important' : '#ddd!important'}"
              type="is-warning"
              order="is-centered"
              icon-pack="fa"
              v-model="pagination.current"
              :total="getTotal"
              :range-before="pagination.rangeBefore"
              :range-after="pagination.rangeAfter"
              :per-page="perPage"
              @change="pageChange($event)"
          >
          </b-pagination>
      </transition>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import Photos from '@/components/Photos.vue'

export default {
  name: 'Curated',
  data() {
    return {
      loaded: false,
      perPage:20,
      pagination: {
        name: "pexiesRandom",
        current: 1,
        rangeBefore: 2,
        rangeAfter: 2,
        prevIcon: 'chevron-left',
        nextIcon: 'chevron-right'
      },
    }
  },
  components: {
    Photos
  },
  methods: {
    pageChange(i) {
      this.pagination.current = i
    }
  },
  computed: {
    getTotal() {
      return this.$store.getters.getCuratedPhotos.length
    },
    nm() {
      return this.$store.getters.getNightMode
    }
  },
}
</script>

<style lang="stylus">
.pagination-link
  background-color: rgba(#ffc200, 0.7) !important

.is-current
  background-color #ffc200 !important
  border-color #ffc200 !important
</style>
