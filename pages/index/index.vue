<template>
	<view class="index-box">
		<!-- logo -->
		<u-image src="/static/logo.png" width="100%" height="400rpx" />
		<view class="shop-item">
			<u-icon name="home" size="36rpx"></u-icon>
			<text class="item-name">谁的店铺1</text>
		</view>
		<view class="shop-item">
			<u-icon name="phone" size="36rpx" />
			<text class="item-name">15566664444</text>
		</view>
		<view class="shop-item">
			<u-icon name="clock" size="36rpx"></u-icon>
			<text class="item-name">8:00-16:00</text>
		</view>
		<view class="shop-item">
			<u-icon name="list-dot" size="36rpx"></u-icon>
			<text class="item-name">电器、家电</text>
		</view>
		<view class="shop-item">
			<u-icon name="car" size="36rpx" />
			<text class="item-name">吉林省长春市朝阳区1111号</text>
		</view>
		<view class="shop-item">
			<u-icon name="info-circle" size="36rpx" />
			<text class="item-name">吉林省长春市朝阳区1111号</text>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			details: {}
		};
	},
	onLoad() {
		this.getDetail();
	},
	methods: {
		getDetail() {
			this.$u.api.getShop().then(res => {
				if (res.data.code === '200') {
					this.details = res.data.data;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.index-box {
	.shop-item {
		padding: 20rpx;
		display: flex;
		align-items: center;
		.u-icon {
			color: rgba($color: $u-type-primary, $alpha: 0.5);
		}
		.item-name {
			margin-left: 20rpx;
		}
	}
}
</style>
