import baseURL from './http_config.js'

/* 全局接口 */
// 获取openId
const getOpenid = `${baseURL}/hgInspection/wxadoc/onLogin`

// 获取楼层列表
// const getFloorlist = `${baseURL}/HgInspection/api/baseinfo/floor/load` // 本地
// const getFloorlist = `${baseURL}/hgInspection/storeapi/baseinfo/floor/load` // 测试/线上
const getFloorlist = `${baseURL}/hgInspection/storeapi/baseinfo/floor/load`

// 解析导购工牌
const getSalerqrcodeInfo = `${baseURL}/hgInspection/storeapi/plan/salerinfo`

// 获取部门列表
const getDeptList = `${baseURL}/hgInspection/storeapi/baseinfo/deptlist`

// 获取人员列表
const getUserList = `${baseURL}/hgInspection/storeapi/baseinfo/userlist`

// 图片上传
const uploadImage = `${baseURL}/hgInspection/file/upload-picture`

export {
	// 获取openId
	getOpenid,
	// 获取楼层列表
	getFloorlist,
	// 解析导购工牌
	getSalerqrcodeInfo,
	// 获取部门列表
	getDeptList,
	// 获取人员列表
	getUserList,
	// 图片上传
	uploadImage,
}
