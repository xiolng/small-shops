<template>
	<view class="index-box">
		<!-- logo -->
		<u-image :src="details.shopLogo" width="100%" height="400rpx" border-radius="60" />
		<view class="shop-box">
			<view class="shop-title mr-30">
				<!-- <u-icon name="home" size="36rpx"></u-icon> -->
				<text class="item-name">{{ details.shopName }}</text>
			</view>
		</view>
		<view class="shop-phone mr-30">
			<view>
				<u-icon name="phone" size="30rpx" />
				<text class="item-name">{{ details.shopTel }}</text>
			</view>
			<view class="shop-time mr-30">
				<u-icon name="clock" size="30rpx"></u-icon>
				<text class="item-name">{{ details.businessHour }}</text>
			</view>
		</view>
		<view class="shop-info mr-30">
			<u-icon name="tags" size="36rpx"></u-icon>
			<text class="item-name">{{ details.businessRange }}</text>
		</view>
		<view class="shop-address mr-30">
			<u-icon name="car" size="36rpx" />
			<text class="item-name">{{ details.shopAddress }}</text>
		</view>
		<view class="shop-detail mr-30">
			<u-icon name="info-circle" size="36rpx" />
			<text class="item-name">{{ details.shopDetail }}</text>
		</view>
		<!-- 热卖 -->
		<u-sticky><view class="hot-title">热卖商品</view></u-sticky>
		<view class="hot-box">
			<view class="hot-content">
				<view class="hot-item" v-for="(item, index) in shopList" :key="index" @click="goDetail(item)">
					<view class="hot-img"><u-image :src="BASE_URL + '/files/' + item.productCover" height="300"></u-image></view>
					<view class="hot-name">{{ item.productName }}</view>
					<view class="price-box">
						<!-- <view class="price-txt">￥{{ item.productPrice }}</view> -->
						<view class="price-icon"><u-icon name="shopping-cart-fill"></u-icon></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
export default {
	data() {
		return {
			BASE_URL,
			details: {},
			shopList: []
		};
	},
	onLoad() {
		this.getDetail();
		this.getHotShop();
	},
	methods: {
		getDetail() {
			this.$u.api.getShop().then(res => {
				if (res.data.code === '200') {
					this.details = res.data.data;
					this.details.shopLogo = `${BASE_URL}/files/${res.data.data.shopLogo}`;
					uni.setStorageSync('shopDetail', this.details)
				}
			});
		},
		getHotShop() {
			this.$u.api.getBaseShell().then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					this.shopList = data;
				}
			});
		},
		goDetail(item1) {
			this.$u.route({
				url: `/pages/Goods/GoodsDetail`,
				params: {
					id: item1.productId
				}
			});
		},
	}
};
</script>

<style lang="scss">
.index-box {
	.mr-30 {
		margin: 30rpx 20rpx 10rpx;
	}
	.u-icon {
		color: $u-type-primary;
	}
	.shop-box {
		padding: 20rpx;
		position: relative;
		z-index: 9;
		margin-top: -130rpx;
		background-color: rgba($color: #000000, $alpha: 0.5);
		border-radius: 60rpx;
	}
	.shop-title {
		font-size: 40rpx;
		color: #ffffff;
	}
	.shop-phone {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.shop-address {
		display: flex;
		align-items: center;
		.u-icon {
			margin-right: 10rpx;
		}
	}
	.shop-info {
		display: flex;
		align-items: center;
		.u-icon {
			margin-right: 10rpx;
		}
	}
	.hot-title {
		font-size: 40rpx;
		padding: 40rpx 20rpx 20rpx;
		background-color: #ffffff;
	}
	.hot-box {
		width: 100%;
		.hot-content {
			display: flex;
			flex-wrap: wrap;
			padding: 0 20rpx;
			.hot-item {
				width: calc(50% - 40rpx);
				background-color: #f9f9f9;
				// flex-grow: 1;
				margin: 20rpx;
				box-sizing: border-box;
				box-shadow: 0 0 13rpx 4rpx rgba($color: #000000, $alpha: 0.1);
				padding: 20rpx;
				.hot-img {
					border-bottom: 1px solid #eee;
				}
				.hot-name {
					font-size: 32rpx;
					margin: 10rpx 0;
				}
				.price-box {
					display: flex;
					justify-content: space-between;
					.price-txt {
						color: $u-type-error;
					}
					.price-icon {
					}
				}
			}
		}
	}
}
</style>
