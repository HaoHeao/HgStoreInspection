import store from '@/store'

let getUserInfo = () => {
	if (store.state.setting.hasLogin && store.state.setting.userinfo) {
		return store.state.setting.userinfo
	} else {
		uni.reLaunch({
			url: '/layout/index/index'
		});
	}
}

export {
	// 获取用户信息
	getUserInfo
}
