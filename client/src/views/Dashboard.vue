<template>
  <div>
    <div class="title">
      <h1 :style="{'color' : !nm ? '#333' : '#ddd'}">Dashboard</h1>
      <p style="font-size: 12px; opacity: 0.75; margin-top: 5px">Explore new content by your interests on Pexies.</p>
    </div>
    <div class="container">
      <div class="row">
        <transition-group  tag="div" name="fadeUp" mode="out-in" class="columns">
          <div :class="{extend : !showNavbar}" key="content" class="column is-9 is-offset-1">
            <Photos :pageStart="pagination.current*perPage-perPage" :pageEnd="pagination.current*perPage" name="dashboard"></Photos>
          </div>
          <div style="transition: 300ms all"
               :style="[!showNavbar && width<500 ? 'height: 1px!important; min-height: 1px!important' : '',
               width<500 && showNavbar ? 'min-height: 30vh!important; height:30vh;': '']"
               key="tags" class="column is-3">
            <p v-if="showNavbar" style="font-size: 12px; opacity: 0.75; margin-top: 5px">Follow a tag by double clicking on it.</p>
            <DashboardTags v-if="showNavbar" @tagChange="tagChange($event)"></DashboardTags>
          </div>
        </transition-group>
      </div>
    </div>
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
import DashboardTags from "@/components/DashboardTags";
import Photos from "@/components/Photos";
export default {
  name: "Dashboard",
  components: {Photos, DashboardTags},
  data(){
    return {
      showNavbar: true,
      lastScrollPosition: 0,
      perPage:20,
      pagination: {
        name: "dashboard",
        current: 1,
        rangeBefore: 2,
        rangeAfter: 2,
        prevIcon: 'chevron-left',
        nextIcon: 'chevron-right'
      },
    }
  },
  computed:{
    nm() {
      return this.$store.getters.getNightMode
    },
    width(){
      return window.innerWidth
    }
  },
  methods:{
    onScroll () {
      const el = document.getElementById('intersection')
      const currentScrollPosition = el.scrollTop
      if (currentScrollPosition < 0) {
        return
      }
      console.log(currentScrollPosition,this.lastScrollPosition)
      if (Math.abs(currentScrollPosition - this.lastScrollPosition) < 60) {
        return
      }
      this.showNavbar = currentScrollPosition < this.lastScrollPosition
      this.lastScrollPosition = currentScrollPosition
    },
    pageChange(i) {
      this.pagination.current = i
    },
    tagChange(tag){
      this.$store.dispatch('getDashboard', tag)
    }
  },
  mounted() {
    if(window.innerWidth <500){
      document.getElementById('intersection').addEventListener('scroll', this.onScroll)
    }
    this.$store.commit('hideLoader')
  },
  beforeDestroy () {
    if(window.innerWidth <500) {
      document.getElementById('intersection').removeEventListener('scroll', this.onScroll)
    }
  }
}
</script>

<style>

.row * {
  transition: 300ms ease-in-out;
}
.extend > #intersection{
  max-height: 81vh!important;
}
</style>
