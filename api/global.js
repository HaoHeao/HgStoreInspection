/* 全局接口 */
// const api = 'https://vipapi.hanguangbaihuo.com';
const api = 'https://vipapi-cs.hanguangbaihuo.com';
// const api = 'http://192.168.128.66:8081'

// 获取楼层列表
// const getFloorlist = `${api}/HgInspection/api/baseinfo/floor/load` // 本地
// const getFloorlist = `${api}/hgInspection/storeapi/baseinfo/floor/load` // 测试/线上
const getFloorlist = `${api}/hgInspection/storeapi/baseinfo/floor/load`

// 解析导购工牌
const getSalerqrcodeInfo = `${api}/hgInspection/storeapi/plan/salerinfo`

export {
	// 获取楼层列表
	getFloorlist,
	// 解析导购工牌
	getSalerqrcodeInfo,
}
