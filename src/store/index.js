import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import home from './Mudules/home'
export default new Vuex.Store({
  modules: {
    home
  }
})
