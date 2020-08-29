<template>
    <div class="favourites">
        <div class="title">
            <h1>Favourites</h1>
        </div>
        <Photos name="favourites"/>
    </div>
</template>
<script>
    // @ is an alias to /src
    import Photos from '@/components/Photos.vue'

    export default {
        name: 'Favourites',
        components: {
            Photos
        }
    }
</script>

<style lang="stylus">

</style>
