import Vue from "vue"
import Vuex from "vuex"

import home from "./modules/home.js"
import tabbar from "./modules/tabbar.js"
import market from "./modules/market.js"
import plan from "./modules/plan.js"
import storeshop from "./modules/storeshop.js"
import metting from "./modules/metting.js"
import setting from "./modules/setting.js"
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		
	},
	modules: {
		home,
		tabbar,
		market,
		plan,
		storeshop,
		metting,
		setting
	}
});
export default store;
