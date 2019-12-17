<template>
	<view class="you-scroll" ref="youScroll">
		<view class="pullDown" :style="{ transform: 'translateY('+translateY+'px)', transition: isDown ? '0s' : '0.5s' }">
			<slot name="pullDown">
				<!-- <img src="../../static/pullDown.jpg" :class="{'down-icon': true,'animate': pullDownStatus == 3}"></img> -->
				<span>
					<block v-if="pullDownStatus == 1"><text class="fadeIn">{{downPullToRefresh}}</text></block>
					<block v-if="pullDownStatus == 2"><text class="fadeIn">{{downReleaseToRefresh}}</text></block>
					<block v-if="pullDownStatus == 3"><text class="fadeIn500">{{downRefreshing}}</text></block>
					<block v-if="pullDownStatus == 4"><text class="fadeIn500">{{downCompleteRefreshing}}</text></block>
				</span>
			</slot>
		</view>
		<scroll-view enable-back-to-top="true" class="you-scroll-inner" ref="youScrollInner" scroll-y :style="{ transform: 'translateY('+translateY+'px)', transition: isDown ? '0s' : 'transform 0.5s' }"
		 @touchstart="startFn" @touchmove="moveFn" @touchend="endFn" @touchcancel="endFn" @scroll="scroll">
			<view class="you-scroll-content">
				<slot></slot>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollTop: 0,
				sPageY: 0,
				mPageY: 0,
				ePageY: 0,
				translateY: 0,
				pullDownStatus: 1, // 1：下拉刷新 2：松开刷新 3：刷新中 4：刷新完成
				isDown: false
			};
		},
		props: {
			pullDownDistance: {
				type: Number,
				default: 50 // 下拉刷新距离
			},
			reachBottomDistance: {
				type: Number,
				default: 0 // 上拉加载距离
			},
			downPullToRefresh: {
				type: String,
				default: '下拉刷新'
			},
			downReleaseToRefresh: {
				type: String,
				default: '松开刷新'
			},
			downRefreshing: {
				type: String,
				default: '刷新中…'
			},
			downCompleteRefreshing: {
				type: String,
				default: '刷新完成'
			},
		},
		methods: {
			startFn(e) {
				this.isDown = true;
				this.sPageY = e.changedTouches[0].pageY ? e.changedTouches[0].pageY : 0;
				this.pointY = this.translateY;
			},
			moveFn(e) {
				let view = uni.createSelectorQuery().in(this).select(".you-scroll-inner");
				view.fields({
					size: true,
					scrollOffset: true
				}, data => {
					this.scrollTop = data.scrollTop;
					this.mPageY = e.changedTouches[0].pageY ? e.changedTouches[0].pageY : 0;
					if (this.scrollTop <= 0) {
						let translateY = ((this.mPageY - this.sPageY) / 2) + this.pointY;
						this.translateY = (translateY < 0 ? 0 : translateY);

						if (this.pullDownStatus != 3) {
							if (this.translateY < this.pullDownDistance) {
								this.pullDownStatus = 1;
							} else if (this.translateY >= this.pullDownDistance) {
								this.pullDownStatus = 2;
							}
						}
					}
				}).exec();
			},
			endFn(e) {
				this.isDown = false;
				this.ePageY = e.changedTouches[0].pageY ? e.changedTouches[0].pageY : 0;
				setTimeout(() => {
					this.translateY = this.translateY >= this.pullDownDistance ? this.pullDownDistance : 0;
					if (this.pullDownStatus == 2) { // 开始刷新
						this.pullDownStatus = 4;
						// this.pullDownStatus = 3;
						this.$emit('onPullDown', this.endPullDown);
					}
				}, 100)
			},
			endPullDown(mm) {
				if (this.timeout) clearTimeout(this.timeout);
				setTimeout(() => {
					this.timeout = setTimeout(() => {
						this.translateY = 0;
						this.pullDownStatus = 1;
					}, mm || 0);
				}, 800)
			},
			prevent(e) {
				if (this.translateY > 0) {
					e.preventDefault();
				}
			},
			scroll(e) {
				this.$emit('onScroll', e);
				if (this.timeout) clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					this.scrolltolower(e);
				}, 20);
			},
			scrolltolower(e) {
				let view = uni.createSelectorQuery().in(this).select(".you-scroll-inner");
				view.fields({
					size: true,
					scrollOffset: true
				}, data => {
					if (data.scrollTop >= (e.detail.scrollHeight - data.height - this.reachBottomDistance)) {
						this.$emit('onLoadMore', e);
					}
				}).exec();
			},
			isWeixinCient() {
				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					return true;
				} else {
					return false;
				}
			}
		},
		mounted() {
			// #ifdef H5
			if (this.isWeixinCient()) {
				document.body.addEventListener('touchmove', this.prevent);
			}
			// #endif
		},
		destroyed() {
			// #ifdef H5
			if (this.isWeixinCient()) {
				document.body.removeEventListener('touchmove', this.prevent);
			}
			// #endif
		}
	}
</script>

<style scoped>
	.you-scroll {
		width: 100%;
		height: 100%;
		/* overflow: hidden; */
		position: relative;
		// background-color: #eee;
	}

	.you-scroll .pullDown {
		width: 100%;
		height: 40px;
		line-height: 50px;
		text-align: center;
		font-size: 14px;
		overflow: hidden;
		transform: translateY(-100%);
		position: absolute;
		top: -40px;
		left: 0;
	}

	.you-scroll .pullDown .down-icon {
		width: 40px;
		height: 32px;
		display: inline-block;
		vertical-align: middle;
	}

	.you-scroll .pullDown .animate {
		-webkit-animation: scaleIcon 1s infinite linear;
		-moz-animation: scaleIcon 1s infinite linear;
		-ms-animation: scaleIcon 1s infinite linear;
		animation: scaleIcon 1s infinite linear;
	}

	.you-scroll .pullDown span {
		white-space: nowrap;
		overflow: hidden;
		display: inline-block;
		vertical-align: middle;
		font-size: 28rpx;
		color: #666;
	}

	.you-scroll .you-scroll-inner {
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: relative;
		padding-bottom: env(safe-area-inset-bottom);
	}

	.you-scroll-content {
		overflow: hidden;
	}

	@-webkit-keyframes scaleIcon {
		0% {
			transform: scaleY(1);
		}

		40% {
			transform: scaleY(0.8);
		}

		80% {
			transform: scaleY(0.9);
		}

		100% {
			transform: scaleY(1);
		}
	}

	@-moz-keyframes scaleIcon {
		0% {
			transform: scaleY(1);
		}

		40% {
			transform: scaleY(0.8);
		}

		80% {
			transform: scaleY(0.9);
		}

		100% {
			transform: scaleY(1);
		}
	}

	@-ms-keyframes scaleIcon {
		0% {
			transform: scaleY(1);
		}

		40% {
			transform: scaleY(0.8);
		}

		80% {
			transform: scaleY(0.9);
		}

		100% {
			transform: scaleY(1);
		}
	}

	@keyframes scaleIcon {
		0% {
			transform: scaleY(1);
		}

		40% {
			transform: scaleY(0.8);
		}

		80% {
			transform: scaleY(0.9);
		}

		100% {
			transform: scaleY(1);
		}
	}
</style>
