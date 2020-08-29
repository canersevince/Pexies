<template>
    <div class="photo_link_wrapper" v-if="propCopy">
        <b-tag type="is-primary" class="photographer">
            <a style="color: white" :href="propCopy.photographer_url">
                {{propCopy.photographer && propCopy.photographer.length>15 ? propCopy.photographer.substring(0,15)+'...' :
                propCopy.photographer}}
            </a>
        </b-tag>
        <transition-group tag="div" name="fade" mode="out-in" class="like_button">
            <span :key="'like'" v-show="propCopy.liked === false && path !== '/favourites'" @click="like(propCopy)">
                <i style="color: deeppink" class="fa fa-heart"></i>
            </span>
            <span :key="'dislike'" v-show="propCopy.liked === true" @click="dislike(propCopy)">
                <i class="fa fa-times"></i>
            </span>
        </transition-group>
        <span @click="visit" class="visit_button">
            <i style="color: deeppink" class="fa fa-search"></i>
        </span>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {Photo} from "@/models/photo";

    export default Vue.extend({
        props: ['photo'],
        data(){
            return{
                propCopy: <Photo>{}
            }
        },
        created() {
          this.propCopy = JSON.parse(JSON.stringify(this.photo))
        },
        methods: {
            visit(){
                window.open(this.propCopy.url, '_blank')
            },
            like(photo: Photo) {
                if (!this.isPhotoLikeable(photo)) {
                    this.$buefy.toast.open({
                        message: "You already liked this photo.",
                        type: "is-danger"
                    })
                    return
                }
                this.propCopy.liked = true
                this.$store.dispatch('likePhoto', photo)
                this.$buefy.toast.open({
                    message: "Liked!",
                    type: "is-success"
                })
            },
            dislike(photo: any) {
                console.log(this.path)
                this.$store.dispatch('dislikePhoto', photo)
                this.$buefy.toast.open({
                    message: "Photo removed from your library!",
                    type: "is-success"
                })
                if(this.path !== '/favourites'){
                    this.propCopy.liked = false;
                }
            },
            isPhotoLikeable(p: Photo) {
                const exists = this.likedImgs.find((val: Photo) => {
                    return val.url == p.url
                })
                console.log(exists)
                if (exists) {
                    return false
                }
                return true
            }
        },
        computed: {
            path(){
                return this.$route.path
            },
            likedImgs() {
                const i = localStorage.getItem('likedPhotos')
                if (i) return JSON.parse(i)
                return []
            }
        }
    })
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
    .photo
        filter grayscale(90%)
        position relative
        background-size cover
        background-position center
        background-repeat no-repeat
        transition 300ms
        display flex
        align-items center
        justify-content center
        align-content center
        box-shadow 0 12px 20px #bebebe, -6px -12px 20px #cdcdcd;;
        height 200px
        width 200px
        border-radius 30px
        margin 2%
        cursor pointer
    .photo:hover
        filter grayscale(0)
        transform scale(1.1)
        box-shadow 10px 12px 20px #bebebe, -10px -12px 20px #ccc;

    .photo_link_wrapper
        width: 100%
        height 100%
        background transparent
        position absolute
        top 0
        left 0

    .photographer
        position absolute
        top 10px
        right 10px

    .like_button, .visit_button
        z-index 999
        transition 200ms ease
        padding 4px
        border-radius 4px
        background rgba(255, 255, 255, 0.5)
        position absolute
        left 10px
        bottom 10px
        height 32px
        width 32px
        text-align center
        overflow hidden

    .visit_button
        left unset
        right 10px
        bottom 10px

    .not_likable {
        color #555
    }

    .like_button:hover > *
        transform scale(1.08)
</style>
