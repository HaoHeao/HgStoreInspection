/* 店面抽盘 */
const api = 'https://vipapi.hanguangbaihuo.com';
// const api = 'https://vipapi-cs.hanguangbaihuo.com';
// const api = 'http://192.168.128.66:8081'

// 获取考题信息
// const assessment_getQuestions = `${api}/HWOAAPINEW/AssessmentInfo/questions/query`
const assessment_getQuestions = `${api}/HWOAAPINEW/AssessmentInfo/questions/query`

// 获取考题对象信息
const assessment_getQuestioninfo = `${api}/HWOAAPINEW/AssessmentInfo/questions/load`

export {
	// 获取考题信息
	assessment_getQuestions,
	// 获取考题对象信息
	assessment_getQuestioninfo
}
