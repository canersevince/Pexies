<template>
    <transition-group tag="div" class="photos" name="fade">
        <q-intersection
                :style="{backgroundImage: `url(${photo.src.medium})`}"
                transition="scale"
                class="photo"
                v-for="(photo, i) in photos" :key="i">
                <Photo :photo="photo"></Photo>
        </q-intersection>
    </transition-group>
</template>

<script lang="ts">
    import {QInfiniteScroll, QIntersection} from "quasar";
    import {Component, Vue} from 'vue-property-decorator';
    import Photo from "@/components/Photo.vue";

    @Component({
        props: ["name"],
        components: {Photo, QInfiniteScroll, QIntersection},
        computed: {
            photos(){
                if(this.$props.name == 'curated'){
                    return this.$store.getters.getCuratedPhotos
                }
                if(this.$props.name == 'random'){
                    return this.$store.getters.getRandomPhotos
                }
                if(this.$props.name == 'favourites'){
                    const favourites =this.$store.getters.getFavourites
                    return favourites.reverse()
                }
                return []
            }
        },
        created() {
            switch (this.$props.name) {
                case "curated":
                    this.$store.dispatch('getCurated', this.$buefy)
                    break;
                case "random":
                    this.$store.dispatch('getRandom', this.$buefy)
                    break;
                case "favourites":
                    this.$store.dispatch('loadFavourites', this.$buefy)
                    break;
            }
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
        flex-wrap wrap
        max-height 80vh
        overflow-y scroll
</style>
