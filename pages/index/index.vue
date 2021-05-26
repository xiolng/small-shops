<template>
	<view class="index-box">
		<!-- logo -->
		<u-image :src="details.shopLogo" width="100%" height="400rpx" border-radius="60" />
		<view class="shop-box">
			<view class="shop-title">
				<!-- <u-icon name="home" size="36rpx"></u-icon> -->
				<text class="item-name">{{ details.shopName }}</text>
				<view class="title-tip">
					<text class="txt">小店</text>
				</view>
			</view>
		</view>
		<view class="shop-detail">
			<view class="item-box">
				<u-icon name="phone" size="30rpx" />
				<text class="item-name" @click="callPhone(details.shopTel)">{{ details.shopTel }}</text>
			</view>
			<view class="item-box">
				<u-icon name="clock" size="30rpx"></u-icon>
				<text class="item-name">{{ details.businessHour }}</text>
			</view>
			<view class="item-box">
				<u-icon name="tags" size="36rpx"></u-icon>
			<text class="item-name">{{ details.businessRange }}</text>
			</view>
			<view class="item-box">
				<u-icon name="car" size="36rpx" />
			<text class="item-name">{{ details.shopAddress }}</text>
			</view>
			<view class="item-box">
				<u-icon name="info-circle" size="36rpx" />
			<text class="item-name">{{ details.shopDetail }}</text>
			</view>
		</view>
		
		<!-- 热卖 -->
		<view class="hot-box">
			<view class="hot-content">
				<view class="hot-item" v-for="(item, index) in shopList" :key="index" @click="goDetail(item)">
					<view class="hot-img"><u-image :src="BASE_URL + '/files/' + item.productCover" height="300"></u-image></view>
					<view class="hot-name">{{ item.productName }}</view>
					<view class="hot-info">{{item.productIntro}}</view>
					<view class="price-box">
						<u-button
							type="primary"
							size="small"
							:customStyle="{width: '100%'}"
						>立即抢购</u-button>
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
		console.log('sss', this.$u.sys(), this.$u.os());
	},
	methods: {
		getDetail() {
			this.$u.api.getShop().then(res => {
				if (res.data.code === '200') {
					this.details = res.data.data;
					this.details.shopLogo = `${BASE_URL}/files/${res.data.data.shopLogo}`;
					uni.setStorageSync('shopDetail', this.details);
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
		callPhone(phone) {
			uni.makePhoneCall({
				phoneNumber: phone
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
	background: #eee;
	.mr-30 {
		margin: 30rpx 20rpx 10rpx;
	}
	.u-icon {
		color: $u-type-primary;
	}
	.shop-box {
		height: 80rpx;
		padding: 10rpx;
		position: relative;
		z-index: 9;
		box-sizing: border-box;
		margin-top: -80rpx;
		background: linear-gradient(to right, #F9BF00, #FCD364);
	}
	.shop-title {
		display: flex;
		align-items: center;
		font-size: 40rpx;
		color: #ffffff;
		.title-tip{
			width: 70rpx;
			height: 30rpx;
			background: linear-gradient(to right, #85a1bd, #0d1d3e);
			font-size: 20rpx;
			text-align: center;
			border-radius: 6rpx;
			transform: skewX(-30deg);
			margin-left: 30rpx;
			.txt{
				width: 100%;
				height: 100%;
				display: block;
				transform: skewX(30deg);
			}
		}
	}
	.shop-detail{
		padding: 20rpx;
		background: #fff;
		display: flex;
		flex-wrap: wrap;
		.item-box{
			margin: 0 20rpx 20rpx 0;
		}
	}
	.hot-box {
		width: 100%;
		.hot-content {
			display: flex;
			justify-content: space-evenly;
			flex-wrap: wrap;
			padding: 10rpx;
			.hot-item {
				width: calc(50% - 40rpx);
				background-color: #f9f9f9;
				// flex-grow: 1;
				margin: 20rpx auto;
				box-sizing: border-box;
				box-shadow: -2rpx 4rpx 9rpx 2rpx rgba($color: #000000, $alpha: 0.1);
				border-radius: 10rpx;
				padding: 20rpx;
				.hot-img {
					border-bottom: 1px solid #eee;
				}
				.hot-name {
					font-size: 32rpx;
					margin: 10rpx 0;
				}
				.hot-info{
					color: #999;
					font-size: 24rpx;
					margin-bottom: 10rpx;
				}
				.price-box {
					.u-btn{
						width: 100%;
						font-size: 20rpx;
						padding-top: 10rpx;
						padding-bottom: 10rpx;
					}
				}
			}
		}
	}
}
</style>
