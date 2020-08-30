<template>
    <div class="favourites">
        <div class="title">
            <h1 :style="{'color' : !nm ? '#333' : '#ddd'}">Favourites</h1>
        </div>
        <Photos name="favourites"/>
        <div class="error_secondary" v-if="favourites == 0">
            <b-message type="is-warning">
                You didn't save any pictures, yet.
            </b-message>
            <b-button type="is-warning" @click="$router.push('/')">Show me some!</b-button>
        </div>
    </div>
</template>
<script>
    // @ is an alias to /src
    import Photos from '@/components/Photos.vue'

    export default {
        name: 'Favourites',
        computed: {
            favourites(){
                const i = this.$store.getters.getFavourites
                return i.length
            },
            nm(){
                return this.$store.getters.getNightMode
            }
        },
        components: {
            Photos
        }
    }
</script>

<style lang="stylus">
    .error_message
        width 50%
        margin 25px auto
</style>
