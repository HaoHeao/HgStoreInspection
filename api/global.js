/* 全局接口 */
// const api = 'https://vipapi.hanguangbaihuo.com';
// const api = 'https://vipapi-cs.hanguangbaihuo.com';
const api = 'http://192.168.128.66:8081'

// 获取楼层列表
const getFloorlist = `${api}/HgInspection/api/baseinfo/floor/load`

export {
	// 获取楼层列表
	getFloorlist,
}
