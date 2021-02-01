import baseURL from './http_config.js'
// let baseURL = 'https://vipapi-cs.hanguangbaihuo.com';
/* 卖场检查 */

// let baseURL = 'http://192.168.128.66:8081';
// // 获取检查列表
// const storeinspection_getDataList = `${baseURL}/HgInspection/api/orgcheck/load`
// // const storeinspection_getRoomList = `${baseURL}/MeetingRoom/api/meetingroom/queryAll`
// // 获取检查明细
// const storeinspection_getDetail = `${baseURL}/HgInspection/api/orgcheck/load/`
// // 提交
// const storeinspection_submit = `${baseURL}/HgInspection/api/orgcheck/save`
// // 修改
// const storeinspection_updata = `${baseURL}/HgInspection/api/orgcheck/update`
// // 撤回
// const storeinspection_withdraw = `${baseURL}/HgInspection/api/orgcheck/del`
// // 删除图片
// const storeinspection_delImage = `${baseURL}/HgInspection/api/orgcheck/image/del`
// // 更新图片
// const storeinspection_modifyImage = `${baseURL}/HgInspection/api/orgcheck/image/save`


// 获取检查列表
const storeinspection_getDataList = `${baseURL}/hgInspection/storeapi/orgcheck/load`
// 获取检查明细
const storeinspection_getDetail = `${baseURL}/hgInspection/storeapi/orgcheck/load/`
// 提交
const storeinspection_submit = `${baseURL}/hgInspection/storeapi/orgcheck/save`
// 修改
const storeinspection_updata = `${baseURL}/hgInspection/storeapi/orgcheck/update`
// 撤回
const storeinspection_withdraw = `${baseURL}/hgInspection/storeapi/orgcheck/del`
// 删除图片
const storeinspection_delImage = `${baseURL}/hgInspection/storeapi/orgcheck/image/del`
// 更新图片
const storeinspection_modifyImage = `${baseURL}/hgInspection/storeapi/orgcheck/image/save`

export {
	// 获取检查列表
	storeinspection_getDataList,
	// 获取检查明细
	storeinspection_getDetail,
	// 提交
	storeinspection_submit,
	// 修改
	storeinspection_updata,
	// 撤回
	storeinspection_withdraw,
	// 删除图片
	storeinspection_delImage,
	// 更新图片
	storeinspection_modifyImage,
}
