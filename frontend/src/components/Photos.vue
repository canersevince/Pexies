<template>
    <div class="photos">
        <Photo></Photo>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Photo from "@/components/Photo.vue";
    @Component({
        components: {Photo},
        computed: {
          curatedPhotos(){
              return this.$store.getters['getCuratedPhotos']
          }
        },
        created(){
            this.$store.dispatch('getCurated')
        }
    })
    export default class Photos extends Vue {

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
    .photos
        display flex
        align-items center
        justify-content center
        align-content center
</style>
