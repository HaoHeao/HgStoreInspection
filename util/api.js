// 汉光测试
// const root = 'https://vipapi-cs.hanguangbaihuo.com/hgInspection/'
// const api = 'https://vipapi-cs.hanguangbaihuo.com/hgInspection/storeapi/'

// 汉光正式
const root = 'https://vipapi.hanguangbaihuo.com/hgInspection/'
const api = 'https://vipapi.hanguangbaihuo.com/hgInspection/storeapi/'

// const root = 'https://mobile.huaweihotel.com/hwhoteladoc/'
// const api = 'https://mobile.huaweihotel.com/hwhoteladoc/storeapi/'

// const resRoot = `https://mobile.huaweihotel.com/hwhoteladoc/`
// const res = `https://mobile.huaweihotel.com/hwhoteladoc/storeapi`

// 华威正式 - 线上
// const root = 'https://zh.bjhwa.com/hwInspection/'
// const api = 'https://zh.bjhwa.com/hwInspection/storeapi/'

// 华威正式
// const root = 'https://mobile.huaweihotel.com/hwInspection/'
// const api = 'https://mobile.huaweihotel.com/hwInspection/storeapi/'


// 本地
// const root = 'http://192.168.128.66:8080/hgInspection/'
// const api = 'http://192.168.128.66:8080/hgInspection/api/'



// ---------------------------------------登录--------------------------------------------------------
// 获取openId
// const getOpenId = `${root}wxadoc/onLogin`
const getOpenId = (option) => {
    return uni.request({
        url: `${root}wxadoc/onLogin?code=${option.code}&appId=${option.appId}`,
        method: "POST"
    })
}

// 登陆
// const login = `${api}login`
const login = (option) => {
    return uni.request({
        url: `${api}login`,
        data: {
            loginid: option.loginid,
            pwd: option.pwd,
            openid: option.openid
        },
        method: "GET"
    })
}

// 静默登陆
// const loginOpenid = `${api}login/`
const loginOpenid = (option) => {
    return uni.request({
        url: `${api}login/${option.openId}`,
        method: "GET"
    })
}

// 登出
// const loginout = `${api}loginout`
const loginout = (option) => {
    return uni.request({
        url: `${api}loginout/${option.openId}`,
        method: "GET"
    })
}


// ---------------------------------------用户操作----------------------------------------------------
// 修改手机号
// const revisePhoneNumber = `${api}user/mobile/update`
const revisePhoneNumber = (option) => {
    return uni.request({
        url: `${api}user/mobile/update`,
        method: "POST",
        data: {
            userid: option.userid,
            oldmobile: option.oldmobile,
            newmobile: option.newmobile
        }
    })
}

// 修改密码
// const revisePwd = `${api}user/password/update`
const revisePwd = (option) => {
    return uni.request({
        url: `${api}user/password/update`,
        method: "POST",
        data: {
            userid: option.userid,
            oldpwd: option.oldpwd,
            newpwd: option.newpwd
        }
    })
}

// 获取我的信息列表
const getMsg = (option) => {
    return uni.request({
        url: `${api}msg/all`,
        method: "POST",
        data: option
    })
}

// 信息查看确认
const setMsgSee = (data) => {
	return uni.request({
		url: `${api}msg/view/save`,
		method: "POST",
		data
	})
}

// =================获取权限==========================
const getModelPower = (option) => {
    return uni.request({
        url: `${api}menu/load/usernumber`,
        method: "GET",
		data:option
    })
};




export {
    root,
    api,
    // 获取openId
    getOpenId,
    // 登陆
    login,
    // 静默登陆
    loginOpenid,
    // 登出
    loginout,
    // 修改手机号码
    revisePhoneNumber,
    // 修改密码
    revisePwd,
	// 获取我的信息列表
	getMsg,
	// 信息查看确认
	setMsgSee,
	// 获取用户权限
	getModelPower,
}
