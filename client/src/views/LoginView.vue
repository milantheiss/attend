<template >
  <div class="container mx-auto mt-12 md:w-120 sm:w-96">
    <div class="flex flex-col justify-center items-start ml-6 mb-4">
      <p class="text-xl md:text-2xl font-medium">Willkommen...</p>
      <p class="text-light-gray">Bitte melde dich an</p>
    </div>
    <div class="bg-white px-5 md:px-10 py-6 rounded-xl drop-shadow-md w-full">
      <form @submit.prevent="submit" class="flex flex-col justify-start gap-4">
        <div class="flex gap-4 items-center w-full">
          <!--Avatar Icon-->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.548 47.707" class="w-8 h-8">
            <g fill="none" stroke="currentColor" stroke-width="6.649" transform="translate(-93.958 -82.631)">
              <ellipse cx="118.732" cy="96.016" rx="10.439" ry="10.061" />
              <path d="M97.15 129.409a22.145 17.563 0 0 1 21.581-13.623 22.145 17.563 0 0 1 21.582 13.626" />
            </g>
          </svg>
          <TextInput type="text" name="email" v-model="form.email" placeholder="E-Mail"></TextInput>
        </div>
        <div class="flex gap-4 items-center w-full">
          <!--Key Icon-->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43.732 46.56" class="w-8 h-8 rotate-3">
            <path fill="currentColor"
              d="M40.562 3.391a11.198 11.198 0 0 0-.412-.402A11.198 11.198 0 0 0 32.534 0a11.198 11.198 0 0 0-11.198 11.198 11.198 11.198 0 0 0 1.51 5.616L.867 38.794a2.879 2.879 0 0 0-.045 4.072 2.91 2.91 0 0 0 4.116 0l1.1-1.1 4.408 4.407a1.323 1.323 0 0 0 1.87 0l7.637-7.636a1.323 1.323 0 0 0 0-1.871l-4.407-4.408 11.372-11.373a11.198 11.198 0 0 0 5.617 1.51 11.198 11.198 0 0 0 11.198-11.197 11.198 11.198 0 0 0-3.17-7.807zm-4.1 3.878a5.556 5.556 0 0 1 1.628 3.929 5.556 5.556 0 0 1-5.556 5.556 5.556 5.556 0 0 1-5.556-5.556 5.556 5.556 0 0 1 5.556-5.556 5.556 5.556 0 0 1 3.928 1.627z"
              paint-order="markers stroke fill" />
          </svg>
          <TextInput type="password" name="password" v-model="form.password" placeholder="Passwort"></TextInput>
        </div>
        <ErrorMessage :message="errorMessage" :show="showError" class="text-lg md:text-xl" />
        <div class="mt-2">
          <button type="submit"
            class="w-full text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-3.5 md:px-7 py-3.5 rounded-2xl drop-shadow-md font-medium text-xl">Login</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import ErrorMessage from "@/components/ErrorMessage.vue";
import TextInput from "@/components/TextInput.vue";
import { useAuthStore } from "@/store/authStore";
import { useDataStore } from "@/store/dataStore";

export default {
  name: "LoginView",
  setup() {
    const auth = useAuthStore()
    const dataStore = useDataStore()
    return {
      auth,
      dataStore
    }
  },
  components: { ErrorMessage, TextInput },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      showError: false,
      errorMessage: ""
    };
  },
  methods: {
    async submit() {
      const user = this.form
      try {
        await this.auth.logIn(user);
        this.$router.push("/attendancelist");
        this.showError = false
      } catch (error) {
        console.error(error)
        if (error === "User is deactivated") {
          this.errorMessage = "Dieser Account ist deaktiviert"
        } else {
          this.errorMessage = "E-Mail oder Passwort falsch"
        }
        this.showError = true
      }
    },
  },
  created() {
    this.dataStore.viewname = "Login"
  }
};
</script>
