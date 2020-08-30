<template>
  <div class="modal-card" style="width: auto">
    <header :class="darkMode ? 'bg-dark' : ''" class="modal-card-head">
      <p class="modal-card-title">Sign up</p>
      <button
          type="button"
          class="delete"
          @click="$emit('close')"/>
    </header>
    <section :class="darkMode ? 'bg-dark' : ''" class="modal-card-body">
      <b-field label="Pick a username">
        <b-input
            minlength="3"
            type="text"
            v-model="User.username"
            placeholder="DarthVader420"
            required>
        </b-input>
      </b-field>

      <b-field label="Your email">
        <b-input
            type="email"
            v-model="User.email"
            placeholder="somecoolname@example.com"
            required>
        </b-input>
      </b-field>

      <b-field label="Password">
        <b-input
            type="password"
            v-model="User.password"
            password-reveal
            placeholder="Your password"
            required>
        </b-input>
      </b-field>
      <b-field label="Password Confirmation">
        <b-input
            type="password"
            v-model="User.passwordConfirmation"
            password-reveal
            placeholder="Repeat our password"
            required>
        </b-input>
      </b-field>
      <b-field label="Password Strength">
        <Meter :strength-meter-only="true" v-model="User.password"></Meter>
      </b-field>
    </section>
    <footer :class="darkMode ? 'bg-dark' : ''" class="modal-card-foot">
      <button :class="darkMode ? 'is-dark' : ''" class="button" type="button" @click="$emit('close')">Close</button>
      <button :class="darkMode ? 'is-danger' : 'is-warning'" class="button" @click="signup()">Sign up</button>
    </footer>
  </div>
</template>

<script>
import Meter from 'vue-password-strength-meter'
export default {
  name: "Signup",
  props: ['showLogin'],
  components:{
    Meter
  },
  data() {
    return {
      User: {
        username: "",
        email: "",
        password: "",
        passwordConfirmation: ""
      },
      mailRegexp: /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/
    }
  },
  computed: {
    darkMode() {
      return this.$store.getters['getNightMode']
    }
  },
  methods: {
    validation() {
      return this.mailRegexp.test(this.User.email);
    },
    close() {
      this.$emit('close')
    },
    signup() {
      if (this.validation() === false) {
        this.$buefy.toast.open({
          message: "Please enter a valid email.",
          type: "is-warning"
        })
        return
      }
      if (this.User.password !== this.User.passwordConfirmation) {
        this.$buefy.toast.open({
          message: "You passwords don't match.",
          type: "is-warning"
        })
        return
      }
      const newUser = JSON.parse(JSON.stringify(this.User))
      this.$store.dispatch('signup', {
        User: newUser,
        Login: this.showLogin,
        $buefy: this.$buefy,
        Close: this.close,
        $router: this.$router
      })
    }
  }
}
</script>

<style scoped>

</style>
