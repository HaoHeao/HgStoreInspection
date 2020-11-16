<template>
	<view class="container">
		<view class="main">
			<view class="fadeIn" v-if="storeshop.tabbarIndex == 0">
				<question></question>
			</view>
			<view class="fadeIn" v-if="storeshop.tabbarIndex == 2">
				<lately></lately>
			</view>
		</view>
		<tabbar></tabbar>
	</view>
</template>

<script>
	import tabbar from '../components/tabbar'
	import question from '../question/question'
	import lately from '../lately/lately'
	export default {
		components: {
			tabbar,
			question,
			lately
		},
		data() {
			return {

			}
		},
		computed: {
			storeshop() {
				return this.$store.state.storeshop;
			}
		},
		methods: {

		},
	}
</script>

<style scoped lang="scss">
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;

		.main {
			flex: 2;
		}
	}
</style>