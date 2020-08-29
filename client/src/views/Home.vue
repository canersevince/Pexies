<template>
    <div class="home">
        <div class="title">
            <h1>Randomizer</h1>
        </div>
        <Photos name="random"/>
        <div @click="randomize()" class="bottom-bar">
            <i style="font-size: 48px" class="fas fa-dice"></i>
        </div>
    </div>
</template>
<script>
    // @ is an alias to /src
    import Photos from '@/components/Photos.vue'

    export default {
        name: 'Home',
        components: {
            Photos
        },
        methods: {
            randomize() {
                this.$store.dispatch('getRandom')
            }
        },
    }
</script>

<style lang="stylus">

    .bottom-bar
        display: flex;
        align-items: center;
        padding: 5px;
        position fixed
        bottom 0
        left 0
        justify-content: center;
        box-shadow 0 6px 6px rgba(0,0,0,0.1)
        width 100%

    .bottom-bar, .bottom-bar * {
        transition 200ms ease
    }

    .bottom-bar > svg:hover, .bottom-bar > i:hover{
        transition 200ms ease
        color pink
        cursor pointer
        z-index 999
    }
</style>
