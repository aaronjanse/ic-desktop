import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.filter('formatCourseName', require('@/../util/helpers').formatCourseName)
Vue.filter('formatTeacherName', require('@/../util/helpers').formatTeacherName)
Vue.filter('formatAsPercentage', require('@/../util/helpers').formatAsPercentage)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
