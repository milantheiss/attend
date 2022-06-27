//import axios from "axios";

const state = {
  user: null,
  authenticated: false
};

const getters = {
  isAuthenticated: (state) => state.authenticated,
  StateUser: (state) => state.user,
};

const actions = {
  // async Register({dispatch}, form) {
  //   await axios.post('register', form)
  //   let UserForm = new FormData()
  //   UserForm.append('username', form.username)
  //   UserForm.append('password', form.password)
  //   await dispatch('LogIn', UserForm)
  // },

  async LogIn({commit}, user_credentials) {
    let res = (await fetch([process.env.VUE_APP_API_URL, "login"].join('/'), {
      method: 'POST',
      body: JSON.stringify(user_credentials),
      headers: {'Content-type': 'application/json; charset=UTF-8'},
      credentials: 'include',
      mode: 'cors'
    }));
    
    await commit('setAuthenticated', res.status === 200)
    res = await res.json()
    await commit("setUser", {username: res.username, user_id: res.user_id});
  },

  async LogOut({ commit }) {
    //let user = null;
    const res = await fetch([process.env.VUE_APP_API_URL, "logout"].join('/'), {
      method: 'POST',
      headers: {'Content-type': 'application/json; charset=UTF-8'},
      credentials: 'include',
      mode: 'cors'
    })
    await commit('setAuthenticated', !res.status === 200)
    await commit("setUser", undefined);
  },
};

const mutations = {
  setUser(state, email) {
    state.user = email;
  },

  setAuthenticated(state, bool) {
    state.authenticated = bool
  },

  logout(state, user) {
    state.user = user;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
