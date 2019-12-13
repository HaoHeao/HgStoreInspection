<template>
	<view class="container">
		<screen :current="current" index="3" isScreen="true" @transfer="getCurrent" @filter="getFilter"></screen>
		<view class="main">
			<swiper class="swiper" circular="true" :autoplay="false" duration="300" :current="current" @change="swiperChange">
				<swiper-item class="swiper-item">
					<data-list-item :dataList="dataList0" state="0" @again="getState" @againMore="againMore"></data-list-item>
				</swiper-item>
				<swiper-item class="swiper-item">
					<data-list-item :dataList="dataList1" state="1" @again="getState" @againMore="againMore"></data-list-item>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import dataListItem from "@/components/pageDataList";
	import screen from '@/components/screen/screen'
    let globalData = getApp().globalData;
    let utils = require('@/util/utils.js');
    let request = utils.request;
	export default {
		props: ['update'],
		components: {
			dataListItem,
			screen
		},
		data() {
			return {
				current: 0,
				dataList0: [],
				dataList1: [],
				dataIndex0: 1,
				dataIndex1: 1,
				pageNum1: 0,
				pageNum0: 0,
			}
		},
        computed:{
            filterAll(){
                return this.$store.state.market.filterAll;
            }
        },
		// 自动更新
		watch: {
			update() {
				this.current = 0;
				this.pageConfig();
				this.getData();
			}
		},
		methods: {
			// 把页数设为1
			pageConfig: function() {
				this.dataIndex0 = 1;
				this.dataIndex1 = 1;
				this.dataList0 = [];
				this.dataList1 = [];
			},
			swiperChange: function(e) {
				this.current = e.detail.current;
				this.pageConfig();
				this.getData();
			},
			// 父组件传值
			getCurrent(current) {
				this.current = current;
				this.pageConfig();
				this.getData();
			},
			// 修改筛选信息
			getFilter() {
				this.pageConfig();
				this.getData();
			},
			// 刷新
			getState() {
				this.pageConfig();
				this.getData();
			},
			// 加载更多
			againMore() {
				let index = 1;
				if (this.current) {
					if (this.pageNum1 == this.dataIndex1) {
						return;
					} else {
						this.dataIndex1 = this.dataIndex1 + 1;
					}
					// this.pageNum1 == this.dataIndex1?'':this.dataIndex1 = this.dataIndex1 + 1;
					index = this.dataIndex1;
				} else {
					if (this.pageNum0 == this.dataIndex0) {
						return;
					} else {
						this.dataIndex0 = this.dataIndex0 + 1;
					}
					// this.pageNum0 == this.dataIndex0?'':this.dataIndex0 = this.dataIndex0 + 1;
					index = this.dataIndex0;
				}
				this.getData(true);
			},
			// 请求数据       
			getData: function(more) {
				let index = 1;
				if (this.current) {
					index = this.dataIndex1;
				} else {
					index = this.dataIndex0;
				}
				this.getDataList(this.current, index, more);
			},
			// 获取数据
			getDataList: function(status, pageindex, more) {
				uni.showNavigationBarLoading();
				let _this = this;
				// 默认请求未解决的
				let option = this.filterAll;
				let senddpetid = [];
				for (let item of option.deptSelect) {
					senddpetid.push(item.deptid);
				}
				let data = {
					usernumber: globalData.userinfo.usernumber,
					sdate: option.sdate,
					edate: option.edate,
					status,
					senddpetid,
					inspectioncode: "",
					pagesize: option.pagesize,
					pageindex
				};
				console.log("全部列表数据请求参数:", data)
				request.getAllList(data).then(data => {
					let [err, res] = data;
					console.log("全部页列表数据：", err, res)
					if (err == null && res.data.success) {
						let list = res.data.data;
						if (status) {
							more ? _this.dataList1 = _this.dataList1.concat(list) : _this.dataList1 = list;
							// _this.dataList1 = list;
							_this.pageNum1 = res.data.pagenum;
						} else {
							more ? _this.dataList0 = _this.dataList0.concat(list) : _this.dataList0 = list;
							// _this.dataList0 = list;
							_this.pageNum0 = res.data.pagenum;
						}
					}else{
						uni.showToast({
							icon: "none",
							duration:2500,
							title: "查找失败"
						})
						uni.hideNavigationBarLoading();
						return;
					}
					_this.$forceUpdate();
					uni.hideNavigationBarLoading();
				})
			}
		},
		created: function() {
			console.log("question show created")
		}
	}
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		height: 100%;
		background: #f6f7f9;

		.head {
			width: 100%;
			height: 70rpx;
			box-sizing: border-box;
			position: fixed;
			top: 0;
			left: 0;
			background: #fff;
			z-index: 999;
			display: flex;
			justify-content: space-between;
			border-bottom: 1rpx solid #E5EDF1;

			.left {
				flex: 1;
			}

			.center {
				flex: 2;
				display: flex;
				justify-content: center;
				text-align: center;

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
					}

					.item.active {
						color: #323436;
						font-size: 28rpx;
						font-weight: 700;

						&::before {
							content: '';
							display: block;
							width: 100rpx;
							height: 4rpx;
							position: absolute;
							left: 35rpx;
							bottom: 0;
							background: #1BA1F3;
						}
					}
				}

				.bottom-line {
					width: 110rpx;
					height: 6rpx;
					background: #ff0036;
					position: absolute;
					bottom: 0;
					left: 5rpx;
				}
			}
		}

		.right {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			padding-right: 34rpx;

			.title {
				color: #647484;
				font-size: 28rpx;
				padding-right: 14rpx;
			}

			.icon {
				width: 26rpx;
				height: 24rpx;
			}
		}

		.main {
			margin-top: 70rpx;

			.swiper {
				width: 100%;
				height: calc(100vh - 100rpx - 70rpx);

				.swiper-item {
					width: 100%;
					height: 100%;
					overflow-y: scroll;
				}
			}
		}

		// 筛选
		.screen {
			width: 750rpx;
			height: calc(100vh - 70rpx);
			background: #fff;
			margin-top: 70rpx;
			overflow-y: scroll;

			.top {
				width: 100%;
				background: #FBFCFD;
				height: 30rpx;
			}

			.line {
				width: 100%;
				height: 1rpx;
				background: #EDEEEF;
			}

			.title {
				padding: 30rpx;
				padding-bottom: 0;
				font-size: 24rpx;
				color: #A4B1BE;
			}

			.set-time {
				display: flex;
				align-items: center;
				padding: 30rpx;
				padding-top: 10rpx;
				padding-bottom: 20rpx;

				.date {
					width: 100%;
					height: 38rpx;
					line-height: 38rpx;
					background: #F3F5F7;
					color: #647685;
					padding: 16rpx 0rpx;
					text-align: center;
					border-radius: 6rpx;

					&:active {
						background: #fff;
					}
				}

				.center {
					padding: 0rpx 22rpx;
				}
			}

			.department-list {
				display: flex;
				flex-wrap: wrap;
				justify-content: space-between;
				padding: 30rpx;
				padding-top: 10rpx;

				.item {
					width: calc(33.3% - 10.5rpx);
					height: 38rpx;
					line-height: 38rpx;
					background: #F3F5F7;
					color: #647685;
					padding: 10rpx 0rpx;
					margin-bottom: 16rpx;
					text-align: center;
					border-radius: 6rpx;
					border: 1rpx solid #F3F5F7;

					&:active {
						background: #fff;
					}
				}

				.item.active {
					border: 1rpx solid #1BA1F3;
					color: #1BA1F3;
					background: #fff;
				}
			}
		}
	}
</style>
