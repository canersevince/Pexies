<template>
  <div class="home">
    <div class="title">
      <h1 :style="{'color' : !nm ? '#333' : '#ddd'}">Pexies.com</h1>
    </div>
    <div v-if="!$store.getters.getAuth" class="mt-3" style="text-align: center; display: flex; align-items: center; justify-content: center; flex-direction: column">
      <h1 :style="{'color' : !nm ? '#333' : '#ddd'}"  class="title">Welcome to the Pexies.</h1>
      <p :style="{'color' : !nm ? '#333' : '#ddd'}" style=" width: 50%; display: inline-block; margin: 0 auto">
        Pexies is a service allows you to search images across Flickr, Pexels, Unsplash and Pexies simultaneously. Add them to your favourites and react them from one place.
        <br>
      Start using pexies today for free.</p>
      <p :style="{'color' : !nm ? '#333' : '#ddd'}" style="font-size: 10px; opacity: 0.6; width: 60%; display: inline-block; margin: 0 auto"> (you can still pin pictures as guest)</p>
    </div>
    <div v-if="$store.getters.getAuth">
      <b-button type="is-danger" @click="$router.push('/dashboard')">Go To Dashboard</b-button>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
export default {
  name: 'Home',
  computed: {
    nm() {
      return this.$store.getters['getNightMode']
    }
  },
  mounted() {
    const store = this.$store;
    const router = this.$router
    setTimeout(() => {
      if (store && store.state.auth.auth) {
        console.log('you are logged in...')
        router.push('/Dashboard')
      }
    }, 500)
  }
}
</script>

<style lang="stylus">
.bottom-bar
  display: flex;
  align-items: center;
  padding: 5px;
  position fixed
  bottom 0
  left 0
  background #ddd
  justify-content: center;
  box-shadow 0 -6px 6px rgba(0, 0, 0, 0.1)
  width 100%

.bottom-bar, .bottom-bar * {
  transition 200ms ease
}

.bottom-bar > svg:hover, .bottom-bar > i:hover {
  transition 200ms ease
  color pink
  cursor pointer
  z-index 999
}

.bg-dark > svg:hover {
  color hotpink
}
</style>
