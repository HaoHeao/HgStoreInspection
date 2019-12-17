<template>
    <view class="container">
        <view class="head">
            <view class="left"></view>
            <view class="center">
                <view class="btn-list">
                    <view :class="['item', current == 0?'active':'']" @click="changeCurrent(0)">进行中</view>
                    <view :class="['item', current == 1?'active':'']" @click="changeCurrent(1)">已发布</view>
                </view>
            </view>
            <view class="right"></view>
        </view>
    </view>
</template>

<script>
    export default {
        components: {
            
        },
        props: ['current'],
        data() {
            return {
                
            }
        },
        computed: {
            
        },
        methods: {
            changeCurrent: function(current) {
                this.$emit('transfer', current);
            }
        }
    }
</script>

<style scoped lang="scss">
    .container {
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
            min-width: 100rpx;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            // padding-right: 34rpx;

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

        // 筛选
        .screen {
            width: 750rpx;
            height: calc(100vh - 70rpx);
            padding-bottom: 100rpx;
            background: #fff;
            margin-top: 70rpx;
            overflow-y: scroll;
            position: relative;

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
                    // height: 38rpx;
                    // line-height: 38rpx;
                    background: #F3F5F7;
                    color: #647685;
                    text-align: center;
                    border-radius: 6rpx;

                    &:active {
                        background: #fff;
                    }

                    .uni-input {
                        padding: 16rpx 0rpx;
                    }
                }

                .center {
                    padding: 0rpx 22rpx;
                }
            }

            .department-list {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                padding: 30rpx;
                padding-top: 10rpx;

                .item {
                    width: calc(33.3% - 12rpx);
                    height: 60rpx;
                    background: #F3F5F7;
                    color: #647685;
                    padding: 10rpx 10rpx;
                    margin-bottom: 16rpx;
                    margin-right: 16rpx;
                    text-align: center;
                    border-radius: 6rpx;
                    border: 2rpx solid #F3F5F7;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    box-sizing: border-box;
                    line-height: 40rpx;


                    &:active {
                        background: #fff;
                    }
                }

                .item.active {
                    border: 1rpx solid #1BA1F3;
                    color: #1BA1F3;
                    background: #fff;
                }

                .item:nth-child(3n) {
                    margin-right: 0;
                }
            }

            .control {
                width: 100%;
                position: fixed;
                left: 0;
                bottom: 0;
                z-index: 1;
                display: flex;

                .btn {
                    width: 50%;
                    height: 100rpx;
                    line-height: 100rpx;
                    font-size: 28rpx;
                    color: #545658;
                    text-align: center;
                    background: #F6F7F9;
                    margin-bottom: env(safe-area-inset-bottom);

                    &:active {
                        opacity: 0.9;
                    }
                }

                .btn.define {
                    background: #647685;
                    color: #fff;
                }
            }
        }
    }
</style>
