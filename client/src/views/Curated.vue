<template>
    <div class="curated">
        <div class="title">
            <h1 :style="{'color' : !nm ? '#333' : '#ddd'}">Curated</h1>
            <p style="font-size: 12px; opacity: 0.75">Explore new content from Pexels curated list.</p>
        </div>
        <Photos name="curated"/>
    </div>
</template>
<script>
    // @ is an alias to /src
    import Photos from '@/components/Photos.vue'

    export default {
        name: 'Curated',
        data(){
          return{
            loaded: false,
          }
        },
        components: {
            Photos
        },
        computed:{
            nm(){
                return this.$store.getters.getNightMode
            }
        },
    }
</script>

<style lang="stylus">

</style>
