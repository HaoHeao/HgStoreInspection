// 卖场巡检参数设置
let config = {

}

export default {
	state: {
		modelList:[]
	},
	mutations: {
		setUserModel(state, data) {
			state.modelList = data
		}
	}
}