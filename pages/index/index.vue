<template>
    <view class="container">
        <!-- <navbar></navbar> -->
        <view class="main">
            <view class="fadeIn" v-if="tabbarIndex == 0">
                <question :update="update"></question>
            </view>
            <view class="fadeIn" v-if="tabbarIndex == 2">
                <lately :update="update"></lately>
            </view>
            <!-- <view class="fadeIn" v-if="tabbarIndex == 3">
                <whole :update="update"></whole>
            </view>
            <view class="fadeIn" v-if="tabbarIndex == 4">
                <mine></mine>
            </view> -->
        </view>
        <tabbar></tabbar>
    </view>
</template>

<script>
    import tabbar from '@/components/tabbar'
    import question from '@/pages/question/question'
    import lately from '@/pages/lately/lately'
    import whole from '@/pages/whole/whole'
    import mine from '@/user/mine/mine'
    export default {
        data() {
            return {
                update: true
            }
        },
        methods: {

        },
        computed: {
            tabbarIndex() {
                return this.$store.state.tabbar.index
            }
        },
        onShow: function() {
            this.update = true;
        },
        onHide: function() {
            this.update = false;
        },
        onUnload: function() {
            this.update = false;
        },
        components: {
            tabbar,
            question,
            lately,
            whole,
            mine
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
    .container {}
</style>
