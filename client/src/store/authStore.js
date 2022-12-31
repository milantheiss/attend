import { defineStore } from "pinia";
import { useDataStore } from "./dataStore";

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    //Enthält Name, ID etc. 
    //Warning Wird im Moment nicht genutzt.
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
      let res = (await fetch([import.meta.env.VITE_API_URL, "login"].join('/'), {
        method: 'POST',
        body: JSON.stringify(user_credentials),
        headers: {'Content-type': 'application/json; charset=UTF-8'},
        credentials: 'include',
        mode: 'cors'
      }));
  
      this.authenticated = res.status === 200
      res = await res.json()
      useDataStore().showPatchNotesDialog = res.showPatchNotesDialog
  
     this.user = res.user
    },
  
    async logOut() {
      //let user = null;
      const res = await fetch([import.meta.env.VITE_API_URL, "logout"].join('/'), {
        method: 'POST',
        headers: {'Content-type': 'application/json; charset=UTF-8'},
        credentials: 'include',
        mode: 'cors'
      })
      this.authenticated = !res.status === 200
      this.user = undefined
    },

    async authenticate(){
      console.log("🚀 ~ file: authStore.js:50 ~ res ~ import.meta.env.VITE_API_URL", import.meta.env.VITE_API_URL)
      let res = (await fetch([import.meta.env.VITE_API_URL, 'authenticate'].join('/'), {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        credentials: 'include',
        mode: 'cors'
      }))

      this.authenticated = res.status === 200

      res = await res.json()
      this.user = res.user
      useDataStore().showPatchNotesDialog = res.showPatchNotesDialog  

      return this.authenticated
    }
  }
})