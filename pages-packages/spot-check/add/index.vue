<template>
	<view class="container detail">
		<!-- 专柜、商品条码 -->
		<view class="view-item input">
			<!-- <view class="item">
				<view class="title">专柜号</view>
				<input type="number" value="" class="content" placeholder="专柜号" v-model="counter" />
				<view class="clear" @click="counter = ''" v-if="counter">
					<view class="view">×</view>
				</view>
			</view> -->
			<view class="item">
				<view class="title">商品条码</view>
				<input type="number" value="" class="content" placeholder="商品条码" v-model.trim="shopCode" />
				<view class="search fadeIn" @click="search()" v-if="shopCode">查询</view>
				<view class="scan-code" @click="scanCode()">
					<image src="@/static/icon/scan-code.svg" mode="widthFix" class="icon"></image>
				</view>
			</view>
		</view>
		<view class="view-item shop-info fadeIn" v-if="goodsinfo">
			<view class="item">
				<view class="title">商品名称</view>
				<view class="content fadeIn">{{goodsinfo.prodname}}</view>
			</view>
			<view class="item">
				<view class="title">商品编码</view>
				<view class="content fadeIn">{{goodsinfo.prodplu}}_{{goodsinfo.barcode}}</view>
			</view>
			<view class="item">
				<view class="title">专柜</view>
				<view class="content fadeIn">{{goodsinfo.conerno}}{{goodsinfo.conername}}</view>
			</view>
			<view class="info-list">
				<view class="item">
					<view class="title">系统库存</view>
					<view class="content fadeIn">{{goodsinfo.sysstoreqty}}</view>
				</view>
				<view class="item">
					<view class="title">线上未提</view>
					<view class="content fadeIn">{{goodsinfo.onlineqty}}</view>
				</view>
				<view class="item">
					<view class="title">借出</view>
					<view class="content fadeIn">{{goodsinfo.borrowqty}}</view>
				</view>
				<view class="item">
					<view class="title">当前库存</view>
					<view class="content fadeIn">{{goodsinfo.storeqty}}</view>
				</view>
			</view>
			<view class="tip" v-if="goodsinfo.other1">
				<image src="@/static/icon/tip.svg" mode="widthFix" class="icon"></image>{{goodsinfo.other1}}
			</view>
		</view>
		<view class="view-item calc fadeIn" v-if="goodsinfo">
			<view class="item">
				<view class="title">实盘数量</view>
				<input type="number" value="" class="content" placeholder="请填写实盘数量" v-model="difference" />
				<!-- <view class="title right" v-if="difference != null">差异</view>
				<view class="value" v-if="difference != null">{{goodsinfo.storeqty - difference}}</view> -->
			</view>
			<view class="item active">
				<view class="title">差&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;异</view>
				<view class="content">{{goodsinfo.storeqty - difference}}</view>
			</view>
			<view class="item textarea">
				<view class="title">说明</view>
				<textarea class="textarea-view fadeIn" :placeholder="goodsinfo.storeqty - difference != 0?'实盘存在差异，请填写说明':'说明'"
				 v-model="remark" auto-height />
				</view>
		</view>
		<view class="view-item control-list fadeIn" v-if="shopCode && goodsinfo">
			<view class="item del" @click="reset()">重置</view>
			<view class="item" @click="sublmit()">提交</view>
		</view>
	</view>
</template>

<script>
	import popup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			popup
		},
		data() {
			return {
				// 专柜号
				counter: "",
				// 商品条码
				shopCode: "",
				// 专柜信息
				counterinfo:'',
				// 商品信息
				goodsinfo:'',
				// 实盘数量
				difference:null,
				// 说明
				remark:"",
			}
		},
		computed: {

		},
		methods: {
			async search(){
				// if(!this.counter){
				// 	uni.showToast({
				// 		title: '请输入专柜号',
				// 		icon: 'none',
				// 		duration: 1000
				// 	});
				// 	return
				// }
				if(!this.shopCode){
					uni.showToast({
						title: '请输入商品条码',
						icon: 'none',
						duration: 1000
					});
					return
				}
				if(this.shopCode.length <= 10){
					uni.showToast({
						title: '商品条码无效',
						icon: 'none',
						duration: 2000
					});
					return
				}
				let _this = this;
				(async function(){
					// await _this.getCounterInfo()
					await _this.getGoodsinfo()
				}())
			},
			async sublmit(){
				if(!this.difference){
					uni.showToast({
						title: '请输入盘点数',
						icon: 'none',
						duration: 3000
					});
					return
				}
				if(this.goodsinfo.storeqty - this.difference != 0 && !this.remark){
					uni.showToast({
						title: '实盘存在差异，请填写说明',
						icon: 'none',
						duration: 3000
					});
					return
				}
				uni.showLoading({
					title: '加载中'
				});
				let userinfo = this.utils.getUserInfo(uni);
				try {
					let data = await uni.request({
						method: 'POST',
						url: this.api.spotcheck_save,
						data:{
							conerno: this.goodsinfo.conerno,
							prodplu: this.goodsinfo.prodplu,
							barcode: this.goodsinfo.barcode,
							sysstoreqty: this.goodsinfo.sysstoreqty,
							onlineqty: this.goodsinfo.onlineqty,
							borrowqty: this.goodsinfo.borrowqty,
							storeqty: this.goodsinfo.storeqty,
							chkqty: this.difference,
							disremark: this.remark,
							checkuserid: userinfo.usernumber,
							checkdate: this.moment().format("YYYY-MM-DD hh:mm:ss")
						}
					})
					let [err, success] = data
					console.log('提交成功------>>>',success)
					if (success.data.success) {
						uni.showToast({
							title: '提交成功',
							icon: 'none',
							duration: 2000
						});
					}else{
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
					}
					this.reset()
				} catch (e) {
					this.reset()
					console.log(e)
				}
			},
			scanCode(){
				let _this = this
				uni.scanCode({
				    scanType: ['barCode'],
				    success: function (res) {
				        console.log('扫码成功------>>>',res);
						_this.shopCode = res.result
						_this.search()
				    }
				});
			},
			reset(){
				uni.hideLoading();
				this.shopCode = ""
				this.counterinfo = ''
				this.goodsinfo = ''
				this.difference = null
				this.remark = ""
			},
			// 根据专柜号获取专柜信息
			async getCounterInfo() {
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.spotcheck_getCounterInfo,
						data:{
							conerno:this.counter
						}
					})
					let [err, success] = data
					console.log('专柜信息------>>>',success)
					if (!success.data.success) {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
						this.counterinfo = ''
						return
					}
					this.counterinfo = success.data.data
				} catch (e) {
					console.log(e)
				}
			},
			// 获取商品信息
			async getGoodsinfo() {
				let userinfo = this.utils.getUserInfo(uni);
				try {
					let data = await uni.request({
						method: 'GET',
						url: this.api.spotcheck_getGoodsinfo,
						data:{
							checkuserid:userinfo.usernumber,
							prodplu:this.shopCode
						}
					})
					let [err, success] = data
					console.log('商品信息------>>>',success)
					if (!success.data.success) {
						uni.showToast({
							title: err ? err : success.data.errmsg,
							icon: 'none',
							duration: 3000
						});
						this.goodsinfo = ''
						return
					}
					this.goodsinfo = success.data.data
				} catch (e) {
					console.log(e)
				}
			},
		},
		onLoad: async function(option) {

		}
	}
</script>

<style lang="scss" scoped>
	@import '@/styles/detail.scss';

	.container.detail {
		.view-item {
			.item{
				font-size: 28rpx;
			}

			// 输入
			&.input {
				.item {
					position: relative;

					>.search {
						padding: 6rpx 20rpx;
						color: #647484;
					}

					>.scan-code {
						display: flex;
						justify-content: center;
						align-items: center;

						.icon {
							width: 50rpx;
							height: 50rpx;
						}
					}

					.clear {
						width: 40rpx;
						height: 80rpx;
						position: absolute;
						top: calc(50% - 40rpx);
						right: 0;
						z-index: 999;
						display: flex;
						align-items: center;
						justify-content: center;
						transition: .3s;

						.view {
							line-height: 30rpx;
							text-align: center;
							width: 30rpx;
							height: 30rpx;
							font-size: 28rpx;
							color: #647484;
						}

						&:active {
							background: #e2e2e2;
						}
					}
				}
			}
			
			// 商品信息
			&.shop-info{
				.item{
					align-items: flex-start;
				}

				>.info-list {
					border-top: 1rpx dashed #f2f2f2;
					display: flex;
					flex-wrap: wrap;
					padding: 20rpx 0;
					padding-bottom: 3rpx;

					.item {
						display: flex;
						align-items: center;
						margin-right: 50rpx;
						margin-bottom: 12rpx;
						font-size: 28rpx;
						&:last-child{
							margin-bottom: 0;
						}

						.title {
							color: #A4B1BE;
							min-width: 4em;
							margin-right: 24rpx;
						}

						.content {
							color: #333;
						}
					}
				}

				.tip {
					border-top: 1rpx dashed #f2f2f2;
					padding-top: 15rpx;
					color: #D56C68;
					display: flex;
					align-items: center;
					font-size: 28rpx;
					margin-top: 12rpx;

					.icon {
						width: 40rpx;
						height: 40rpx;
						margin-right: 10rpx;
					}
				}
			}
			// 实盘、差异
			&.calc {
				.item{
					.content {
						background: #F3F5F7;
						border-radius: 10rpx;
						height: 80rpx;
						padding: 0 10rpx;
					}

					.title {
						&.right {
							min-width: auto;
							padding-right: 20rpx;
							margin-left: 30rpx;
							margin-right: 0;
						}
					}
					&.textarea{
						flex-wrap: wrap;
						.title{
							width: 100%;
						}
						.textarea-view{
							margin-top: 6rpx;
							background: #F3F5F7;
							border-radius: 10rpx;
							padding: 20rpx;
							min-height: 120rpx;
							width: 100%;
						}
					}
					&.active{
						.content{
							background: transparent;
							color: #ff0036;
							display: flex;
							align-items: center;
							font-size: 44rpx;
						}
					}
				}
			}
			// 底部按钮
			&.control-list {
				position: static;
				background: transparent;
				padding: 0;
				.item{
					margin-bottom:0;
				}
			}
		}
	}
</style>
