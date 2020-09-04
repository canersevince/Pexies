<template>
  <div>
    <avatar
        :output-options="isCover ? {} : {width: 300, height: 300}"
        :cropper-options="config ? config : { aspectRatio: 1, autoCropArea: 1, viewMode: 1, movable: false, zoomable: false }"
        :labels="{submit: 'Save', cancel: 'Cancel'}"
        :upload-headers="{username: $store.getters.getCurrentUser.username, current_avatar: currentAvatar, current_header: currentHeader}"
        @uploading="handleUploading"
        @uploaded="handleUploaded"
        @completed="handleCompleted"
        @error="handlerError"
        :upload-url="isCover ? '/api/user/upload-cover-picture' : '/api/user/upload-profile-picture'"
        :trigger="trigger"></avatar>
  </div>
</template>

<script>
import avatar from 'vue-avatar-cropper'

export default {
  name: "AvatarCropper",
  props: ["isCover", "config", "trigger"],
  components: {
    avatar
  },
  methods: {
    handleUploading(form, xhr) {
      if (!this.isCover) {
        this.$store.commit('showPPLoader')
      } else {
        this.$store.commit('showLoader')
      }
    },
    handleUploaded(response) {
      console.log(response)
      if (response.code == 200) {
        if (!this.isCover) {
          this.$store.commit('updatedUserPicture', response.url)
          this.$store.commit('hidePPLoader')
        } else {
          this.$store.commit('updatedUserCover', response.url)
          this.$store.commit('hideLoader')
        }
      } else {
          this.$buefy.toast.open({
            type: "is-danger",
            message: "Cannot upload profile image. Reason:"+response.error
          })
          if (!this.isCover) {
            this.$store.commit('hidePPLoader')
          } else {
            this.$store.commit('hideLoader')
        }
      }

    },
    handleCompleted(response, form, xhr) {
      this.message = "upload completed.";
      if (!this.isCover) {
        this.$store.commit('showPPLoader')
      } else {
        this.$store.commit('showLoader')
      }
    },
    handlerError(message, type, xhr) {
      this.message = "Oops! Something went wrong...";
      if (!this.isCover) {
        this.$store.commit('hidePPLoader')
      } else {
        this.$store.commit('hideLoader')
      }
    }
  },
  computed: {
    currentAvatar() {
      const link = this.$store.getters.getCurrentUser.preferences.profile_picture
      if (link && link.length > 0) {
        return link.split('/')[link.split('/').length - 1]
      }
      return ""
    },
    currentHeader() {
      const link = this.$store.getters.getCurrentUser.preferences.profile_cover
      if (link && link.length > 0) {
        return link.split('/')[link.split('/').length - 1]
      }
      return ""
    }
  },
}
</script>

<style scoped>

</style>
