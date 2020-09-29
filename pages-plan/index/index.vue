<template>
	<view class="container">
		<view class="main">
			<home class="fadeIn"></home>
		</view>
		<!-- <tabbar></tabbar> -->
	</view>
</template>

<script>
	import tabbar from '../components/tabbar'
	import home from '../home'
	export default {
		components: {
			tabbar,
			home,
		},
		data() {
			return {
				
			}
		},
		computed: {
			
		},
		methods: {

		},
		onShow: function() {
			
		},
        onHide: function() {
			
        },
        onUnload: function() {
			
        },
	}
</script>

<style scoped lang="scss">
	.container {}
</style>
