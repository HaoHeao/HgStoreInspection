<template>
    <view class="container">
        <view v-if="type == 1">
            <view class="title">原手机号</view>
            <input type="number" class="input-view" v-model="oldPhone" placeholder="请填写原手机号">
            <view class="title">新手机号</view>
            <input type="number" class="input-view" v-model="newPhone" placeholder="请填写新手机号">
            <view class="confirm-btn" @click="confirmSelectPhone()">确认修改</view>
        </view>
        <view v-if="type == 2">
            <view class="title">原密码</view>
            <input type="text" class="input-view" v-model="oldPwd" placeholder="请填写原密码">
            <view class="title">新密码</view>
            <input type="text" class="input-view" v-model="newPwd" placeholder="请填写新密码">
            <view class="title">确认密码</view>
            <input type="passowrd" class="input-view" v-model="confPwd" placeholder="请再次确认新密码">
            <view class="confirm-btn" @click="confirmSelectPwd()">确认修改</view>
        </view>
    </view>
</template>

<script>
    let globalData = getApp().globalData;
    let app = getApp().$vm;
    let utils = require('@/util/utils.js');
    let api = utils.api;
    let request = utils.request;
    export default {
        data() {
            return {
                type: 1,
                oldPhone: "",
                newPhone: "",
                oldPwd: '',
                newPwd: '',
                confPwd: ''
            }
        },
        methods: {
            confirmSelectPhone: function() {
                let _this = this;
                this.oldPhone = app.trim(this.oldPhone)
                this.newPhone = app.trim(this.newPhone)
                if (this.oldPhone == "") {
                    uni.showToast({
                        icon: "none",
                        title: "请填写原手机号"
                    })
                    return;
                }
                if (this.newPhone == "") {
                    uni.showToast({
                        icon: "none",
                        title: "请填写新手机号"
                    })
                    return;
                }
                let data = {
                    userid: uni.getStorageSync('userinfo').userid,
					
                    oldmobile: _this.oldPhone,
                    newmobile: _this.newPhone
                }
				console.log("手机号修改",data)
                api.revisePhoneNumber(data)
                    .then(data => {
                        let [err, res] = data;
                        console.log("手机号修改:", res)
                        if (res.data.success) {
                            uni.showModal({
                                content: "手机号修改成功",
                                showCancel: false,
                                success: () => {
                                    uni.navigateBack({
                                        delta: 1
                                    })
                                }
                            })
                        } else {
                            uni.showModal({
                                content: res.data.errmsg,
                                showCancel: false
                            })
                        }
                    })
            },
            confirmSelectPwd: function() {
                let _this = this;
                this.oldPwd = app.trim(this.oldPwd)
                this.newPwd = app.trim(this.newPwd)
                this.confPwd = app.trim(this.confPwd)
                if (this.oldPwd == '') {
                    uni.showToast({
                        icon: "none",
                        title: "请填写原密码"
                    })
                    return;
                }
                if (this.newPwd == '') {
                    uni.showToast({
                        icon: "none",
                        title: "请填写新密码"
                    })
                    return;
                }
                if (this.newPwd != this.confPwd) {
                    uni.showToast({
                        icon: "none",
                        title: "两次密码输入不一致！"
                    })
                    return;
                }
                let data = {
                    userid: uni.getStorageSync('userinfo').userid,
                    oldpwd: this.oldPwd,
                    newpwd: this.confPwd
                }
				console.log("密码修改",data)
                api.revisePwd(data)
                    .then(data => {
                        let [err, res] = data;
                        console.log(res)
                        if (res.data.success) {
                            uni.showModal({
                                content: "密码修改成功",
                                showCancel: false,
                                success: () => {
                                    uni.navigateBack({
                                        delta: 1
                                    })
                                }
                            })
                        } else {
                            uni.showModal({
                                content: res.data.errmsg,
                                showCancel: false
                            })
                        }
                    })
            }
        },
        onLoad: function(option) {
            this.type = option.type;
            console.log(option)
        }
    }
</script>

<style scoped lang="scss">
    .container {
        .title {
            color: #647484;
            font-size: 26rpx;
            font-weight: 800;
            margin: 20rpx 0rpx 10rpx 50rpx;
        }

        .input-view {
            width: calc(100% - 60rpx);
            height: 88rpx;
            font-size: 26rpx;
            background: #F3F5F7;
            border-radius: 10rpx;
            margin: 0rpx 30rpx;
            padding: 26rpx 10rpx 26rpx 20rpx;
            box-sizing: border-box;
        }

        .confirm-btn {
            width: calc(100% - 60rpx);
            height: 80rpx;
            margin: 30rpx;
            margin-top: 100rpx;
            background: #647484;
            color: #fff;
            border-radius: 40rpx;
            text-align: center;
            line-height: 80rpx;
            letter-spacing: 3rpx;
            font-weight: 800;

            &:active {
                opacity: 0.9;
            }
        }
    }
</style>
