/* 店面抽盘 */
// const api = 'https://vipapi.hanguangbaihuo.com';
const api = 'https://vipapi-cs.hanguangbaihuo.com';
// const api = 'http://192.168.128.66:8081'

// 获取专柜信息
// const spotcheck_getCounterInfo = `${api}/HGERPAPI/StockSpotcheck/loadConerInfoByConerno`
const spotcheck_getCounterInfo = `${api}/hgInspection/erpapi/StockSpotcheck/loadConerInfoByConerno`

// 获取商品信息
const spotcheck_getGoodsinfo = `${api}/hgInspection/erpapi/StockSpotcheck/ScanLoadGoodsInfo`

// 提交抽盘信息
const spotcheck_save = `${api}/hgInspection/erpapi/StockSpotcheck/save`

// 首页查询列表
const spotcheck_search = `${api}/hgInspection/erpapi/StockSpotcheck/queryStorkCheckList`

export {
	// 获取专柜信息
	spotcheck_getCounterInfo,
	// 获取商品信息
	spotcheck_getGoodsinfo,
	// 提交抽盘信息
	spotcheck_save,
	// 首页查询列表
	spotcheck_search
}
