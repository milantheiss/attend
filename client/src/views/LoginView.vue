<template>
  <div class="login">
    <div>
      <form @submit.prevent="submit">
        <div>
          <label for="email">{{ $store.state.test }}</label>
          <input type="text" name="email" v-model="form.email" />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" name="password" v-model="form.password" />
        </div>
        <button type="submit">Submit</button>
      </form>
      <p v-if="showError" id="error">Email or Password is incorrect</p>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "LoginView",
  components: {},
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      showError: false
    };
  },
  methods: {
    ...mapActions(["LogIn"]),
    async submit() {
      const user = {
        email: this.form.email,
        password: this.form.password
      }
      try {
        await this.LogIn(user);
        this.$router.push("/attendancelist");
        this.showError = false
      } catch (error) {
        this.showError = true
      }
    },
  },
};
</script>
