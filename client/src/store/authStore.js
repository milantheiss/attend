import { defineStore } from "pinia";

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
      let res = (await fetch([process.env.VUE_APP_API_URL, "login"].join('/'), {
        method: 'POST',
        body: JSON.stringify(user_credentials),
        headers: {'Content-type': 'application/json; charset=UTF-8'},
        credentials: 'include',
        mode: 'cors'
      }));
  
      this.authenticated = res.status === 200
      res = await res.json()
  
     this.user = {username: res.username, user_id: res.user_id}
    },
  
    async logOut() {
      //let user = null;
      const res = await fetch([process.env.VUE_APP_API_URL, "logout"].join('/'), {
        method: 'POST',
        headers: {'Content-type': 'application/json; charset=UTF-8'},
        credentials: 'include',
        mode: 'cors'
      })
      this.authenticated = !res.status === 200
      this.user = undefined
    },

    async authenticate(){
      const res = (await fetch([process.env.VUE_APP_API_URL, 'authenticate'].join('/'), {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        credentials: 'include',
        mode: 'cors'
      }))

      this.authenticated = res.status === 200
      return res.status === 200
    }
  }
})