<template >
  <div class="flex justify-center mt-10">
    <div class="bg-white px-8 py-4 rounded-lg drop-shadow-md md:w-1/3 ">
      <form @submit.prevent="submit" class="grid grid-rows-3 grid-col-2">
        <div class="row-start-1 flex items-center mb-3">
          <img :src="'./img/avatar-icon.svg'" alt="key icon" class="w-5 mr-3"/>
          <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey" type="text" name="username" v-model="form.username" placeholder="Username"/>
        </div>
        <div class="row-start-2 flex items-center mb-3">
          <img :src="'./img/key-icon.svg'" alt="key icon" class="w-5 mr-3"/>
          <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey" type="password" name="password" v-model="form.password" placeholder="Passwort"/>
        </div>
        <button type="submit" class="row-start-3">Submit</button>
        <p v-if="showError" id="error" class="row-start-3">Username or Password is incorrect</p>
      </form>
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
        username: "",
        password: "",
      },
      showError: false
    };
  },
  methods: {
    ...mapActions(["LogIn"]),
    async submit() {
      const user = {
        username: this.form.username,
        password: this.form.password
      }
      try {
        await this.LogIn(user);
        this.$router.push("/attendancelist");
        this.showError = false
      } catch (error) {
        console.error(error)
        this.showError = true
      }
    },
  },
};
</script>
