<template>
    <div class="curated">
        <div class="title">
            <h1>Curated</h1>
        </div>
        <Photos name="curated"/>
    </div>
</template>
<script>
    // @ is an alias to /src
    import Photos from '@/components/Photos.vue'

    export default {
        name: 'Curated',
        components: {
            Photos
        }
    }
</script>

<style lang="stylus">

</style>
