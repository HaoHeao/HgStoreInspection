export default {
	namespaced: true,
	state: {
		tabbarList: [{
				"pagePath": "question",
				"text": "问题",
				"iconPath": "/static/tabbar/question_select.png",
				"selectedIconPath": "/static/tabbar/question.png",
				"index": 0
			},
			{
				"pagePath": "add",
				"index": 1
			},
			{
				"pagePath": "lately",
				"text": "发布",
				"iconPath": "/static/tabbar/lately_select.png",
				"selectedIconPath": "/static/tabbar/lately.png",
				"index": 2
			},
		],
		index: 0
	},
	mutations: {
		changeTabbar(state, index) {
			state.index = index
		}
	}
}
