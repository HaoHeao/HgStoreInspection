<template>
	<view class="container">
		<view class="head">
			<view class="left"></view>
			<view class="center">
				<view class="btn-list">
					<view :class="['item', current == 0?'active':'']" @click="!filterLoading?current = 0:''">待复核</view>
					<view :class="['item', current == 1?'active':'']" @click="!filterLoading?current = 1:''">已完成</view>
				</view>
			</view>
			<view class="right">
				<view class="filter" @click="filterLoading?($refs['popup'].close(),filterLoading = false):($refs['popup'].open(),filterLoading = true)">
					<image src="@/static/icon/filter.svg" mode="widthFix" class="icon"></image>
					筛选
				</view>
			</view>
		</view>
		<view class="main">
			<swiper class="swiper" circular="true" :autoplay="false" duration="100" :current="current" @change="swiperChange">
				<swiper-item class="swiper-item">
					<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown" @onLoadMore="onLoadMore">
						<block v-if="reviewData.length">
							<view class="length">共 {{reviewDataInfo}} 条</view>
							<view class="item" v-for="(item,index) of reviewData" :key="index" @click="lookReplay(item)">
								<view class="question">
									<view class="txt">{{item.deptname}}{{` - ${item.username}`}}</view>
									<view class="date">{{item.insertdate}}</view>
								</view>
								<view class="info-view">
									<view class="title">问题描述</view>
									<view class="content">{{item.question}}</view>
								</view>
								<view class="info-view">
									<view class="title">楼层</view>
									<view class="content">{{item.other1?item.other1:'未选择'}}</view>
								</view>
								<view class="info-view">
									<view class="title">位置</view>
									<view class="content">{{item.inspectionplace}}</view>
								</view>
								<view class="img-list" v-if="item.planinspectionquestionimg.length">
									<view class="img-view" v-for="(itm,ind) of item.planinspectionquestionimg" :key="ind" @click.stop="utils.seePicture(item.planinspectionquestionimg,ind)">
										<image class="icon" :src="itm.imgurl" mode="widthFix"></image>
									</view>
								</view>
								<view class="info">
									<view class="num active">{{item.planinspectionfeedback.length?`${item.planinspectionfeedback.length}条`:'暂未整改'}}</view>
									<view class="btn-list">
										<view class="btn" v-if="item.status == 1" @tap.stop="review(item)">复核</view>
									</view>
								</view>
							</view>
							<view class="null-data">
								<view class="text">以上为全部记录</view>
								<view class="line"></view>
							</view>
						</block>
						<view class="no-data-view fadeIn" v-if="!reviewData.length">
							<view class="center">
								<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
								<view class="tip">暂无已整改记录</view>
							</view>
						</view>
					</haoheao-scroll>
				</swiper-item>
				<swiper-item class="swiper-item">
					<haoheao-scroll class="haoheao-scroll" ref="scroll" @onPullDown="onPullDown" @onLoadMore="onLoadMore">
						<block v-if="completedData.length">
							<view class="length">共 {{completedDataInfo}} 条</view>
							<view class="item" v-for="(item,index) of completedData" :key="index" @click="lookReplay(item)">
								<view class="question">
									<view class="txt">{{item.deptname}}{{` - ${item.username}`}}</view>
									<view class="date">{{item.insertdate}}</view>
								</view>
								<view class="info-view">
									<view class="title">问题描述</view>
									<view class="content">{{item.question}}</view>
								</view>
								<view class="info-view">
									<view class="title">楼层</view>
									<view class="content">{{item.other1?item.other1:'未选择'}}</view>
								</view>
								<view class="info-view">
									<view class="title">位置</view>
									<view class="content">{{item.inspectionplace}}</view>
								</view>
								<view class="img-list" v-if="item.planinspectionquestionimg.length">
									<view class="img-view" v-for="(itm,ind) of item.planinspectionquestionimg" :key="ind" @click.stop="utils.seePicture(item.planinspectionquestionimg,ind)">
										<image class="icon" :src="itm.imgurl" mode="widthFix"></image>
									</view>
								</view>
								<view class="info">
									<view class="num active">{{item.planinspectionfeedback.length?`${item.planinspectionfeedback.length}条`:'暂未整改'}}</view>
									<view class="btn-list">
										<view class="btn" v-if="item.status == 100">查看</view>
									</view>
								</view>
							</view>
							<view class="null-data">
								<view class="text">以上为全部记录</view>
								<view class="line"></view>
							</view>
						</block>
						<view class="no-data-view fadeIn" v-if="!completedData.length">
							<view class="center">
								<image src="@/static/icon/no-data.svg" mode="widthFix" class="icon"></image>
								<view class="tip">暂无已整改记录</view>
							</view>
						</view>
					</haoheao-scroll>
				</swiper-item>
			</swiper>
		</view>
		<uni-popup ref="popup" type="center" class="filter-popup">
			<view class="popup filter">
				<view class="content">
					<view class="title">日期段</view>
					<view class="item date">
						<picker id="start" class="time" mode="date" :value="date[0]" :end="moment(new Date()).format('YYYY-MM-DD')"
						 @change="bindDateChange">{{date[0]}}</picker>
						<view class="txt">至</view>
						<picker id="end" class="time" mode="date" :value="date[1]" :end="moment(new Date()).format('YYYY-MM-DD')" @change="bindDateChange">{{date[1]}}</picker>
					</view>
					<view class="title">楼层</view>
					<view class="item floor">
						<view :class="['view fadeIn',floor == 'all'?'active':'']" @click="selectFloor({floorvalue:'all'})">全部</view>
						<view :class="['view fadeIn',floor === item.floorvalue?'active':'']" v-for="(item,index) of floorList" :key="index"
						 @click="selectFloor(item)">{{item.floorname}}</view>
					</view>
					<view class="title">主题</view>
					<view class="item theme">
						<view :class="['view fadeIn', title == '0'?'active':'']" @click="selectPlan({planid:'0'})">全部</view>
						<view :class="['view fadeIn', title == item.planid?'active':'']" v-for="(item,index) of titleList" :key="index"
						 @click="selectPlan(item)">{{item.title}}</view>
					</view>
				</view>
				<view class="btn-list">
					<view class="btn reset" @click="popupReset()">重置</view>
					<view class="btn search" @click="getQuestionReset(),getQuestion()">查询</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="review" type="bottom">
			<view class="popup review">
				<view class="title">
					<text class="content">复核问题</text>
					<view class="close" @click="$refs['review'].close()">关闭</view>
				</view>
				<view class="textarea-view">
					<textarea class="remark" v-model="remark" placeholder-style="color:#B6C6D6" cursor-spacing="180" placeholder="不通过请填写原因"
					 fixed auto-height />
					</view>
				<view class="bottom-control">
					<view class="content">
						<view class="item del" @click="confirmQuestion(false)">
							<image src="@/static/images/del_white.svg" mode="widthFix" class="icon"></image>
							不通过
						</view>
						<view class="item" @click="confirmQuestion(true)">
							<image src="@/static/images/del_white.svg" mode="widthFix" class="icon"></image>
							通过
						</view>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				pagesize: 20,
				current: 0,
				// 待复核
				reviewData: [],
				reviewDataInfo: '',
				reviewPageindex: 1,
				reviewNum: '',
				// 已完成
				completedData: [],
				completedDataInfo: '',
				completedPageindex: 1,
				completedNum: '',
				// 筛选loading
				filterLoading: false,
				// 已完成loading
				computedLoading: false,
				// 待复核loading
				reviewLoading: false,
				// 时间
				date: [],
				// 楼层
				floorList: [],
				floor: 'all',
				// 主题
				titleList: [],
				title: '0',
				
				// 复核原因
				focusReviewId:'',
				remark:''
			}
		},
		computed:{
			userinfo(){
				return this.utils.getUserInfo(uni)
			}
		},
		methods: {
			async onPullDown(done) {
				this.getQuestionReset()
				await this.getQuestion()
				done()
			},
			// 点击复核
			review(item){
				this.$refs['review'].open()
				this.remark = ''
				this.focusReviewId = item.planquestionid
				console.log(item)
			},
			async confirmQuestion(type) {
				if(!type && !this.remark){
					uni.showToast({
						icon: "none",
						title: '复核不通过请填写原因'
					});
					return
				}
				try {
					uni.showNavigationBarLoading()
					let data = await uni.request({
						method: 'POST',
						url: this.api.plan_submitInspectionReview,
						data:{
							usernumber: this.userinfo.usernumber,
							planquestionid: this.focusReviewId,
							confirmtype: type?1:0,
							remark: type?'复核通过':this.remark
						}
					})
					uni.hideNavigationBarLoading()
					let [err, success] = data
					console.log('复核完成--->>>',err, success)
					if (!err && success.data.success) {
						this.tabbarBind()
						this.$refs['review'].close()
					}else{
						uni.showToast({
							title: err?err:success.data.errmsg,
							icon: 'none',
							duration:3000
						});
					}
				} catch (e) {
					console.log(e)
					uni.hideNavigationBarLoading()
				}
			},
			// 进入反馈
			lookReplay(item) {
				console.log('进入反馈', item);
				if (item.status == 0) {
					// 进入并回复
					uni.navigateTo({
						url: '/pages-plan/viewQuestion/viewQuestion?data=' + JSON.stringify(item) + '&id=' + item.planid + '&reply_id=' +
							item.planquestionid
					})
				} else if (item.status == 1 || item.status == 100) {
					// 进入查看不能回复
					uni.navigateTo({
						url: '/pages-plan/viewQuestion/viewQuestion?data=' + JSON.stringify(item) + '&id=' + item.planid + '&reply_id=' +
							item.planquestionid
					})
				}
			},
			selectFloor(data) {
				this.floor === data.floorvalue ? this.floor = 'all' : this.floor = data.floorvalue;
			},
			selectPlan(data) {
				this.title === data.planid ? this.title = '0' : this.title = data.planid;
			},
			async onLoadMore(e) {
				if (this.current == 0) {
					if (!(this.reviewPageindex <= this.reviewNum && this.reviewNum != 1)) {
						return
					}
				} else if (this.current == 1) {
					if (!(this.completedPageindex <= this.completedNum && this.completedNum != 1)) {
						return
					}
				}
				console.log('加载更多------>>>')
				await this.getQuestion()
			},
			swiperChange(e) {
				this.current = e.target.current
				this.tabbarBind()
			},
			async bindDateChange(e) {
				e.target.id == 'start' ? this.date[0] = e.target.value : e.target.id == 'end' ? this.date[1] = e.target.value : ''
				await this.getFilterData()
				this.floor = 'all'
				this.title = '0'
				this.$forceUpdate()
			},
			async popupReset() {
				this.date = [this.moment(new Date(new Date().getTime() - 365 * 24 * 60 * 60 * 1000)).format("YYYY-MM-DD"), this.moment()
					.format("YYYY-MM-DD")
				]
				await this.getFilterData()
				this.floor = 'all'
				this.title = '0'
				this.$forceUpdate()
			},
			getQuestionReset() {
				this.completedPageindex = 1
				this.completedNum = ''
				this.reviewNum = ''
				this.reviewPageindex = 1
				this.completedData = []
				this.reviewData = []
				this.filterLoading = false
			},
			getQuestion() {
				this.current == 0 ? this.getQuestionReview() : this.current == 1 ? this.getQuestionCompleted() : true
				this.$refs['popup'].close()
			},
			// tabbar切换请求数据
			async tabbarBind() {
				await this.getQuestionReset()
				await this.popupReset()
				await this.getQuestion()
			},
			// 待复核
			async getQuestionReview() {
				if (this.reviewLoading) return
				let userinfo = this.utils.getUserInfo(uni);
				uni.showNavigationBarLoading()
				this.reviewLoading = true
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.plan_getReviewlist,
						data: {
							pagesize: this.pagesize,
							pageindex: this.reviewPageindex,
							usernumber: userinfo.usernumber,
							floor: this.floor,
							planid: this.title,
							sdate: this.date[0],
							edate: this.date[1],
							status: 1
						}
					})
					uni.hideNavigationBarLoading()
					this.reviewLoading = false
					let [err, success] = data
					console.log('待复核请求成功------>>>', success)
					if (!err && success.data.success) {
						this.reviewData = this.reviewData.concat(success.data.data.question)
						this.reviewDataInfo = success.data.pagecount
						this.reviewNum ? '' : this.reviewNum = success.data.pagenum
						this.reviewPageindex += 1
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					this.reviewLoading = false
					uni.hideNavigationBarLoading()
					console.log(e)
				}
			},
			// 已完成
			async getQuestionCompleted() {
				if (this.computedLoading) return
				let userinfo = this.utils.getUserInfo(uni);
				uni.showNavigationBarLoading()
				this.computedLoading = true
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.plan_getReviewlist,
						data: {
							pagesize: this.pagesize,
							pageindex: this.completedPageindex,
							usernumber: userinfo.usernumber,
							floor: this.floor,
							planid: this.title,
							sdate: this.date[0],
							edate: this.date[1],
							status: 100
						}
					})
					uni.hideNavigationBarLoading()
					this.computedLoading = false
					let [err, success] = data
					console.log('已完成请求成功------>>>', success)
					if (!err && success.data.success) {
						this.completedData = this.completedData.concat(success.data.data.question)
						this.completedDataInfo = success.data.pagecount
						this.completedNum ? '' : this.completedNum = success.data.pagenum
						this.completedPageindex += 1
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					this.computedLoading = false
					uni.hideNavigationBarLoading()
					console.log(e)
				}
			},
			// 获取筛选条件
			async getFilterData() {
				let userinfo = this.utils.getUserInfo(uni);
				uni.showNavigationBarLoading()
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.plan_getFilterData,
						data: {
							pagesize: 0,
							pageindex: 1,
							usernumber: userinfo.usernumber,
							floor: '',
							planid: 0,
							sdate: this.date[0],
							edate: this.date[1],
							status: 1
						}
					})
					uni.hideNavigationBarLoading()
					let [err, success] = data
					console.log('筛选条件请求成功------>>>', success)
					if (success.data.success) {
						this.floorList = success.data.data.floor
						this.titleList = success.data.data.planinspectionset
					} else {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
				} catch (e) {
					uni.hideNavigationBarLoading()
					console.log(e)
				}
			}
		},
		// onLoad: function() {
		// 	this.tabbarBind()
		// },
		onShow: function() {
			this.tabbarBind()
		}
	}
</script>

<style scoped lang="scss">
	@import '@/styles/popup.scss';
	.filter-popup{
		/deep/ .uni-popup {
			margin-top: 70rpx;
		}
	}

	.container {
		min-height: 100vh;
		background: #F6F7F9;
		display: flex;
		flex-direction: column;

		.head {
			width: 100%;
			height: 70rpx;
			box-sizing: border-box;
			background: #fff;
			display: flex;
			justify-content: space-between;
			border-bottom: 1rpx solid #f6f7f9;

			.left {
				flex: 1;
			}

			.center {
				flex: 2;
				display: flex;
				justify-content: center;
				text-align: center;
				color: #323436;
				font-size: 28rpx;
				/* IOS XR */
				// padding-bottom: env(safe-area-inset-bottom);
				/* ------ */
				box-sizing: border-box;

				.btn-list {
					width: 340rpx;
					line-height: 70rpx;
					display: flex;
					justify-content: space-around;
					align-items: center;

					.item {
						width: 50%;
						height: 100%;
						font-size: 26rpx;
						text-align: center;
						color: #434343;
						position: relative;

						&:active {
							background: #f9f9f9;
							opacity: 0.9;
						}

						&:nth-child(2) {
							margin: 0 30rpx;
						}
					}

					.item.active {
						color: #323436;
						font-size: 28rpx;
						font-weight: 700;

						&::before {
							content: '';
							display: block;
							width: 100%;
							height: 4rpx;
							position: absolute;
							left: 0;
							bottom: 0;
							background: #1BA1F3;
						}
					}
				}
			}

			.right {
				flex: 1;
				display: flex;
				justify-content: flex-end;

				.filter {
					height: 100%;
					display: flex;
					align-items: center;
					color: #647484;
					padding: 0 20rpx;

					.icon {
						width: 26rpx;
						height: 24rpx;
					}

					&:active {
						background: #f9f9f9;
						opacity: 0.9;
					}
				}
			}
		}

		.main {
			flex: 2;

			.swiper {
				height: calc(100vh - 70rpx);

				.swiper-item {

					.haoheao-scroll {
						flex: 2;

						.length {
							font-size: 24rpx;
							color: #333;
							font-weight: 700;
							padding: 20rpx;
							padding-bottom: 0;
						}

						.item {
							width: calc(100% - 40rpx);
							margin: 20rpx;
							background: #fff;
							border-radius: 10rpx;
							padding: 0 20rpx;
							box-sizing: border-box;

							.question {
								padding: 20rpx 0rpx;
								font-size: 28rpx;
								// font-weight: 800;
								// border-bottom: 1rpx solid #f2f2f2;
								// margin-bottom: 10rpx;
								display: flex;
								align-items: flex-start;

								.txt {
									flex: 2;
									color: #647484;
									font-size: 26rpx;
								}

								.date {
									white-space: nowrap;
									color: #B6C6D6;
									margin-left: 20rpx;
									font-size: 24rpx;
									font-weight: 500;
								}
							}

							.info-view {
								display: flex;
								font-size: 24rpx;
								padding-bottom: 10rpx;

								.title {
									color: #A4B1BE;
									width: 4em;
									margin-right: 20rpx;
									white-space: nowrap;
									text-align-last: justify;
								}

								.content {
									color: #647484;
								}
							}

							.img-list {
								margin-top: 10rpx;
								display: flex;
								flex-wrap: wrap;

								.img-view {
									margin-right: 10rpx;
									margin-bottom: 10rpx;
									width: calc(100%/5 - 10rpx);
									height: 124rpx;
									display: flex;
									align-items: center;
									justify-content: center;
									overflow: hidden;

									.icon {
										border-radius: 10rpx;
										width: 100%;
										height: 100%;
									}
								}
							}

							// .place {
							// 	color: #333;
							// 	font-size: 26rpx;

							// 	.label {
							// 		color: #647484;
							// 	}
							// }

							.info {
								display: flex;
								align-items: center;
								padding: 20rpx 0;
								padding-top: 0;

								.num {
									color: #e2e2e2;
									font-size: 24rpx;

									&.active {
										color: #1BA1F3;
									}
								}

								.btn-list {
									flex: 2;
									display: flex;
									justify-content: flex-end;
									font-size: 24rpx;

									.btn {
										color: #1BA1F3;
										border: 1rpx solid #1BA1F3;
										width: 130rpx;
										text-align: center;
										line-height: 48rpx;
										border-radius: 24rpx;
									}
								}
							}

							&:active {
								background: #F6F6F6;

								.btn-list {
									.btn {
										background: #1BA1F3;
										color: #fff;
									}
								}
							}
						}
					}
				}
			}
		}
		.popup{
			max-height: auto;
			border-radius: 0;
			&.review{
				padding: 30rpx;
				padding-bottom: 0;
				border-top-left-radius: 20rpx;
				border-top-right-radius: 20rpx;
				
				.title{
					display: flex;
					.content{
						flex: 2;
					}
					.close{
						padding: 4rpx 15rpx;
						border-radius: 5rpx;
						&:active{
							color: #1BA1F3;
							background: #f2f2f2;
						}
					}
				}
				.remark{
					min-height: 200rpx;
					background: #F3F5F7;
					border-radius: 10rpx;
					padding: 20rpx;
					font-size: 28rpx;
					width: 100%;
					box-sizing: border-box;
				}
				.bottom-control {
					z-index: 999;
					padding: 20rpx 20rpx;
					padding-right: 0;
					background: #fff;
				}
			}
			&.filter{
				// margin-top: 70rpx;
				min-width: 100vw;
				min-height: calc(100vh - 70rpx);
				overflow-y: scroll;
				background: #fff;
				display: flex;
				flex-direction: column;

				.content {
					font-size: 24rpx;
					box-sizing: border-box;
					padding: 20rpx;
					padding-bottom: 80rpx;
					flex: 2;

					.title {
						padding: 10rpx 0rpx 10rpx 5rpx;
						color: #A4B1BE;
					}

					.item {
						margin-bottom: 10rpx;
						color: #647685;

						&.date {
							line-height: 70rpx;
							display: flex;
							align-items: center;

							.time {
								border-radius: 10rpx;
								background: #F3F5F7;
								width: 250rpx;
								text-align: center;

								&:active {
									opacity: 0.8;
								}
							}

							.txt {
								padding: 0 20rpx;
							}
						}

						&.floor {
							display: flex;
							flex-wrap: wrap;

							.view {
								width: calc(100%/3 - 20rpx);
								// flex: 3;
								margin-right: 20rpx;
								text-align: center;
								line-height: 56rpx;
								background: #F3F5F7;
								border-radius: 10rpx;
								margin-bottom: 20rpx;
								border: 2rpx solid transparent;

								&:nth-child(3n + 3) {
									margin-right: 0;
								}

								&:active {
									opacity: 0.8;
								}

								&.active {
									border: 2rpx solid #1BA1F3;
									color: #1BA1F3;
									background: #fff;
								}
							}
						}

						&.theme {
							display: flex;
							flex-wrap: wrap;

							.view {
								margin-right: 20rpx;
								text-align: center;
								line-height: 56rpx;
								background: #F3F5F7;
								border-radius: 10rpx;
								margin-bottom: 20rpx;
								border: 2rpx solid transparent;
								padding: 0 20rpx;

								&:active {
									opacity: 0.9;
								}

								&.active {
									border: 2rpx solid #1BA1F3;
									color: #1BA1F3;
									background: #fff;
								}
							}
						}
					}
				}

				.btn-list {
					display: flex;
					align-items: center;
					position: sticky;
					bottom: 0;

					.btn {
						flex: 2;
						text-align: center;
						line-height: 100rpx;
						background: #F6F7F9;

						&:active {
							opacity: 0.9;
						}

						&.reset {
							color: #ff0036;
						}

						&.search {
							color: #fff;
							background: #647685;
						}
					}
				}
			}
		}
	}
</style>
