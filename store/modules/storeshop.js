export default {
	state: {
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
		}
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
