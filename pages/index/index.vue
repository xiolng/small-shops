<template>
	<view class="index-box">
		<u-swiper :list="bannerList" :height="390" @click="clickImg" :custom-style="{ background: '#fff' }" />
		<!-- menu -->
		<view style="padding: 20rpx; background: #fff;">
			<u-grid :col="4" :border="false">
				<u-grid-item
					v-for="(item, index) in districtList"
					:key="item.kingDistrictId"
					bg-color="#fff"
					:custom-style="{ background: '#fff', width: 'calc(100% - 20rpx)', borderRadius: '10%' }"
				>
					<u-image :src="BASE_URL + '/files/' + item.districtIcon" width="54rpx" height="54rpx" />
					<view class="grid-text" style="color: #999; margin-top: 10rpx;">{{ item.districtName }}</view>
				</u-grid-item>
			</u-grid>
		</view>

		<!-- 热销商品 -->
		<view class="hot-product" :class="inx == 0 && 'red'" v-for="(list, inx) in windowList" :key="list.showWindowId">
			<view class="product-title">
				<view class="title-box">
					<u-avatar :src="BASE_URL + '/files/' + list.showIcon" size="39" />
					<view class="title">{{ list.showName }}</view>
				</view>
				<view class="more-box">
					<view class="more-txt">更多</view>
					<u-icon name="arrow-right" />
				</view>
			</view>
			<view class="product-content">
				<view class="product-list">
					<view class="product-item" v-for="(item, index) in list.productList" :key="index" @click="goDetail(item)">
						<view class="product-img"><u-image :src="BASE_URL + '/files/' + item.productCover" height="243"></u-image></view>
						<view class="product-name u-line-1">{{ item.productName }}</view>
						<view class="price-box">
							<view class="price-item">￥</view>
							<view class="price-txt u-line-1">{{ item.productPrice }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 热卖 -->
		<view style="padding-top: 10rpx; background: #fff;">
			<view class="window-title">
				<u-icon name="heart" style="font-size: 43rpx; color: #DC2626; margin-right: 6rpx;" />
				<view class="window-name">猜你喜欢</view>
			</view>
			<view class="hot-box">
				<view class="hot-content">
					<view class="hot-item" v-for="(item, index) in shopList" :key="index" @click="goDetail(item)">
						<view class="left">
							<view class="hot-img"><u-image :src="BASE_URL + '/files/' + item.productCover" height="191"></u-image></view>
						</view>
						<view class="right">
							<view class="hot-name">{{ item.productName }}</view>
							<view class="hot-info">{{ item.productIntro }}</view>
							<view class="price-box">
								<view class="price-item">￥</view>
							<view class="price-txt">{{ item.productPrice }}</view>
							</view>
						</view>
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
			bannerList: [],
			districtList: [],
			windowList: [],
			shopList: []
		};
	},
	onLoad() {
		const vm = this;
	},
	mounted() {
		this.getHotShop();
		this.getDistrict();
		this.getBanner();
		this.getWindow();
	},
	methods: {
		getWindow() {
			this.$u.api.listShowWindow().then(res => {
				if (res.data.code == '200') {
					this.windowList = res.data.data;
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
		getDistrict() {
			this.$u.api.listKingDistrict().then(res => {
				if (res.data.code == '200') {
					this.districtList = res.data.data;
				}
			});
		},
		getBanner() {
			this.$u.api.listShopBanner().then(res => {
				if (res.data.code == '200') {
					this.bannerList = res.data.data
						.sort((a, b) => a.sort - b.sort)
						.map(v => {
							v.image = BASE_URL + '/files/' + v.bannerImage;
							v.title = v.bannerName;
							return v;
						});
				}
			});
		},
		clickImg(index) {
			const item = this.bannerList[index];
			uni.navigateTo({
				url: item.bannerUrl
			});
		},
		goDetail(item1) {
			const data = {
				id: item1.productId
			};
			if (item1.productType == 1) {
				data.productType = 1;
			}
			this.$u.route({
				url: `/pages/Goods/GoodsDetail`,
				params: {
					...data
				}
			});
		}
	}
};
</script>

<style lang="scss">
.index-box {
	background: #efefef;
	.mr-30 {
		margin: 30rpx 20rpx 10rpx;
	}

	.hot-product {
		margin: 0 0 20rpx;
		background: #fff;
		&.red {
			background: linear-gradient(180deg, red, #fff, #fff);
			.product-title {
				color: #fff;
			}
		}

		.product-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 10rpx 30rpx;
			.title-box {
				display: flex;
				align-items: center;
				margin: 20rpx;
				.title {
					font-size: 28rpx;
				}
			}
			.more-box {
				display: flex;
				align-items: center;
			}
		}
		.product-content {
			margin: 0 20rpx 20rpx;
			background: #fff;
			overflow: hidden;
			overflow-x: auto;
			.product-list {
				padding: 10rpx;
				display: flex;
				flex-wrap: nowrap;
				.product-item {
					width: 234rpx;
					flex-grow: 1;
					flex-shrink: 0;
					margin: 10rpx;
					padding: 10rpx;
					border: 1rpx solid #eee;
					border-radius: 10rpx;
					.product-img {
						width: 100%;
						margin-bottom: 10rpx;
					}
					.product-name {
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						word-wrap: normal;
						white-space: nowrap;
						margin-bottom: 10rpx;
					}
					.price-box {
						color: #dc2626;
						display: flex;
						align-items: center;
						.price-item {
							font-size: 24rpx;
						}
						.price-txt {
							font-size: 28rpx;
						}
					}
				}
			}
		}
	}

	.window-title {
		background: #fff;
		display: flex;
		margin: 30rpx 0 0;
		align-items: center;
		justify-content: center;
		padding-left: 20rpx;
		.window-name {
			font-size: 34rpx;
			border-bottom: 4rpx solid #DC2626;
		}
	}
	/* 猜你喜欢 */
	.hot-box {
		width: 100%;
		.hot-content {
			padding: 10rpx;
			.hot-item {
				display: flex;
				margin: 20rpx auto;
				box-sizing: border-box;
				box-shadow: -2rpx 4rpx 9rpx 2rpx rgba($color: #000000, $alpha: 0.1);
				border-radius: 10rpx;
				border-bottom: 1rpx solid #efefef;
				padding: 20rpx;
				.left {
					width: 100rpx;
					flex-grow: 1;
					flex-shrink: 0;
					.hot-img {
						border-bottom: 1px solid #eee;
					}
				}
				.right {
					display: flex;
					flex-grow: 2;
					flex-direction: column;
					justify-content: space-between;
					.hot-name {
						font-size: 32rpx;
						margin: 10rpx 0;
					}
					.hot-info {
						color: #999;
						font-size: 24rpx;
						margin-bottom: 10rpx;
					}
					.price-box {
						display: flex;
						color: #DC2626;
						.price-item{
							font-size: 24rpx;
						}
						.price-txt{
							font-size: 28rpx;
						}
					}
				}
			}
		}
	}
}
</style>
