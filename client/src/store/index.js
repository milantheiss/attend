import {createStore} from 'vuex'
import createPersistedState from "vuex-persistedstate";
import auth from "./modules/auth";
import attendancelist from './modules/attendancelist';

// Create store
export default createStore({
  modules: {
    auth,
    attendancelist
  },
  plugins: [createPersistedState({paths: ['auth.user', 'auth.authenticated', 'auth.isAuthenticated']})],
});
