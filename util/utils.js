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

// 图片大小过滤
let imagesFilter = (arr) => {
	arr.forEach((item, index) => {
		if (item.size >= store.state.setting.updataImageSize) {
			uni.showToast({
				title: `上传图片不能大于 ${store.state.setting.updataImageSize/1024/1024}M`,
				icon: 'none',
				duration: 3000
			});
			arr.splice(index, 1)
		}
	})
	return arr
}

export {
	// 获取用户信息
	getUserInfo,
	// 图片大小过滤
	imagesFilter
}
