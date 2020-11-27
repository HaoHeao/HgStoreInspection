import baseURL from './http_config.js'

/* 计划巡检 */

// openid登录
// const layout_openidLogin = `${baseURL}/hgInspection/storeapi/login/` //正式、测试
const layout_openidLogin = `${baseURL}/hgInspection/storeapi/login/`

// 用户名密码登录
const layout_login = `${baseURL}/hgInspection/storeapi/login`

// 请求消息列表数据
const layout_getMessageList = `${baseURL}/hgInspection/storeapi/msg/all`

// 发送消息已阅读
const layout_sendMessageLooked = `${baseURL}/hgInspection/storeapi/msg/view/save`

// 退出登录
const layout_logout = `${baseURL}/hgInspection/storeapi/loginout/`

// 修改密码
const layout_changePassword = `${baseURL}/hgInspection/storeapi/user/password/update`

// 修改手机号
const layout_changeIPhone = `${baseURL}/hgInspection/storeapi/user/mobile/update`

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
