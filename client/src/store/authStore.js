import { defineStore } from "pinia";
import { useDataStore } from "./dataStore";

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
      const res = await fetch([import.meta.env.VITE_API_URL, "logout"].join('/'), {
        method: 'POST',
        headers: {'Content-type': 'application/json; charset=UTF-8'},
        credentials: 'include',
        mode: 'cors'
      });

      this.authenticated = !res.status === 200     
      this.user = undefined
    },

    // Authentifiziert die Session
    async authenticate(){
      // Returnt true, wenn Session bereits authentifiziert ist
      if(this.authenticated) {
        return true
      } else {
        // Ansonsten wird versucht, Session zu authentifizieren
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
        }
  
        // Gibt Ergebnis der Server Anfrage zurück
        return this.authenticated
      }
    }
  }
})