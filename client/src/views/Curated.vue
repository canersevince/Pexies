<template>
  <div class="curated">
    <div class="title">
      <h1 :style="{'color' : !nm ? '#333' : '#ddd'}">Curated</h1>
      <p style="font-size: 12px; opacity: 0.75; margin-top: 5px">Explore new content from Pexels curated list.</p>
    </div>
    <Photos :pageStart="pagination.current*perPage-perPage" :pageEnd="pagination.current*perPage" name="curated"/>
    <div class="bottom-bar" :class="nm ? 'bg-dark' : ''"
         :style="{'color' : !nm ? '#333!important' : '#ddd!important'}">
          <pagination
              :class="nm ? 'bg-dark' : ''" :style="{'color' : !nm ? '#333!important' : '#ddd!important'}"
              type="is-warning"
              order="is-centered"
              icon-pack="fa"
              :pagination="pagination"
              :per-page="perPage"
              @pageChange="pageChange($event)"
          >
          </pagination>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import Photos from '@/components/Photos.vue'
import pagination from "@/components/pagination";

export default {
  name: 'Curated',
  data() {
    return {
      loaded: false,
      perPage:20,
      pagination: {
        name: "curated",
        current: 1,
        rangeBefore: 2,
        rangeAfter: 2,
        prevIcon: 'chevron-left',
        nextIcon: 'chevron-right'
      },
    }
  },
  components: {
    Photos,
    pagination
  },
  methods: {
    pageChange(i) {
      this.pagination.current = i
    }
  },
  computed: {
    nm() {
      return this.$store.getters.getNightMode
    }
  },
}
</script>

<style lang="stylus">

</style>
