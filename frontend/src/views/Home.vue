<template>
  <div class="home">
    <Photos/>
  </div>
</template>
<script>
// @ is an alias to /src
import Photos from '@/components/Photos.vue'

export default {
  name: 'Home',
  components: {
    Photos
  }
}
</script>
