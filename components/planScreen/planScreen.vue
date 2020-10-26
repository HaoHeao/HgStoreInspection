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
    }
</style>
