import Vue from 'vue'
import App from './App'

// Vuex
import store from './store'
Vue.prototype.$store = store;

// date操作
const moment = require('@/util/moment.js');
Vue.prototype.moment = moment;

Vue.config.productionTip = false;
App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount();
