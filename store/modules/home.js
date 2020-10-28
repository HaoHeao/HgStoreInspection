export default {
	namespaced: true,
	state: {
		tabbar: [{
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
		tabbarIndex: 0
	}
}
