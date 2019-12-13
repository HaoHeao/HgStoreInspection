<template>
    <view class="container">
        <view class="top"></view>
        <view class="screen depart" v-if="type == 1">
            <view class="title">通知部门:</view>
            <view class="select-item select-depart" v-if="isDepartmentListLength">
                <block v-for="(item,index) of departmentList" :key="index">
                    <view class="item fadeIn" @click="delCondition({type:1,item})" v-if="item.select == true">
                        <view class="name">{{item.deptname}}</view>
                    </view>
                </block>
            </view>
            <view class="zero-depart fadeIn" v-if="isDepartmentListLength == 0">尚未选择部门</view>
            <view class="line"></view>
            <view class="title">选择部门:</view>
            <view class="select-item">
                <view v-for="(item,index) of departmentList" :key="index" :class="['item fadeIn',item.select?'active':'']"
                    @click="addCondition({type:1,item})">
                    <view class="name">{{item.deptname}}</view>
                </view>
            </view>
            <view class="control">
                <view class="btn back" @click="reset(1)">重置</view>
                <view class="btn confirm" @click="confirm()">确定（{{isDepartmentListLength}}）部门</view>
            </view>
        </view>
        <view class="screen person" v-if="type == 2">
            <view class="line"></view>
            <view class="title">主要领导:</view>
            <view class="select-item leader-list">
                <view v-for="(item,index) of person.leaderlist" :key="index" :class="['item',item.select?'active':'']"
                    @click="addCondition({type:2,item})">
                    <view class="name">{{item.username}}</view>
                    <view class="postion" v-if="item.postion">{{item.postion}}</view>
                </view>
            </view>
            <block v-for="(item,index) of person.deptuserlist" :key="index">
                <view class="title">{{item.deptname}}:</view>
                <view class="select-item bottom">
                    <view v-for="(it,ind) of item.userlist" :key="ind" :class="['item',it.select?'active':'']" @click="addCondition({type:2,item:it})">
                        <view class="name">{{it.username}}</view>
                        <view class="postion" v-if="it.postion">{{it.postion}}</view>
                    </view>
                </view>
            </block>
            <view class="control">
                <view class="btn back" @click="reset(2)">重置</view>
                <view class="btn confirm" @click="confirm()">确定（{{isPersonListLength}}）人</view>
            </view>
        </view>
    </view>
</template>

<script>
    let app = getApp();
    export default {
        data() {
            return {
                type: 1,
                isDepartmentListLength: 0,
                isPersonListLength: 0
            }
        },
        computed: {
            departmentList() {
                return this.$store.state.market.addMarket.departmentList;
            },
            person() {
                return this.$store.state.market.addMarket.person;
            }
        },
        onLoad: function(option) {
            this.type = option.type;
			console.table(this.departmentList)
        },
        onShow: function() {
            if(this.type == 1){
                uni.setNavigationBarTitle({
                    title: "通知部门"
                });
            }else if(this.type == 2){
                uni.setNavigationBarTitle({
                    title: "通知人员"
                });
            }
            this.isDepartmentListLength = this.isSelectListLength(this.departmentList);
            let userlistLength = 0;
            for (let item of this.person.deptuserlist) {
                userlistLength += this.isSelectListLength(item.userlist)
            }
            this.isPersonListLength = (this.isSelectListLength(this.person.leaderlist) + userlistLength);
        },
        methods: {
            reset: function(type) {
                // 重置
                if (type == 1) {
                    let departmentList = this.departmentList;
                    for (let item of departmentList) {
                        item.select = false;
                    }
					console.log(departmentList)
                    this.$store.commit("setAddDepart", departmentList);
                    this.isDepartmentListLength = this.isSelectListLength(departmentList);
                } else if (type == 2) {
                    let person = this.person;
                    let leaderlist = person.leaderlist,
                        deptuserlist = person.deptuserlist;
                    // leader
                    for (let item of leaderlist) {
                        item.select = false;
                    }
                    // deptuserlist
                    for (let item of deptuserlist) {
                        for (let itm of item.userlist) {
                            itm.select = false;
                        }
                    }
                    person = {
                        leaderlist,
                        deptuserlist
                    }
                    this.$store.commit("setAddPerson", person);
                    let userlistLength = 0;
                    for (let item of deptuserlist) {
                        userlistLength += this.isSelectListLength(item.userlist)
                    }
                    this.isPersonListLength = (this.isSelectListLength(leaderlist) + userlistLength);
                }
            },
            confirm: function() {
                uni.navigateBack({
                    delta: 1
                });
            },
            // 计算选中的数量
            isSelectListLength: function(data) {
                let num = 0,
                    _this = this;
                for (let item of data) {
                    if (item.select == true) {
                        num += 1;
                    }
                }
                return num;
            },
            // 添加条件
            addCondition: function(option) {
                console.log(option);
                if (option.type == 1) {
                    console.log(this.$store.state.market.marketDeptList)
                    let departmentList = this.departmentList;
                    for (let index in departmentList) {
                        if (departmentList[index].deptid == option.item.deptid) {
                            if (departmentList[index].select == true) {
                                departmentList[index].select = false;
                            } else {
                                departmentList[index].select = true;
                            }
                        }
                    }
                    this.$store.commit("setAddDepart", departmentList);
                    this.isDepartmentListLength = this.isSelectListLength(departmentList);
                } else if (option.type == 2) {
                    let person = this.person;
                    let leaderlist = person.leaderlist,
                        deptuserlist = person.deptuserlist;
                    // leader
                    for (let index in leaderlist) {
                        if (leaderlist[index].userid == option.item.userid) {
                            if (leaderlist[index].select == true) {
                                leaderlist[index].select = false;
                            } else {
                                leaderlist[index].select = true;
                            }
                        }
                    }
                    // deptuserlist
                    for (let item of deptuserlist) {
                        for (let index in item.userlist) {
                            if (item.userlist[index].userid == option.item.userid) {
                                if (item.userlist[index].select == true) {
                                    item.userlist[index].select = false;
                                } else {
                                    item.userlist[index].select = true;
                                }
                            }
                        }
                    }
                    person = {
                        leaderlist,
                        deptuserlist
                    }
                    this.$store.commit("setAddPerson", person);
                    let userlistLength = 0;
                    for (let item of deptuserlist) {
                        userlistLength += this.isSelectListLength(item.userlist)
                    }
                    this.isPersonListLength = (this.isSelectListLength(leaderlist) + userlistLength);
                }
            },
            // 删除条件
            delCondition: function(option) {
                if (option.type == 1) {
                    let departmentList = this.departmentList;
                    for (let index in departmentList) {
                        if (departmentList[index].deptid == option.item.deptid) {
                            departmentList[index].select = false;
                        }
                    }
                    this.$store.commit("setAddDepart", departmentList);
                    this.isDepartmentListLength = this.isSelectListLength(departmentList);
                } 
            }
        }
    }
</script>

<style scoped lang="scss">
    .container {
        padding-bottom: env(safe-area-inset-bottom);

        .top {
            width: 100%;
            background: #FBFCFD;
            height: 30rpx;
        }

        // 筛选
        .screen {
            width: 750rpx;
            height: calc(100vh - 130rpx);
            background: #fff;
            overflow-y: scroll;
            position: relative;
            padding-bottom: 120rpx;

            .line {
                width: 100%;
                height: 1rpx;
                background: #EDEEEF;
            }

            .title {
                padding: 30rpx;
                padding-bottom: 10rpx;
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

            .select-item {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                padding: 0rpx 30rpx;

                .item {
                    width: calc(33.3% - 12rpx);
                    // height: 60rpx;
                    background: #F3F5F7;
                    color: #647685;
                    margin-bottom: 16rpx;
                    margin-right: 16rpx;
                    text-align: center;
                    border-radius: 6rpx;
                    border: 2rpx solid #F3F5F7;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    box-sizing: border-box;
                    padding-bottom: 5px;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;

                    &:active {
                        background: #fff;
                    }

                    .name {
                        width: 100%;
                        margin-top: 10rpx;
                    }

                    .postion {
                        width: 100%;
                        height: auto;
                        font-size: 20rpx;
                        color: #999;
                    }
                }

                .item.active {
                    border: 2rpx solid #1BA1F3;
                    color: #1BA1F3;
                    background: #fff;

                    .postion {
                        color: #1BA1F3;
                    }
                }

                .item:nth-child(3n) {
                    margin-right: 0;
                }
            }

            .select-item.bottom {
                margin-bottom: 1rpx solid #EDEEEF;
            }

            .select-item.select-depart {
                min-height: 150rpx;

                .item {
                    max-height: 60rpx;
                }
            }

            .zero-depart {
                width: 100%;
                height: 150rpx;
                line-height: 130rpx;
                text-align: center;
                color: #C1C7CE;
                font-size: 24rpx;
                font-weight: 700;
            }

        }

        .person {
            .select-item.leader-list {
                min-height: 0;
            }
        }

        .control {
            width: 100%;
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 1;
            display: flex;
            margin-bottom: env(safe-area-inset-bottom);

            .btn {
                width: 50%;
                height: 100rpx;
                line-height: 100rpx;
                font-size: 28rpx;
                color: #545658;
                text-align: center;
                background: #F6F7F9;

                &:active {
                    opacity: 0.9;
                }
            }

            .btn.confirm {
                background: #647685;
                color: #fff;
            }

            .btn.back {
                color: #545658;
            }
        }
    }
</style>
