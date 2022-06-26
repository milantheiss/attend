import {createStore} from 'vuex'
import createPersistedState from "vuex-persistedstate";
import auth from "./modules/auth";

// Create store
export default createStore({
  modules: {
    auth,
  },
  plugins: [createPersistedState()],
});
