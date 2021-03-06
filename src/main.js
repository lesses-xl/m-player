// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import Vueaxios from 'vue-axios'
import Music from './components/music'

Vue.config.productionTip = false

Vue.use(Vueaxios,axios)

new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
