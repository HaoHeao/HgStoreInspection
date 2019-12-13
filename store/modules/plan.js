const moment = require('@/util/moment.js');
// 卖场巡检参数设置
let config = {

}

export default {
	state: {
		pagesize: 20,
		// 添加项目问题
		questionSend: {
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
	}
}
