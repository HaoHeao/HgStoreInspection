export default {
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
			// {
			// 	"pagePath": "whole",
			// 	"text": "全部",
			// 	"iconPath": "/static/tabbar/whole_select.png",
			// 	"selectedIconPath": "/static/tabbar/whole.png",
			// 	"index": 3
			// },
			// {
			// 	"pagePath": "mine",
			// 	"text": "我的",
			// 	"iconPath": "/static/tabbar/mine_select.png",
			// 	"selectedIconPath": "/static/tabbar/mine.png",
			// 	"index": 4
			// }
		],
		index: 0
	},
	mutations: {
		changeTabbar(state, index) {
			state.index = index
		}
	}
}
