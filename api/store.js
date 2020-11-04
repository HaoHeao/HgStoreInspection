/* 计划巡检 */
// const api = 'https://vipapi.hanguangbaihuo.com';
const api = 'https://vipapi-cs.hanguangbaihuo.com';
// const api = 'http://192.168.128.66:8081'

// 获取卖场巡检列表
// const store_getQuestonList = `${api}/hgInspection/storeapi/log/notice` //正式、测试
const store_getQuestonList = `${api}/hgInspection/storeapi/log/notice`

// 获取卖场巡检最近发布列表
const store_getQuestonNearList = `${api}/hgInspection/storeapi/log/near`

// 卖场巡检提交巡检
const store_submitQuestion = `${api}/hgInspection/storeapi/inspection/save`

// 卖场巡检获取巡检明细
const store_getQuestionDetail = `${api}/hgInspection/storeapi/inspection/load`

export {
	// 获取卖场巡检列表
	store_getQuestonList,
	// 获取卖场巡检最近发布列表
	store_getQuestonNearList,
	// 卖场巡检提交巡检
	store_submitQuestion,
	// 卖场巡检获取巡检明细
	store_getQuestionDetail,
}
