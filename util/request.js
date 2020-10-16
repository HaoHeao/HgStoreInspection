/* 
 * request存储一些ajax请求 
 */

// const api = require('@/api/index.js').default
import store from '@/store'
import api from '@/api/index.js'
let getPlanFloorList = async () => {
	try {
		let data = await uni.request({
			method: 'GET',
			url: api.getFloorlist
		})
		let [err, success] = data
		console.log('计划巡检楼层请求成功------>>>', success)
		if (success.data.success) {
			store.state.plan.planAddQuestionFloorList = success.data.data.floor
		}
	} catch (e) {
		console.log(e)
	}
}
export {
	getPlanFloorList
}
