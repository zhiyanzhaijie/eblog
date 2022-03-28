import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import router from './modules/routes'
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    router,
  },
})
