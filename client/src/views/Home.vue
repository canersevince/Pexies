<template>
    <div class="home">
        <div class="title">
            <h1 :style="{'color' : !nm ? '#333' : '#ddd'}">Pexies.com</h1>
        </div>
    </div>
</template>
<script>
    // @ is an alias to /src

    export default {
        name: 'Home',
        mounted() {
          if(this.$store.state.auth.auth){
            this.$router.push('/Profile')
          }
        }
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
        background #ddd
        justify-content: center;
        box-shadow 0 -6px 6px rgba(0,0,0,0.1)
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
    .bg-dark > svg:hover {
        color hotpink
    }
</style>
