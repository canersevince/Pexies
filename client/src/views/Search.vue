<template>
  <div class="search pb-5">
    <div class="title">
      <h1 :style="{'color' : !nm ? '#333' : '#ddd'}">Search</h1>
      <div class="search-box">
        <b-field>
          <b-autocomplete
              @keypress.native.enter="search()"
              v-model="searchWord"
              placeholder="Search photos across Pexels, Unsplash, Flickr and more..."
              :data="getTags"
              icon-pack="fas"
              icon="search"
              clearable
              @select="val => search(val)">
            <template slot="empty">No results found</template>
          </b-autocomplete>
        </b-field>
      </div>
    </div>
    <div class="search_results">
      <b-tabs v-model="currentTab" type="is-toggle is-warning" expanded>
        <b-tab-item label="Pexies" icon-pack="fas" icon="picture">
          <template slot="header">
            <span><img width="16" style="width: 16px;margin-right:0.5em" src="/favicon.png" alt="pexies"></span>
            <span>Pexies</span>
          </template>
          <SearchResults
              :pageStart="(paginationOptions[0].current*paginationOptions[0].perPage)"
              :pageEnd="paginationOptions[0].current*paginationOptions[0]+paginationOptions[0].perPage"
              :platform="'pexies'"
          />
        </b-tab-item>
        <b-tab-item label="Flickr" icon-pack="fab" icon="flickr">
          <SearchResults
              :pageStart="(paginationOptions[1].current*paginationOptions[1].perPage)"
              :pageEnd="paginationOptions[1].current*paginationOptions[1]+paginationOptions[1].perPage"
              :platform="'flickr'"
          />
        </b-tab-item>
        <b-tab-item label="Pexels" icon-pack="fab" icon="pexels">
          <SearchResults
              :pageStart="(paginationOptions[2].current*paginationOptions[2].perPage)"
              :pageEnd="paginationOptions[2].current*paginationOptions[2].perPage+paginationOptions[2].perPage"
              :platform="'pexels'"
          />
        </b-tab-item>
        <b-tab-item label="Unsplash" icon-pack="fab" icon="unsplash">
          <SearchResults
              :pageStart="(paginationOptions[3].current*paginationOptions[3].perPage)"
              :pageEnd="paginationOptions[3].current*paginationOptions[3].perPage+paginationOptions[3].perPage"
              :platform="'unsplash'"
          />
        </b-tab-item>
      </b-tabs>
    </div>
    <div v-if="$store.getters.getSearchResults" class="bottom-bar" :class="nm ? 'bg-dark' : ''"
         :style="{'color' : !nm ? '#333!important' : '#ddd!important'}">
      <transition-group tag="div" name="fade" mode="out-in">
        <div :key="i" v-for="(pagination, i) in paginationOptions">
          <b-pagination v-if="currentTab == i"
                        simple
                        :class="nm ? 'bg-dark' : ''" :style="{'color' : !nm ? '#333!important' : '#ddd!important'}"
                        type="is-warning"
                        v-model="pagination.current"
                        :total="getTotal(pagination.name)"
                        :range-before="pagination.rangeBefore"
                        :range-after="pagination.rangeAfter"
                        :per-page="perPage"
                        >
          </b-pagination>
        </div>
      </transition-group>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import SearchResults from "@/components/SearchResults";

export default {
  name: 'Search',
  data() {
    return {
      perPage: 25,
      selectedTag: "",
      currentTab: 0,
      searchWord: "",
      paginationOptions: [
        {
          name: "pexies",
          total: 0,
          current: 1,
          rangeBefore: 5,
          rangeAfter: 5,
        },
        {
          name: "flickr",
          total: 0,
          current: 1,
          rangeBefore: 5,
          rangeAfter: 5,
        },
        {
          name: "pexels",
          total: 0,
          current: 1,
          rangeBefore: 5,
          rangeAfter: 5,
        },
        {
          name: "unsplash",
          total: 0,
          current: 1,
          rangeBefore: 5,
          rangeAfter: 5,
        }
      ]
    }
  },
  components: {
    SearchResults,
  },
  computed: {
    getTags() {
      const tags = this.$store.getters.getTags.map(i => {
        return i.title
      })
      tags.unshift(this.searchWord)
      return tags.filter(tag => {
        return tag.toLowerCase().includes(this.searchWord.toLowerCase())
      })
    },
    nm() {
      return this.$store.getters.getNightMode
    },
  },
  methods: {
    getTotal(platform) {
      switch (platform) {
        case 'pexies':
          return this.$store.state.flickrSearchResultTotal;
        case 'pexels':
          return this.$store.state.pexelsSearchResultTotal
        case 'flickr':
          return this.$store.state.flickrSearchResultTotal;
        case 'unsplash':
          return this.$store.state.unsplashSearchResultTotal;
        default:
          return this.$store.getters.getSearchResults.pexies.length;
      }
    },
    search(val = null) {
      const searchWord = val ? val : this.searchWord
      console.log('searching...')
      if (searchWord.length > 0) {
        this.$store.dispatch('searchOnAllPlatforms', {word: searchWord, page: 1, perPage: 40, $buefy: this.$buefy})
        this.selectedTag = ""
        this.searchWord = ""
      }
    },
  },
  created() {
    this.$store.commit('hideLoader')
    if (this.getTags && this.getTags.length == 1) {
      this.$store.dispatch('fetchTags')
    }
  },
}
</script>

<style lang="stylus">
.search-box
  width 50%
  margin 10px auto;

.pagination-link
  background-color: rgba(#ffc200, 0.7) !important

.is-current
  background-color #ffc200 !important
  border-color #ffc200 !important

.search_results
  width: 90%;
  margin 0 auto
</style>
