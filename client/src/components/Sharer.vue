<template>
    <ul>
      <li @click="generator('facebook')">
        <b-icon icon="facebook" pack="fab"></b-icon>
      </li>
      <li @click="generator('twitter')">
        <b-icon icon="twitter" pack="fab" ></b-icon>
      </li>
      <li  click="generator('tumblr')">
        <b-icon icon="tumblr" pack="fab"></b-icon>
      </li>
    </ul>
</template>

<script>
export default {
  name: "Sharer",
  props:['user'],
  methods: {
    generator(platform){
      const twitterLink = `https://twitter.com/intent/tweet?url=pexies.com/${this.user.username}&text=Check%20out%20my%20pexies%20stash!!`
      const facebookLink = `https://www.facebook.com/sharer/sharer.php?u=pexies.com/${this.user.username}`
      const tumblrLink = `http://www.tumblr.com/share?v=3&u=pexies.com/${this.user.username}&t=Hello!`
      switch (platform){
        case 'twitter':
          window.open(twitterLink, '_blank')
              break
        case 'facebook':
          window.open(facebookLink, '_blank')
              break
        case 'tumblr':
          window.open(tumblrLink, '_blank')
              break
      }
    }
  }
}
</script>

<style scoped>

ul{
  background: #333;
  border-radius: 6px;
  color: white;
  padding: 4px;
}
ul, ul li{
  margin: 0; padding: 0;
}
li{
  margin-top: 3px;
}
li:first-child{
  margin-top: 0;
}

</style>
