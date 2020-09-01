<template>
  <div class="modal-card" style="width: auto">
    <header :class="darkMode ? 'bg-dark' : ''" class="modal-card-head">
      <p class="modal-card-title">Login</p>
      <button
          type="button"
          class="delete"
          @click="$emit('close')"/>
    </header>
    <section :class="darkMode ? 'bg-dark' : ''" class="modal-card-body">
      <b-field label="Username">
        <b-input
            type="text"
            v-model="User.username"
            placeholder="EpicGamer2020"
            required>
        </b-input>
      </b-field>

      <b-field label="Password">
        <b-input
            :ref="'pwInput'"
            type="password"
            v-model="User.password"
            password-reveal
            placeholder="Your epic password"
            required>
        </b-input>
      </b-field>
      <b-checkbox v-model="remember">Remember Me</b-checkbox>

    </section>
    <footer :class="darkMode ? 'bg-dark' : ''" class="modal-card-foot">
      <button :class="darkMode ? 'is-dark' : ''" class="button" type="button" @click="$emit('close')">Close</button>
      <button class="button" :class="darkMode ? 'is-danger' : 'is-warning'" @click="login()">Login</button>
    </footer>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: "Signup",
  props: ["newUser"],
  data() {
    return {
      remember: true,
      User: {
        username: "",
        password: "",
      }
    }
  },
  computed: {
    darkMode() {
      return this.$store.getters['getNightMode']
    }
  },
  methods: {
    close(){
      this.$emit('close')
    },
    login() {
      if (!this.User.password || !this.User.username) {
        this.$buefy.toast.open({
          message: "Please enter your username and password.",
          type: "is-warning"
        })
        return
      }
      const logged = JSON.parse(JSON.stringify(this.User))
      this.$store.dispatch('login', {User: logged, $buefy: this.$buefy, $router: this.$router, Close: this.close, Remember: this.remember})
    }
  },
  mounted() {
    if(this.newUser){
      this.User.username = this.newUser.username
      this.$refs.pwInput.focus()
    }
  }
}
</script>

<style scoped>

</style>
