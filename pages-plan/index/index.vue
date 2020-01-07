<template>
	<view class="container">
		<screen :current="current" @transfer="getCurrent"></screen>
		<view class="main">
			<swiper class="swiper" circular="true" :autoplay="false" duration="100" :current="current" @change="swiperChange">
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
	let utils = require('@/util/utils.js');
	let request = utils.request;
	import screen from '@/components/planScreen/planScreen';
	import dataListItem from "@/components/planPageDataList";
	export default {
		components: {
			screen,
			dataListItem,
		},
		data() {
			return {
				current: 0,
				dataList0: [],
				dataList1: [],
				// 计划巡检列表
				planList: []
			}
		},
		onShow() {
			this.getPlanList(0);
			this.getPlanList(1);
		},
		methods: {
			// 父组件传值
			getCurrent(current) {
				this.current = current;
			},
			swiperChange(e) {
				this.current = e.detail.current;
			},
			getState(){
				console.log(this.current)
				this.getPlanList(0);
				this.getPlanList(1);
			},
			getPlanList: function(datatype) {
				this.dataList0 = [];
				this.dataList1 = [];
				request.getPlanList({
						usernumber: uni.getStorageSync('userinfo').usernumber,
						datatype
					})
					.then(res => {
						let [err, data] = res;
						console.log("计划巡检列表：", err, data)
						if (err == null) {
							this.planList = data.data.data.planinspectionset;
							// 过滤
							for (let item of data.data.data.planinspectionset) {
								// 时间过滤
								item.sdate1 = item.sdate.slice(0, 10).replace(/-/g, ".");
								item.edate1 = item.edate.slice(0, 10).replace(/-/g, ".");
								// 部门人员过滤
								item.itemdeptlist = [];
								item.itempersonlist = [];
								for (let itm of item.planinspectionappenduser) {
									if (itm.appendtype == 1) {
										item.itemdeptlist.push(itm.itemname);
									} else if (itm.appendtype == 2) {
										item.itempersonlist.push(itm.itemname);
									}
								};
								// for(let ind in item.planinspectionappenduser){
								// 	if(ind == 0 && item.planinspectionappenduser[0]) item.itemdeptlist = item.planinspectionappenduser[0].itemname;
								// 	if(ind != 0){
								// 		item.itemdeptlist = item.itemdeptlist + '、' + item.planinspectionappenduser[ind].itemname
								// 	}
								// }
								if (datatype == 1) {
									this.dataList0.push(item);
								} else if (datatype == 0) {
									this.dataList1.push(item);
								}
							};
							console.log(data.data.data.planinspectionset)
							// this.dataList0 = data.data.data.planinspectionset;
							// this.dataList1 = data.data.data.planinspectionset;
						} else {
							uni.showToast({
								icon: "none",
								title: "请求失败" + err.errMsg
							})
						}
					})
			}
		},
		// 分享
		onShareAppMessage() {
			return {
				path: 'user/login/login'
			}
		}
	}
</script>

<style scoped lang="scss">
	.container {
		background: #F6F7F9;

		.main {
			margin-top: 70rpx;

			.swiper {
				width: 100%;
				min-height: calc(100vh - 70rpx);
				// min-height: calc(100vh - 70rpx);

				.swiper-item {
					width: 100%;
					height: 100%;
					overflow-y: scroll;
				}
			}
		}
	}
</style>
