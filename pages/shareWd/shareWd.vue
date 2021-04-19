<template>
	<view>
		<u-loading />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad(option) {
			uni.reLaunch({
				url: `/pages/Goods/GoodsDetail?id=${option.id}`
			})
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
