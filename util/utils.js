const moment = require('./moment');
const api = require('./api');
const request = require('./request');

// 卖场巡检系统请求部门列表
let getMarketDeptList = (that) => {
	request.getMarketDeptList().then(res => {
		let [err, suc] = res;
		let data = suc.data.data;
		if (err == null && suc.data.success) {
			console.log("卖场巡检部门列表获取成功：", err, suc);
			let deptlist = that.$store.state.market.marketDeptList;
			deptlist = data.deptlist;
			that.$store.commit("setMarketDeptList", deptlist);

			// 卖场巡检问题页条件
			let question = that.$store.state.market.filterQuestion;
			question.senddpetid = data.deptlist;
			that.$store.commit("setFilterQuestion", question);

			// 卖场巡检全部页条件
			// let all = that.$store.state.market.filterAll;
			// all.senddpetid = data.deptlist;
			// that.$store.commit("setFilterAll", all);

			// 卖场巡检最近页条件
			let near = that.$store.state.market.filterNear;
			near.senddpetid = data.deptlist;
			that.$store.commit("setFilterNear", near);

			// 卖场巡检添加页部门
			let departmentList = that.$store.state.market.addMarket.departmentList;
			departmentList = data.deptlist;
			that.$store.commit("setAddDepart", departmentList);

			// 计划巡检回复问题条件
			let planQuestionDeptSend = that.$store.state.plan.questionSend;
			planQuestionDeptSend = data.deptlist;
			that.$store.commit("setQuestionDeptSend", planQuestionDeptSend);

			// 计划巡检回复问题确认
			let planQuestionDeptSendConfirm = that.$store.state.plan.questionSendConfirm;
			planQuestionDeptSendConfirm = data.deptlist;
			that.$store.commit("setQuestionDeptSendConfirm", planQuestionDeptSendConfirm);

			// 计划巡检回复问题确认
			uni.setStorageSync('planQuestionDeptSendConfirm', data.deptlist);
		} else {
			uni.showToast({
				icon: "none",
				duration: 2000,
				title: "部门列表获取失败:" + err.errMsg
			})
		}
	})
}
// 卖场巡检系统请求人员列表
let getMarketUserList = (that) => {
	request.getMarketUserList().then(res => {
		let [err, suc] = res;
		let data = suc.data.data;
		if (err == null && suc.data.success) {
			console.log("卖场巡检人员列表获取成功：", err, suc);
			let userlist = that.$store.state.market.marketUserList;
			userlist = data;
			that.$store.commit("setMarketUserList", userlist);

			// 卖场巡检添加页人员
			let person = that.$store.state.market.addMarket.person;
			person = data;
			that.$store.commit("setAddPerson", person);

			// 计划巡检回复问题条件
			let planQuestionUserSend = that.$store.state.plan.questionSend.userlist;
			planQuestionUserSend = data;
			that.$store.commit("setQuestionUserSend", planQuestionUserSend);

			// 计划巡检回复问题确认
			let planQuestionUserSendConfirm = that.$store.state.plan.questionSend.userlist;
			planQuestionUserSendConfirm = data;
			that.$store.commit("setQuestionUserSendConfirm", planQuestionUserSendConfirm);

			// 计划巡检回复问题确认
			uni.setStorageSync('setQuestionUserSendConfirm', data);
		} else {
			uni.showToast({
				icon: "none",
				duration: 2000,
				title: "人员列表获取失败:" + err.errMsg
			})
		}
	})
}

// {
// 	that,
// 	type = true,
// 	count = 9,
// 	sizeType = ['original', 'compressed'],
// 	sourceType = ['camera', 'album'],
// 	option
// }
// 选择图片
let choiceImgList = () => {
	return uni.chooseImage({
		sizeType: ['original', 'compressed'],
		sourceType: ['camera', 'album'],
		count: 9,
	});
};

// 上传图片
let addImg = (_this) => {
	uni.chooseImage({
		// sizeType: ['original', 'compressed'],
		sizeType: ['compressed'],
		sourceType: ['camera', 'album'],
		count: 9,
		success: function(data) {
			let imgList = data.tempFiles;
			let num = imgList.length;
			_this.upImgIndex = imgList.length;
			uni.showLoading({
				title: '上传图片中...'
			})
			console.log(_this.btnClick)
			_this.btnClick = false;
			for (let index in imgList) {
				uni.uploadFile({
					url: request.upImg,
					filePath: imgList[index].path,
					name: 'file',
					method: "POST",
					success: (data) => {
						console.log("图片添加完结果:", data)
						data.data = JSON.parse(data.data)
						if (data.data.code == 0) {
							let obj = {
								path: data.data.data.url,
								size: data.data.data.size
							}
							_this.upImgList.push(obj)
							_this.upImgIndex = _this.upImgIndex - 1;
						} else {
							uni.showToast({
								icon: "none",
								title: data.data.msg
							})
							uni.hideLoading()
						}
						num = num - 1;
						if (num == 0) {
							uni.hideLoading();
							_this.btnClick = true;
							return;
						}
					},
					fail: (err) => {
						uni.hideLoading();
						console.log("图片上传失败", err)
						uni.showToast({
							icon: "none",
							title: '图片上传失败'
						})
						_this.btnClick = true;
						return;
					}
				})
			}
		},
		fail: function(err) {
			uni.hideLoading();
			_this.btnClick = true;
			uni.showToast({
				icon: "none",
				title: '未成功添加图片'
			})
			return;
		}
	})
}

// 删除上传图片
let delImg = (index, _this) => {
	let arr = _this.upImgList;
	arr.splice(index, 1);
	_this.upImgList = arr;
}

// 查看图片
let seePicture = (list, index) => {
	let data = [];
	for (let item of list) {
		if (item.imgurl) {
			data.push(item.imgurl)
		} else if (item.path) {
			data.push(item.path)
		}
	}
	// 预览图片
	uni.previewImage({
		current: index,
		urls: data
	});
}

// 时间大小补充
let timeMake = (date) => {
	date < 10 ? date = '0' + date : date;
	return date;
}

// 时间日期格式字符化过滤
let timerDateString = (data, _this) => {
	// 补差额
	for (let item of data) {
		let data = new Date(item.insertdate);
		// 时间戳对比
		let value = (new Date().getTime() - data.getTime()) / 1000;
		// 今天已过去的时间
		let nextDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); //后一天
		let nextDateTime = new Date(new Date(nextDate).getFullYear() + '-' + (new Date(nextDate).getMonth() + 1) + '-' + new Date(
			nextDate).getDate() + ' 00:00:00')
		let passAwayTime = 86400 - ((nextDateTime.getTime() - new Date().getTime()) / 1000);
		// 年简化

		if (value < passAwayTime && new Date().getDate() == data.getDate()) {
			item.insertdate1 = "今天 " + timeMake(data.getHours()) + ":" + timeMake(data.getMinutes());
		} else if (value > passAwayTime && value < (passAwayTime + 86400)) {
			item.insertdate1 = "昨天 " + timeMake(data.getHours()) + ":" + timeMake(data.getMinutes());
		} else if (new Date().getFullYear() == data.getFullYear()) {
			item.insertdate1 = timeMake(data.getMonth() + 1) + '-' + timeMake(data.getDate()) + ' ' + timeMake(
				data.getHours()) + ":" + timeMake(data.getMinutes())
		} else {
			item.insertdate1 = item.insertdate;
		}
	}
}


// 获取用户权限
let getModelList = (usernumber, that) => {
	api.getModelPower({
			usernumber
		})
		.then(data => {
			let [err, res] = data;
			console.log("用户权限获取", err, res)
			if (err == null) {
				that.$store.commit("setUserModel", res.data.data.menulist);
			} else {
				uni.showModal({
					title: "权限获取失败,请检查网络!"
				})
			}
		})
}

export {
	api,
	request,
	moment,
	getMarketDeptList,
	getMarketUserList,
	// 选择图片
	choiceImgList,
	// 上传图片
	addImg,
	// 删除图片
	delImg,
	// 查看图片
	seePicture,
	// 时间日期格式字符化过滤
	timerDateString,
	getModelList
}
