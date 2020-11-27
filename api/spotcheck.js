import baseURL from './http_config.js'

/* 店面抽盘 */

// 获取专柜信息
// const spotcheck_getCounterInfo = `${baseURL}/HGERPAPI/StockSpotcheck/loadConerInfoByConerno`
const spotcheck_getCounterInfo = `${baseURL}/hgInspection/erpapi/StockSpotcheck/loadConerInfoByConerno`

// 获取商品信息
const spotcheck_getGoodsinfo = `${baseURL}/hgInspection/erpapi/StockSpotcheck/ScanLoadGoodsInfo`

// 提交抽盘信息
const spotcheck_save = `${baseURL}/hgInspection/erpapi/StockSpotcheck/save`

// 首页查询列表
const spotcheck_search = `${baseURL}/hgInspection/erpapi/StockSpotcheck/queryStorkCheckList`

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
