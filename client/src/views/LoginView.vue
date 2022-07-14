<template >
  <div class="flex justify-center mt-10 mx-4">
    <div class="bg-white px-8 py-6 rounded-lg drop-shadow-md md:w-120 sm:w-96">
      <form @submit.prevent="submit" :class="showError ? 'grid grid-rows-4' : 'grid grid-rows-3'" class="place-items-center text-lg">
        <div class="flex items-center mb-3 w-full md:px-4">
          <img :src="'./img/avatar-icon.svg'" alt="key icon" class="w-6 mr-4"/>
          <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full" type="text" name="username" v-model="form.username" placeholder="Username"/>
        </div>
        <div class="flex items-center mb-3 w-full md:px-4">
          <img :src="'./img/key-icon.svg'" alt="key icon" class="w-6 mr-4"/>
          <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full" type="password" name="password" v-model="form.password" placeholder="Passwort"/>
        </div>
        <p v-show="showError" id="error" class="m-0">Username or Password is incorrect</p>
        <button type="submit" :class="showError ? 'mt-2' : 'mt-4'" class="text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-5 md:px-6 py-1.5 md:py-2 rounded-lg drop-shadow-md font-medium place-self-end md:mr-4">Login</button>
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
