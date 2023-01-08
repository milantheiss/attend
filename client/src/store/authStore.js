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
      });
      
      console.log("🚀 ~ file: authStore.js:39 ~ res ~ res", res)

      this.authenticated = !res.status === 200
      console.log("🚀 ~ file: authStore.js:48 ~ logOut ~ this.authenticated", this.authenticated)

      
      this.user = undefined
    },

    async authenticate(){
      let res = (await fetch([import.meta.env.VITE_API_URL, 'authenticate'].join('/'), {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        credentials: 'include',
        mode: 'cors'
      }))

      this.authenticated = res.status === 200
      
      if (this.authenticated) {
        res = await res.json()
        this.user = res.user
        useDataStore().showPatchNotesDialog = res.showPatchNotesDialog  
        useDataStore().getNotifications()
      }

      console.log("🚀 ~ file: authStore.js:63 ~ authenticate ~ this.authenticated", this.authenticated)

      return this.authenticated
    }
  }
})