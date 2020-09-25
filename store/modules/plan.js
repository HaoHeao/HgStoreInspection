export default {
	state: {
		tabbarIndex: 0,
		tabbarList: [{
			pageIndex: 0,
			iconPath: 'rectify.svg',
			selectedIconPath: 'rectify_active.svg',
			text: '整改'
		}, {
			pageIndex: 1,
			iconPath: 'review.svg',
			selectedIconPath: 'review_active.svg',
			text: '复核'
		}],
		pagesize: 20,
		// 添加项目问题
		questionSend: {
			deptlist: [],
			userlist: []
		},
		// 确认人和部门
		questionSendConfirm: {
			deptlist: [],
			userlist: []
		},
	},
	mutations: {
		setQuestionSend(state, data) {
			state.questionSend = data
		},
		setQuestionDeptSend(state, data) {
			state.questionSend.deptlist = data;
		},
		setQuestionUserSend(state, data) {
			state.questionSend.userlist = data;
		},
		setQuestionSendConfirm(state, data) {
			state.questionSendConfirm = data
		},
		setQuestionDeptSendConfirm(state, data) {
			state.questionSendConfirm.deptlist = data;
		},
		setQuestionUserSendConfirm(state, data) {
			state.questionSendConfirm.userlist = data;
		},
	}
}
