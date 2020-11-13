/* 计划巡检 */
// const api = 'https://vipapi.hanguangbaihuo.com';
const api = 'https://vipapi-cs.hanguangbaihuo.com';
// const api = 'http://192.168.128.66:8081'

// openid登录
// const layout_openidLogin = `${api}/hgInspection/storeapi/login/` //正式、测试
const layout_openidLogin = `${api}/hgInspection/storeapi/login/`

// 用户名密码登录
const layout_login = `${api}/hgInspection/storeapi/login`

// 请求消息列表数据
const layout_getMessageList = `${api}/hgInspection/storeapi/msg/all`

// 发送消息已阅读
const layout_sendMessageLooked = `${api}/hgInspection/storeapi/msg/view/save`

// 退出登录
const layout_logout = `${api}/hgInspection/storeapi/loginout/`

// 修改密码
const layout_changePassword = `${api}/hgInspection/storeapi/user/password/update`

// 修改手机号
const layout_changeIPhone = `${api}/hgInspection/storeapi/user/mobile/update`

export {
	// openid登录
	layout_openidLogin,
	// 用户名密码登录
	layout_login,
	// 请求消息列表数据
	layout_getMessageList,
	// 发送消息已阅读
	layout_sendMessageLooked,
	// 退出登录
	layout_logout,
	// 修改密码
	layout_changePassword,
	// 修改手机号
	layout_changeIPhone,
}
