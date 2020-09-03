<template>
    <ul>
      <li>
        <b-icon icon="facebook" pack="fab" @click="generator('facebook')"></b-icon>
      </li>
      <li>
        <b-icon icon="twitter" pack="fab" @click="generator('twitter')"></b-icon>
      </li>
      <li>
        <b-icon icon="tumblr" pack="fab" @click="generator('tumblr')"></b-icon>
      </li>
    </ul>
</template>

<script>
export default {
  name: "Sharer",
  props:['user'],
  methods: {
    generator(platform){
      const twitterLink = `http://www.tumblr.com/share?v=3&u=pexies.com/${this.user.username}&t=Check out my pexies collecition!!`
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
