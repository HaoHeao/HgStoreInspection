const api = require('./api');
const request = require('./request/index');

// 时间大小补充
let timeMake = (date) => {
	date < 10 ? date = '0' + date : date;
	return date;
}

let getUserInfo = (_uni) => {
	return _uni.getStorageSync('userinfo');
}

export {
	api,
	request,
	// 获取用户信息
	getUserInfo
}
