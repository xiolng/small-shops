<template>
	<view class="index-box">
		<!-- logo -->
		<u-image :src="details.shopLogo" width="100%" height="400rpx" border-radius="60" />
		<view class="shop-box">
			<view class="shop-title">
				<!-- <u-icon name="home" size="36rpx"></u-icon> -->
				<text class="item-name">{{ details.shopName }}</text>
				<view class="title-tip"><text class="txt">小店</text></view>
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
		<!-- 优惠券列表 -->
		<view class="coupon-box">
			<view class="coupon-list" v-if="couponData.length" v-for="(list, inx) in couponData" :key="inx">
				<view class="coupon-item" :class="[item.couponType == 1 ? 'dedu' : '']" v-for="item in list.datas" :key="item.couponId" @click="item.isGain == 0 ? getQuery(item) : ''">
					<view class="coupon-top">
						<view class="coupon-name" v-if="item.couponType == 0">{{ item.couponName }} (满 {{ item.fullLimit }}元 - {{ item.deduAmount }}元)</view>
						<view class="coupon-name" v-else>{{ item.couponName }} (满 {{ item.fullLimit }}元 打 {{ item.deduProp }}折)</view>
						<view class="coupon-type">{{ item.couponType ? '折扣券' : '满减券' }}</view>
					</view>
					<view class="coupon-bot">
						<view class="left">
							<view class="dates">有效时间：{{ item.launchStartTime || item.startTime }}-{{ item.launchEndTime || item.endTime }}</view>
							<view class="used-range">适用范围：{{ item.usedRange ? '指定商品' : '全部商品' }}</view>
						</view>
						<view class="right">{{ item.isGain == 0 ? '未领取' : '已领取' }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 热卖 -->
		<view class="hot-box">
			<view class="hot-content">
				<view class="hot-item" v-for="(item, index) in shopList" :key="index" @click="goDetail(item)">
					<view class="hot-img"><u-image :src="BASE_URL + '/files/' + item.productCover" height="300"></u-image></view>
					<view class="hot-name">{{ item.productName }}</view>
					<view class="hot-info">{{ item.productIntro }}</view>
					<view class="price-box"><u-button type="primary" size="small" :customStyle="{ width: '100%' }">立即抢购</u-button></view>
				</view>
			</view>
		</view>
		<u-top-tips ref="uTips" />
		<u-mask mode="center" :show="showCoupon" :custom-style="{ background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }" class="coupon-pop" width="78%" @click="showCoupon = false" :zoom="false" closeable>
			<view class="coupon-box" style="margin-top: 62rpx;">
				<view class="coupon-list" v-if="couponData.length" v-for="(list, inx) in couponData" :key="inx">
					<view class="coupon-item" :class="[item.couponType == 1 ? 'dedu' : '']" v-for="item in list.datas" :key="item.couponId" @click="item.isGain == 0 ? getQuery(item) : ''">
						<view class="coupon-top">
							<view class="coupon-name" v-if="item.couponType == 0">{{ item.couponName }} (满 {{ item.fullLimit }}元 - {{ item.deduAmount }}元)</view>
							<view class="coupon-name" v-else>{{ item.couponName }} (满 {{ item.fullLimit }}元 打 {{ item.deduProp }}折)</view>
							<view class="coupon-type">{{ item.couponType ? '折扣券' : '满减券' }}</view>
						</view>
						<view class="coupon-bot">
							<view class="left">
								<view class="dates">有效时间：{{ item.launchStartTime || item.startTime }}-{{ item.launchEndTime || item.endTime }}</view>
								<view class="used-range">适用范围：{{ item.usedRange ? '指定商品' : '全部商品' }}</view>
							</view>
							<view class="right">
								{{ item.isGain == 0 ? '未领取' : '已领取' }}
								<view style="margin-top: 40rpx;" @click="item.isGain == 0 ? getQuery(item) : ''">立即领取</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
export default {
	data() {
		return {
			BASE_URL,
			details: {},
			shopList: [],
			couponData: [],
			showCoupon: false
		};
	},
	onLoad() {
		const vm = this;
		this.getDetail();
		this.getHotShop();
		console.log('sss', this.$u.sys(), this.$u.os());
		this.$u.api.sceneList().then(res => {
			console.log('sceneList1', res);
			res.data.data && res.data.data.length &&
				res.data.data.map((j, inx) => {
					vm.$u.api
						.getSceneBusinessByNo({
							sceneNo: j.sceneNo
						})
						.then(resd => {
							if (!resd.data.data || !resd.data.data.length) return false;
							const business = resd.data.data || [];
							console.log('getScene', resd);
							vm.$u.api.shopCouponList(JSON.stringify(business.map(b => b.businessId))).then(resde => {
								console.log('shopCouponList', resde);
								const sceneList = uni.getStorageSync('sceneList') || [];
								console.log(123, sceneList);
								if (sceneList.filter(nos => nos.sceneNo == j.sceneNo).length) return false;
								sceneList.push({
									sceneNo: j.sceneNo,
									busunessId: business.map(bu => bu.businessId),
									datas: resde.data.data
								});
								vm.couponData = sceneList;
								uni.setStorageSync('3', vm.couponData);
								uni.setStorageSync('sceneList', sceneList);
							});
						});
				});
		});
	},
	mounted() {
		this.couponData = uni.getStorageSync('sceneList') || [];
		console.log(1111, this.couponData);
	},
	methods: {
		getQuery(item) {
			this.$u.api
				.gainCoupon({
					couponId: item.couponId
				})
				.then(res => {
					const { code, data, msg } = res.data;
					this.showCoupon = false
					if (code == '200') {
						this.$refs.uTips.show({
							type: 'success',
							title: '领取成功'
						});
						item.isGain = !item.isGain;
					} else {
						this.$refs.uTips.show({
							type: 'error',
							title: msg
						});
					}
				});
		},
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
		background: linear-gradient(to right, #f9bf00, #fcd364);
	}
	.shop-title {
		display: flex;
		align-items: center;
		font-size: 40rpx;
		color: #ffffff;
		.title-tip {
			width: 70rpx;
			height: 30rpx;
			background: linear-gradient(to right, #85a1bd, #0d1d3e);
			font-size: 20rpx;
			text-align: center;
			border-radius: 6rpx;
			transform: skewX(-30deg);
			margin-left: 30rpx;
			.txt {
				width: 100%;
				height: 100%;
				display: block;
				transform: skewX(30deg);
			}
		}
	}
	.shop-detail {
		padding: 20rpx;
		background: #fff;
		display: flex;
		flex-wrap: wrap;
		.item-box {
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
				.hot-info {
					color: #999;
					font-size: 24rpx;
					margin-bottom: 10rpx;
				}
				.price-box {
					.u-btn {
						width: 100%;
						font-size: 20rpx;
						padding-top: 10rpx;
						padding-bottom: 10rpx;
					}
				}
			}
		}
	}
	.coupon-box {
		.coupon-list {
			padding: 20rpx;
			.coupon-item {
				background: #dd524d;
				border-radius: 20rpx;
				color: #fff;
				margin: 0 0 20rpx;
				padding: 20rpx;
				&.dedu {
					background: #f29100;
				}
				.coupon-top {
					border-bottom: 1px solid #fff;
					padding: 10rpx;
					display: flex;
					justify-content: space-between;
					.coupon-name {
						font-size: 28rpx;
					}
					.coupon-type {
						font-size: 28rpx;
					}
				}
				.coupon-bot {
					padding: 10rpx;
					display: flex;
					justify-content: space-between;
					.left {
						.dates {
							margin-bottom: 10rpx;
						}
						.used-range {
							font-size: 26rpx;
						}
					}
					.right {
						flex-shrink: 0;
						font-size: 30rpx;
					}
				}
			}
		}
	}
}
.coupon-pop {
	.u-mode-center-box {
		background: none;
	}
}
</style>
