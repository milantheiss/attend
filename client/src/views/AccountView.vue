<template>
  <div>
    <Toast ref="toast"></Toast>

    <div class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col">
      <div class="flex flex-col justify-center items-center gap-4">
        <div class="w-full flex items-center justify-start">
          <p class="text-xl md:text-2xl font-medium">Konto bearbeiten...</p>
        </div>
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

        <div class="w-full flex items-center justify-between gap-4" @click="showNewPassword = true">
          <p>Password ändern</p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"
            class="w-7 md:w-8 h-7 md:h-8 ml-auto">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </div>

        <!-- Password neu senden -->
        <!-- <div class="w-full flex items-center justify-end gap-4 mt-4">
          <button "
            class="flex justify-center items-center text-standard-gradient-2 outline outline-2 outline-standard-gradient-2 drop-shadow-md rounded-[20px] px-3.5 md:px-7 py-2.5 ">
            <p class="font-medium font-base md:text-lg">Password ändern</p>
          </button>
        </div> -->

        <ErrorMessage :message="error.message" :show="error.show"></ErrorMessage>


        <StandardButton @click="saveChanges" class="w-full mt-2">
          <p class="font-base md:text-lg">Speichern</p>
        </StandardButton>
      </div>
    </div>

    <ModalDialog :show="showNewPassword" @onClose="close" :hasSubheader="false">
      <template #header>
        <div class="w-full flex items-center justify-between gap-4">
          <p class="text-xl md:text-2xl font-medium">Password ändern</p>
          <p class="text-light-gray font-medium cursor-pointer" @click="close">Schliessen</p>
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="w-full flex items-center justify-between gap-4">
            <label for="oldPassword">Altes Passwort:</label>
            <TextInput name="oldPassword" v-model="password.old" placeholder="Altes Passwort" class="md:w-96" type="password"></TextInput>
          </div>
          <div class="w-full flex items-center justify-between gap-4">
            <label for="newPassword">Neues Passwort:</label>
            <TextInput name="newPassword" v-model="password.new" placeholder="Neues Passwort" type="password"
              :showError="error.cause.passwordInput" class="md:w-96"></TextInput>
          </div>
          <div class="w-full flex items-center justify-between gap-4">
            <label for="repeatPassword">Wiederholen:</label>
            <TextInput name="repeatPassword" v-model="password.repeat" placeholder="Wiederholen" type="password"
              :showError="error.cause.passwordInput" class="md:w-96"></TextInput>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="w-full flex flex-col gap-4">
          <ErrorMessage :message="error.message" :show="error.show"></ErrorMessage>

          <StandardButton @click="changePassword" class="w-full">Ändern</StandardButton>
        </div>
      </template>
    </ModalDialog>
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
import { updateOwnUserData, changePassword } from "@/util/fetchOperations";
import ModalDialog from "@/components/ModalDialog.vue";

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
          emailInput: false,
          passwordInput: false
        }
      },
      password: {
        old: "",
        new: "",
        repeat: ""
      },
      showNewPassword: false
    }
  },

  components: {
    ErrorMessage,
    TextInput,
    StandardButton,
    Toast,
    ModalDialog
  },

  methods: {
    close() {
      this.password = {
        old: "",
        new: "",
        repeat: ""
      }
      this.resetError()
      this.showNewPassword = false
    },

    async saveChanges() {
      // this.validateInput(this.user)

      if (!this.error.show) {
        const res = await updateOwnUserData(this.user)

        if (res.ok) {
          this.$refs.toast.trigger(3000, "success", "Änderungen gespeichert.")
        }
      }

    },

    async changePassword() {
      this.resetError()

      if (this.password.new !== this.password.repeat) {
        this.error.message = "Die Passwörter stimmen nicht überein."
        this.error.cause.passwordInput = true
        this.error.show = true
        return
      }

      if (this.password.new.length < 8) {
        this.error.message = "Das Passwort muss mindestens 8 Zeichen lang sein."
        this.error.cause.passwordInput = true
        this.error.show = true
        return
      }

      if (!this.error.show) {
        const res = await changePassword(_.pick(this.password, ["old", "new"]))

        if (!res.ok) {
          this.error.message = res.body.message
          this.error.show = true
        }
      }
    },

    resetError() {
      this.error.show = false
      this.error.message = ""
      this.error.cause.firstnameInput = false
      this.error.cause.lastnameInput = false
      this.error.cause.emailInput = false,
        this.error.cause.passwordInput = false
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
    document.title = 'Kontoeinstellungen - Attend'
    this.dataStore.viewname = "Kontoeinstellungen"
  },

  async mounted() {
    this.user = _.pick(this.authStore.user, ["firstname", "lastname", "email"])
  },

  computed: {

  }
}
</script>
