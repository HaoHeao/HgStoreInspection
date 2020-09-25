/* 计划巡检 */
// const api = 'https://vipapi.hanguangbaihuo.com';
// const api = 'https://vipapi-cs.hanguangbaihuo.com';
const api = 'http://192.168.128.66:8081'

// 待整改
// const plan_getQuestions = `${api}/HWOAAPINEW/AssessmentInfo/questions/query`
const plan_questionWait = `${api}/HgInspection/api/plan/load/question/wait`

// 已整改
const plan_questionCompleted = `${api}/HgInspection/api/plan/load/question/adjusted`

// 已完成
const plan_questionFinish = `${api}/HgInspection/api/plan/load/question/finish`

// 请求筛选条件
const plan_getFilterData = `${api}/HgInspection/api/plan/load/question/selectitem`

export {
	// 待整改
	plan_questionWait,
	// 已整改
	plan_questionCompleted,
	// 已完成
	plan_questionFinish,
	// 请求筛选条件
	plan_getFilterData,
}
