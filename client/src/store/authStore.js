import { defineStore } from "pinia";
import { useDataStore } from "./dataStore";
import Cookies from "js-cookie";

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    //Enthält firstname, lastname, _id, lengthAccessibleGroups & username 
    user: null,
    authenticated: false
  }),
  actions: {
    // async Register({dispatch}, form) {
    //   await axios.post('register', form)
    //   let UserForm = new FormData()
    //   UserForm.append('username', form.username)
    //   UserForm.append('password', form.password)
    //   await dispatch('LogIn', UserForm)
    // },

    async logIn(user_credentials) {
      let res = (await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(user_credentials),
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        credentials: 'include',
        mode: 'cors'
      }));

      res = await res.json()
      useDataStore().showPatchNotesDialog = res.showPatchNotesDialog

      this.user = res.user
    },

    async logOut() {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        credentials: 'include',
        mode: 'cors'
      });

      this.user = undefined
    },

    isAuthenticated() {
      //Refresh & Access Token sind htttOnly Cookies. Damit kann man sie nicht mit JavaScript auslesen.
      //Um festzustellen, ob ein Cookie existiert & die Session authentifiziert ist, wird testweise ein Cookie mit dem Namen "refresh_token" gesetzt.
      //Wenn bereits ein Cookie mit dem Namen "refresh_token" existiert, dann kann er nicht gesetzt werden und wenn man den Cookie zieht, ist er undefined.
      Cookies.set("refresh_token", "test", { expires: 0.0006 })
      const bool = Cookies.get("refresh_token") === undefined
      this.authenticated = bool
      return bool
    }
  },
  persist: true
})