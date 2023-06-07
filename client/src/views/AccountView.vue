<template>
  <div>
    <Toast ref="toast"></Toast>

    <div class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col">
      <div class="flex flex-col justify-center items-center gap-4">
        <!--Vorname des Benutzers-->
        <div class="w-full flex items-center justify-between gap-4">
          <label for="firstname">Vorname:</label>
          <TextInput name="firstname" v-model="user.firstname" placeholder="Vorname"
            :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
        </div>

        <!--Nachname des Benutzers-->
        <div class="w-full flex items-center justify-between gap-4">
          <label for="lastname">Nachname:</label>
          <TextInput name="lastname" v-model="user.lastname" placeholder="Nachname" :showError="error.cause.lastnameInput"
            class="md:w-96"></TextInput>
        </div>

        <!--E-Mail des Benutzers-->
        <div class="w-full flex items-center justify-between gap-4">
          <label for="email" class="whitespace-nowrap">E-Mail:</label>
          <TextInput name="email" v-model="user.email" placeholder="E-Mail" :showError="error.cause.emailInput"
            class="md:w-96"></TextInput>
        </div>

        <!-- Password neu senden -->
        <div class="w-full flex items-center justify-between gap-4 mt-4">
          <!-- TODO Open Change Password Modal -->
          <p>Passwort neu senden:</p>
          <StandardButton @click="resendPassword">
            <p class="font-base md:text-lg">Senden</p>
          </StandardButton>
        </div>

        <ErrorMessage :message="error.message" :show="error.show"></ErrorMessage>


        <StandardButton @click="saveChanges" class="w-full">
          <p class="font-base md:text-lg">Speichern</p>
        </StandardButton>
      </div>
    </div>
  </div>
</template>
  
<script>
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import TextInput from "@/components/TextInput.vue";
import StandardButton from "@/components/StandardButton.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import _ from "lodash";
import Toast from "@/components/Toast.vue";
import { updateOwnUserData, resendPassword } from "@/util/fetchOperations";

export default {
  name: "AccountView",

  setup() {
    const dataStore = useDataStore()
    const authStore = useAuthStore()

    return {
      dataStore,
      authStore
    }
  },

  data() {
    return {
      user: {
        firstname: "",
        lastname: "",
        email: ""
      },
      error: {
        show: false,
        message: "",
        cause: {
          firstnameInput: false,
          lastnameInput: false,
          emailInput: false
        }
      }
    }
  },

  components: {
    ErrorMessage,
    TextInput,
    StandardButton,
    Toast
},

  methods: {

    async saveChanges() {
      // this.validateInput(this.user)

      if (!this.error.show) {
        const res = await updateOwnUserData(this.user)

        if (res.ok) {
          this.$refs.toast.trigger(3000, "success", "Änderungen gespeichert.")
        }
      }

    },

    async resendPassword() {
      const res = await resendPassword(this.user.email)

      if (res.ok) {

      }
    },

    resetError() {
      this.error.show = false
      this.error.message = ""
      this.error.cause.firstnameInput = false
      this.error.cause.lastnameInput = false
      this.error.cause.emailInput = false
    },

    validateInput(inputs) {
      this.resetError()

      if (inputs.firstname.trim().length === 0 || !inputs.firstname.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
        this.error.message = 'Bitte gebe einen Vornamen ein.'
        this.error.show = true
        this.error.cause.firstnameInput = true
      }
      if (inputs.lastname.trim().length === 0 || !inputs.lastname.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
        this.error.message = 'Bitte gebe einen Nachnamen ein.'
        this.error.show = true
        this.error.cause.lastnameInput = true
      }
      if (inputs.email.trim().length < 3 || inputs.email.trim().length > 20 || !inputs.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
        this.error.message = 'Bitte gebe einen gültigen E-Mail ein.'
        this.error.show = true
        this.error.cause.emailInput = true
      }
      //Wenn mehrere Fehler vorliegen, wird 'Mehrere Fehler.' angezeigt
      if (Object.keys(this.error.cause).filter(k => this.error.cause[k]).length > 1) {
        this.error.message = 'Mehrere Fehler.'
      }
    }

  },

  async created() {
    document.title = 'Konto bearbeiten - Attend'
    this.dataStore.viewname = "Konto bearbeiten"
  },

  async mounted() {
    this.user = _.pick(this.authStore.user, ["firstname", "lastname", "email"])
  },

  computed: {

  }
}
</script>
