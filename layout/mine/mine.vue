<template>
    <view class="container">
        <view class="user-head">
            <view class="head-view">
                <view class="head-mark">😃</view><!-- 头像 -->
                <view class="head-user">
                    <open-data type="userAvatarUrl" class="img"></open-data>
                </view>
            </view>
        </view>
        <view class="user-name">
            <open-data type="userNickName" lang="zh_CN" class="text"></open-data>
        </view>
        <view class="user-info">{{userInfo.deptname}} - {{userInfo.username}}</view>
        <view class="control">
            <view class="item" @click="navigator(1)">
                <image src="@/static/phone1.png" mode="widthFix" class="icon"></image>
                <view class="title">修改手机号</view>
                <image src="@/static/right.png" mode="widthFix" class="right"></image>
            </view>
            <view class="item" @click="navigator(2)">
                <image src="@/static/pwd.png" mode="widthFix" class="icon"></image>
                <view class="title">修改密码</view>
                <image src="@/static/right.png" mode="widthFix" class="right"></image>
            </view>
        </view>
        <view class="logout" @click="logout()">退出登录</view>
        <view class="version">{{systemName}} 版本({{version}})</view>
    </view>
</template>

<script>
    let globalData = getApp().globalData;
    let utils = require('@/util/utils.js');
    let request = utils.api;
    export default {
        data() {
            return {
                userInfo: uni.getStorageSync('userinfo'),
                version: globalData.system.version,
                systemName: globalData.system.systemName,
                menulist: 4
            }
        },
        methods: {
            logout: function() {
                let _this = this;
                console.log(globalData)
                uni.showModal({
                    content: "确认退出登录?",
                    cancelColor: "#999",
                    confirmColor: "#647484",
                    success: res => {
                        console.log("确认", res)
                        if (res.confirm) {
                            request.loginout({
                                openId: globalData.openId
                            });
							uni.clearStorageSync();
                            // globalData.userinfo = {}
                            uni.reLaunch({
                                url: '/user/login/login'
                            });
                        }
                    }
                })
            },
            navigator: function(type) {
                uni.navigateTo({
                    url: '../selectInfo/selectInfo?type=' + type,
                    fail:function(){
                        uni.navigateTo({
                            url: '../../user/selectInfo/selectInfo?type=' + type
                        })
                    }
                })
            },
            // 下载模块
            moduleTo: function(type) {
                if (type == 1) {
                    // Object.assign(this.api, this.api, require('@/util/request/inspection.js'));
                    utils.getMarketDeptList(this);
                    utils.getMarketUserList(this);
                    // console.log("api更新", this.api)
                    uni.reLaunch({
                        url: '/pages/index/index'
                    })
                } else if (type == 2) {
                    utils.getMarketDeptList(this);
                    utils.getMarketUserList(this);
                    uni.reLaunch({
                        url: '/pages-day/index/index'
                    })
                }
            }
        },
        onShow: function() {
            // #ifdef MP-WEIXIN
            wx.hideHomeButton();
			console.log("index show")
            // #endif
            uni.setNavigationBarTitle({
                title: "我的主页"
            });
        }
    }
</script>

<style scoped lang="scss">
    .container {
        width: 100%;
        min-height: 100vh;
        background: #f6f7f9;
        padding-bottom: env(safe-area-inset-bottom);

        .user-head {
            width: 100%;
            padding: 3vh 0rpx;
            padding-bottom: 2vh;
            

            .head-view {
                width: 130rpx;
                height: 130rpx;
                overflow: hidden;
                border-radius: 50%;
                position: relative;
                margin-left: calc(50% - 65rpx);

                .head-mark {
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 1;
                    width: 100%;
                    height: 100%;
                    background: #647484;
                    text-align: center;
                    line-height: 130rpx;
                    white-space: nowrap;
                    color: #fff;
                }

                .head-user {
                    position: absolute;
                    left: 0;
                    top: 0;
                    z-index: 2;
                    width: 100%;
                    height: 100%;

                    .img {
                        width: 100%;
                        height: 100%;
                    }
                }
            }
        }

        .user-name {
            width: 100%;
            height: 40rpx;
            line-height: 40rpx;
            text-align: center;
            color: #647484;
            font-size: 20rpx;

            .text {
                width: 100%;
                text-align: center;
            }
        }

        .user-info {
            width: 100%;
            text-align: center;
            color: #323436;
            font-size: 28rpx;
            padding-bottom: 1vh;
        }

        .control {
            width: calc(100% - 36rpx);
            margin: 18rpx;
            border-radius: 10rpx;
            background: #fff;
            overflow: hidden;

            .item {
                padding: 26rpx 26rpx;
                display: flex;
                justify-content: flex-start;
                // box-sizing:border-box;
                align-items: center;
                border-bottom: 1rpx solid transparent;
                position: relative;

                &:before {
                    content: '';
                    display: block;
                    width: calc(100% - 52rpx);
                    height: 1rpx;
                    background: #EDEEEF;
                    position: absolute;
                    left: 26rpx;
                    bottom: -1rpx;
                }

                &:active {
                    background: #f2f2f2;
                    animation: fadeIn 300ms;
                }

                .icon {
                    width: 32rpx;
                    margin-right: 10rpx;
                }

                .title {
                    font-size: 28rpx;
                    color: #323436;
                    flex: 2;
                }

                .right {
                    width: 28rpx;
                }
            }

            .item:last-child {
                &:before {
                    display: none;
                }
            }
        }

        // 退出登录
        .logout {
            width: calc(100% - 60rpx);
            margin: 0rpx 30rpx;
            height: 80rpx;
            font-size: 28rpx;
            background: #647484;
            text-align: center;
            line-height: 80rpx;
            letter-spacing: 2rpx;
            margin-top: 100rpx;
            border-radius: 40rpx;
            color: #fff;
            opacity: 1;

            &:active {
                opacity: 0.9;
                animation: fadeIn 800ms;
            }
        }

        .modules {
            display: flex;
            justify-content: space-around;
            width: calc(100% - 36rpx);
            margin: 18rpx;
            border-radius: 10rpx;
            background: #fff;
            overflow: hidden;

            .item {
                width: 100%;
                // height: 238rpx;
                height: 180rpx;
                text-align: center;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-wrap: wrap;
                box-sizing: border-box;
                padding: 40rpx 0rpx;

                &:active {
                    background: #f2f2f2;
                    animation: fadeIn 300ms;
                }

                .icon {
                    width: 50rpx;
                    height: 50rpx;

                    .img {
                        width: 100%;
                        height: 100%;
                    }
                }


                .title {
                    width: 100%;
                    font-size: 28rpx;
                }
            }

            .item.plan {
                .icon {
                    position: relative;

                    .date {
                        width: 50rpx;
                        height: 50rpx;
                        font-weight: 800;
                        line-height: 65rpx;
                        text-align: center;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        font-size: 18rpx;
                    }
                }
            }
        }

        .modules.modules-item-big {
            flex-wrap: wrap;
            justify-content: flex-start;

            .item {
                width: 33.3%;
            }
        }
    }

    .version {
        padding: 5vh 0vh;
        padding-bottom: 120rpx;
        width: 750rpx;
        height: 20rpx;
        line-height: 20rpx;
        font-size: 20rpx;
        color: #B6C6D6;
        text-align: center;
    }
</style>
