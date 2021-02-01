const setting = {
	namespaced: true,
	state: {
		version: "0.9.6",
		lastmodify: "2020/12/31",
		thismodify: "2021/02/01",
		updataRemark: '【新增】卖场检查',
		systemName: "北京汉光巡检系统",
		appId: "wx252743e71090a061",
		openId: '',
		// 是否登录
		hasLogin: false,
		userinfo: {},

		// 上传图片限制大小 单位：B
		updataImageSize: 1048576*10, //1M=1048576
		// OSS下载规则
		OSSDownload: "?x-oss-process=image/resize,m_mfit,h_120,w_120",
		// swiper是否采用衔接滑动，即播放到末尾后重新回到开头
		circular: true,
		// swiper滑动动画时长
		swiperDuration: '100',
		// loadmore加载时图标样式
		iconType: 'circle',
		// loadmore各个状态的文本
		loadText: {
			loadmore: '没有更多内容',
			loading: '努力加载中',
			nomore: '没有更多内容'
		},
		// loadmore问题大小
		loadmoreFontSize: '24',
		// loadmore高度
		loadmoreHeight: '160',
		// loadmore状态为nomore时内容是否显示为一个'·'
		isDot: false,
		// 返回顶部按钮
		customStyle: {
			boxShadow: '0 1px 8px -4rpx rgba(0,0,0,0.3)',
			bottom: '100rpx',
			zoom: '1.2',
			background: '#fff',
			opacity: '0.8'
		},
		// 返回顶部按钮图标样式
		iconStyle: {
			fontSize: '32rpx',
			color: '#2979ff',
		},
		// 安卓/IOS点击标题scroll-view返回顶部
		enableBackToTop: true
	},
}

export default setting
