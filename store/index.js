import Vue from "vue"
import Vuex from "vuex"
import tabbar from "./modules/tabbar.js"
import market from "./modules/market.js"
import plan from "./modules/plan.js"
import usermodel from "./userModel.js"
import metting from "./modules/metting.js"
import setting from "./modules/setting.js"
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		// 是否测试
		test: true,
		homeTabbar: [{
				"pagePath": "msg",
				"text": "消息",
				"iconPath": "/static/tabbar/msg_select.png",
				"selectedIconPath": "/static/tabbar/msg.png",
				"index": 0
			},
			{
				"pagePath": "work",
				"text": "工作",
				"iconPath": "/static/tabbar/work_select.png",
				"selectedIconPath": "/static/tabbar/work.png",
				"index": 1
			},
			{
				"pagePath": "mine",
				"text": "我的",
				"iconPath": "/static/tabbar/homeMine_select.png",
				"selectedIconPath": "/static/tabbar/homeMine.png",
				"index": 2
			}
		],
		homeIndex: 0
	},
	mutations: {
		changeHomeTabbar(state, index) {
			state.homeIndex = index
		}
	},
	modules: {
		tabbar,
		market,
		plan,
		usermodel,
		metting,
		setting
	}
});
export default store;
