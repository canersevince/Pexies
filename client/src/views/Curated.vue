<template>
    <div class="curated">
        <div class="title">
            <h1 :style="{'color' : !nm ? '#333' : '#ddd'}">Curated</h1>
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
