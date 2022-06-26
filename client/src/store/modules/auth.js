//import axios from "axios";

const state = {
  user: null,
  posts: null,
  test: "test"
};

const getters = {
  isAuthenticated: (state) => !!state.user,
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

  async LogIn({commit}, user) {
    //await axios.post("https://localhost/login", user);

    await fetch([process.env.VUE_APP_API_URL, "login"].join('/'), {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {'Content-type': 'application/json; charset=UTF-8'}
    })

    await commit("setUser", user.email);
  },

  async LogOut({ commit }) {
    let user = null;
    commit("logout", user);
  },
};

const mutations = {
  setUser(state, email) {
    state.user = email;
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
