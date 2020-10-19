<template>
    <view class="container">
        <view class="head">
            <view class="left"></view>
            <view class="center">
                <view class="btn-list">
                    <view :class="['item', current == 0?'active':'']" @click="changeCurrent(0)">待解决</view>
                    <view :class="['item', current == 1?'active':'']" @click="changeCurrent(1)">已解决</view>
                </view>
            </view>
            <view class="right" @click="showPopup()">
                <view class="title" v-if="JSON.parse(isScreen)">筛选</view>
                <image src="../../static/screen.png" mode="widthFix" class="icon" v-if="JSON.parse(isScreen)"></image>
            </view>
        </view>

        <uni-popup ref="popup" type="center" @change="popupChange">
            <view class="screen">
                <view class="top"></view>
                <view class="title">设置日期段:</view>
                <view class="set-time">
                    <view class="date">
                        <picker mode="date" @change="changesDate" start="2004-03-01" :end="moment(new Date(moment(new Date(filter.sdate)).date.getTime())).format('YYYY-MM-DD')">
                            <view class="uni-input">{{filter.sdate}}</view>
                        </picker>
                    </view>
                    <view class="center">至</view>
                    <view class="date">
                        <picker mode="date" @change="changeeDate" :start="moment(new Date(moment(new Date(filter.sdate)).date.getTime() + 86400000)).format('YYYY-MM-DD')"
                            :end="moment(new Date(moment(new Date(filter.edate)).date.getTime())).format('YYYY-MM-DD')">
                            <view class="uni-input">{{filter.edate}}</view>
                        </picker>
                    </view>
                </view>
                <view class="line"></view>
                <view class="title">选择部门:</view>
                <view class="department-list">
                    <!-- <view class="item active">全部</view> -->
                    <view :class="['item',item.select?'active':'']" v-for="(item,index) of filter.senddpetid" :key="index"
                        @click="changeDept(item)">{{item.deptname}}</view>
                </view>
                <view class="control">
                    <view class="btn" @click="reset()">重置</view>
                    <view class="btn define" @click="showPopup()">完成</view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    let app = getApp();
    const moment = require('@/util/moment.js');
    export default {
        props: ['current', 'isScreen', 'index'],
        data() {
            const currentDate = this.getDate({
                format: true
            })
            return {
                popup: false,
                filter: [],
                sTime: "",
                starttime: '',
                endtime: ''
            }
        },
        computed: {
            startDate() {
                return this.getDate('start');
            },
            endDate() {
                return this.getDate('end');
            },
            filterQuestion() {
                return this.$store.state.market.filterQuestion;
            },
            filterAll() {
                return this.$store.state.market.filterAll;
            }
        },
        methods: {
            changeCurrent: function(current) {
                this.$emit('transfer', current);
                this.$refs['popup'].close()
                this.popup = false;
            },
            showPopup: function() {
                if (this.popup) {
                    this.$refs['popup'].close();
                    this.popup = false;
                } else {
                    let index = this.index;
                    this.filter = []
                    if (index == 1) {
                        // 问题页筛选
                        this.filter = this.filterQuestion;
                    } else if (index == 3) {
                        // 全部页筛选
                        this.filter = this.filterAll;
                    }
                    console.log("筛选页退出返回查询参数1：", this.filter)
                    for (let item of this.filter.senddpetid) {
                        item.select = false;
                        for (let ite of this.filter.deptSelect) {
                            if (ite.deptid == item.deptid) {
                                item.select = true;
                            }
                        }
                    }
                    // this.$forceUpdate();
                    this.$refs['popup'].open();
                    this.popup = true;
                }
            },
            popupChange(e) {
                console.log("筛选页退出返回查询参数2：", this.filter)
                this.$emit('filter', this.filter)
                this.popup = e.show
            },
            reset() {
                if (this.index == 1) {
                    let question = this.$store.state.market.filterQuestion;
                    question.deptSelect = [];
                    for (let item of question.senddpetid) {
                        item.select = false;
                    }
                    question.sdate = moment(new Date(moment(new Date()).date.getTime() - 604800000)).format(
                        'YYYY-MM-DD');
                    question.edate = moment(new Date()).format('YYYY-MM-DD');
                    this.$store.commit("setFilterQuestion", question);
                } else if (this.index == 3) {
                    let all = this.$store.state.market.filterAll;
                    all.deptSelect = [];
                    for (let item of all.senddpetid) {
                        item.select = false;
                    }
                    all.sdate = moment(new Date(moment(new Date()).date.getTime() - 604800000)).format('YYYY-MM-DD');
                    all.edate = moment(new Date()).format('YYYY-MM-DD');
                    this.$store.commit("setFilterAll", all);
                }
                this.$forceUpdate();
            },
            // 开始时间
            changesDate: function(e) {
                this.filter.sdate = e.target.value
                // this.$forceUpdate();
            },
            // 结束时间
            changeeDate: function(e) {
                this.filter.edate = e.target.value
                // this.$forceUpdate();
            },
            // 部门
            changeDept: function(item) {
                let _this = this;
                if (item.select) {
                    for (let index in _this.filter.deptSelect) {
                        if (_this.filter.deptSelect[index].deptid == item.deptid) {
                            _this.filter.deptSelect.splice(index, 1)
                        }
                    }
                    for (let index in _this.filter.senddpetid) {
                        if (_this.filter.senddpetid[index].deptid == item.deptid) {
                            _this.filter.senddpetid[index]['select'] = false;
                        }
                    }
                } else {
                    _this.filter.deptSelect.push(item)
                    for (let index in _this.filter.senddpetid) {
                        if (_this.filter.senddpetid[index].deptid == item.deptid) {
                            _this.filter.senddpetid[index]['select'] = true;
                        }
                    }
                }
                // this.$forceUpdate();
            },
            getDate(type) {
                const date = new Date();
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();

                if (type === 'start') {
                    year = year - 60;
                } else if (type === 'end') {
                    year = year + 2;
                }
                month = month > 9 ? month : '0' + month;;
                day = day > 9 ? day : '0' + day;
                return `${year}-${month}-${day}`;
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
