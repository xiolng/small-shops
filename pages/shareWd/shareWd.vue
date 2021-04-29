<template>
	<view style="width: 100%; height: 100vh; display: flex; align-items: center; flex-direction: column; padding-top: 100rpx;">
		<u-loading size='100' :color='colors' />
		<text style="font-size: 30rpx; margin-top: 20rpx;">加载中。。。</text>
		</view>
</template>

<script>
export default {
	data() {
		return {
			colors: this.$u.color.primary
		};
	},
	onLoad(option) {
		console.log('options', option);
		if (option.id) {
			uni.reLaunch({
				url: `/pages/Goods/GoodsDetail?id=${option.id}`
			});
		}
		if (option.scene) {
			this.$u.api
				.getShareParam({
					id: option.scene
				})
				.then(res => {
					if (res.data.code === '200') {
						console.log(res.data.data);
						const [typeData, idData] = res.data.data.split('?');
						const type = typeData.split('=')[1];
						const id = idData.split('=')[1];
						switch (type) {
							case '1':
								uni.reLaunch({
									url: `/pages/Goods/GoodsDetail?id=${id}`
								});
								break;
							default:
								uni.reLaunch({
									url: `/pages/index/index`
								});
						}
					}
				});
		}
	},
	methods: {}
};
</script>

<style></style>
