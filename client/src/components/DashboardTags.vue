<template>
  <div>
    <h6>Popular Tags</h6>
    <transition-group tag="b-taglist" name="fade" mode="out-in">
      <b-tag
          unselectable="on"
          class="noselect"
          :key="tag.title"
          :class="activeTag == tag.title ?'is-danger' : 'is-warning'" @click.native.prevent="onClick(tag.title)"
          v-for="tag in tags" type="is-warning" style="cursor: pointer">{{ tag.title }}
      </b-tag>
    </transition-group>
    <p class="my-2" @click="showAllTags = !showAllTags"
       style="display:inline-block;text-align: right; font-size: 12px; cursor: pointer; display: inline-block">
      {{ showAllTags ? 'Show less tags.' : 'Show more tags.' }}</p>
    <h6 v-if="interests.length>0">Your Interests</h6>
    <transition-group v-if="interests.length>0" tag="b-taglist" name="fade" mode="out-in">
      <b-tag
          unselectable="on"
          class="noselect"
          :style="{'color' : darkMode ? '#ddd!important;' : '#333!important;'}"
          :key="tag" :class="activeTag == tag ?'is-danger' : 'is-warning'" @click.native.prevent="onClick(tag)"
          v-for="tag in localTags" type="is-warning" style="cursor: pointer"> {{ tag }}
      </b-tag>
    </transition-group>
    <p v-if="localTags.length>0" class="my-2" style="text-align: right; font-size: 12px; cursor: pointer; display: inline-block">Show all your
      interests.</p>
  </div>

</template>

<script>
export default {
  name: "DashboardTags",
  data() {
    return {
      localTags : [],
      clicks: 0,
      delay: 500,
      activeTag: "",
      timer: null,
      showAllTags: false
    }
  },
  computed: {
    tags() {
      const tags = this.$store.state.tags.slice()
      if (!this.showAllTags) {
        return tags.sort((a, b) => {
          return a - b
        }).slice(0, 10)
      }
      return tags.sort((a, b) => {
        return a - b
      })
    },
    interests() {
      const ls = localStorage.getItem('interests')
      if (ls) {
        if(JSON.parse(ls) == this.localTags){
          return this.localTags
        }
        else {
          return JSON.parse(ls)
        }
      }
      return []
    },
    darkMode() {
      return this.$store.getters['getNightMode']
    },
    dashboardContentLength() {
      return this.$store.getters.getDashboard.length
    }
  },
  methods: {
    onClick(tag) {
      const self = this;
      this.clicks++
      if (this.clicks === 1) {
        this.timer = setTimeout(function () {
          self.changeTag(tag)
          self.clicks = 0
        }, self.delay);
      } else {
        clearTimeout(this.timer);
        if (self.isTagAddable(tag)) {
          self.addTagToInterests(tag)
        } else {
          self.removeTagFromInterests(tag)
        }
        this.clicks = 0;
      }
    },
    isTagAddable(tag) {
      return this.interests.indexOf(tag) <= 0;
    },
    addTagToInterests(tag) {
      let interests = localStorage.getItem('interests')
      if (interests) {
        interests = JSON.parse(interests)
        interests.push(tag)
        interests = [...new Set(interests)]
        this.localTags = [...new Set(this.localTags), tag]
        interests = JSON.stringify(interests)
        localStorage.setItem('interests', interests)
      } else {
        interests = [tag]
        interests = JSON.stringify(interests)
        localStorage.setItem('interests', interests)
      }
    },
    removeTagFromInterests(tag) {
      let interests = localStorage.getItem('interests')
      if (interests) {
        interests = JSON.parse(interests)
        const index = interests.indexOf(tag)
        if (index > -1) {
          interests.splice(index, 1)
          interests = JSON.stringify(interests)
          localStorage.setItem('interests', interests)
          this.localTags = [...new Set(this.localTags)]
          this.localTags = this.localTags.filter(val=>{
            return val !== tag
          })
        }
      }
    },
    changeTag(title) {
      this.activeTag = title
      this.$emit('tagChange', title)
    }
  },
  created() {
    if (!this.dashboardContentLength || this.dashboardContentLength === 0) {
      this.$store.dispatch('getDashboard')
    }
    if(localStorage.getItem('interests')){
      this.localTags = JSON.parse(localStorage.getItem('interests'))
    } else {
      this.localTags = []
    }
  }
}
</script>

<style lang="stylus">
.noselect, .noselect > *
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
</style>
