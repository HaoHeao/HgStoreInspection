/* 全局接口 */
// const api = 'https://vipapi.hanguangbaihuo.com';
const api = 'https://vipapi-cs.hanguangbaihuo.com';
// const api = 'http://192.168.128.66:8081'


// 获取openId
const getOpenid = `${api}/hgInspection/wxadoc/onLogin`

// 获取楼层列表
// const getFloorlist = `${api}/HgInspection/api/baseinfo/floor/load` // 本地
// const getFloorlist = `${api}/hgInspection/storeapi/baseinfo/floor/load` // 测试/线上
const getFloorlist = `${api}/hgInspection/storeapi/baseinfo/floor/load`

// 解析导购工牌
const getSalerqrcodeInfo = `${api}/hgInspection/storeapi/plan/salerinfo`

// 获取部门列表
const getDeptList = `${api}/hgInspection/storeapi/baseinfo/deptlist`

// 获取人员列表
const getUserList = `${api}/hgInspection/storeapi/baseinfo/userlist`

// 图片上传
const uploadImage = `${api}/hgInspection/file/upload-picture`

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
