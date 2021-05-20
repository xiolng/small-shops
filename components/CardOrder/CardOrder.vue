<template>
	<view class="card-order">
		<!-- 底部菜单栏 -->
		<view class="navigation">
			<view class="right" @click="showCard = !showCard">
				<!-- <view
				class="cart btn u-line-1"
				@click="
					showPay = false;
					showCar = true;
				"
			>
				加入购物车
			</view> -->
				<view class="badge-box">
					<u-icon name="shopping-cart-fill" color="#fff" size="40" />
					<u-badge type="error" :count="cardData.total || cardData.data.length || 0" :offset="[-16, -16]" />
				</view>
				<view class="all-price">
					<text class="price-icon">￥</text>
					{{ allPrice.toFixed(2) }}
				</view>
				<u-button type="primary" shape="circle" size="medium" class="buy btn u-line-1" v-if="cardData.data.length" @click.stop="payProduct">结算</u-button>
			</view>
		</view>
		<!-- 立即购买 -->

		<u-top-tips ref="uTips" />
		<u-popup v-model="showCard" mode="bottom" :custome-style="{ borderRadius: '20rpx 20rpx 0 0' }" safe-area-inset-bottom>
			<view class="card-box" style="padding-bottom: 120rpx;">
				<view class="card-title">
					<view class="left-label">已选商品</view>
					<view class="right-clear" @click="clearCard" v-if="cardData && cardData.data.length">
						<u-icon name="trash-fill" />
						<text>清空购物车</text>
					</view>
				</view>
				<view class="card-content">
					<view class="card-list" v-if="cardData && cardData.data.length">
						<view class="card-item" v-for="(item, index) in cardData.data" :key="index">
							<view class="item-img"><u-image width="100rpx" height="100rpx" :src="`${BASE_URL}/files/${item.productCover}`" /></view>
							<view class="item-box">
								<view class="item-title u-line-1">{{ item.productName }}</view>
								<view class="item-price">
									<view class="price-box">
										<text class="price-icon">￥</text>
										<text class="price-num">{{ item.productPrice }}</text>
									</view>
									<view class="item-num"><price-number :price="item.productNumber" @getPrice="$emit('getPrice', $event, item)"></price-number></view>
								</view>
							</view>
						</view>
					</view>
					<u-empty mode="car" v-else />
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import {BASE_URL} from '@/Api/BASE_API.js';
import PriceNumber from '@/components/PriceNumber/PriceNumber.vue';
export default {
	components: {
		PriceNumber
	},
	props: {
		cardData: {
			type: Object,
			default: {
				data: []
			}
		}
	},
	data() {
		return {
			BASE_URL,
			productType: 0,
			showCard: false,
			cardIndex: 0
		};
	},
	onShow() {
console.log('BASE_URL', BASE_URL)},
	methods: {
		clearCard() {
			this.$u.api
				.clearShoppingCart({
					memberShoppingCartId: this.cardData.data[0].memberShoppingCartId
				})
				.then(res => {
					if (res.data.code === '200') {
						this.$refs.uTips.show({
							type: 'success',
							title: '已清空购物车'
						});
						this.$emit('getCarLength');
					}
				});
		},
		payProduct() {
			uni.navigateTo({
				url: `/pages/Pay/CreateOrder`
			});
		}
	},
	computed: {
		/**
		 * 总价格
		 */
		allPrice: {
			get: function() {
				let allPrice = 0;
				console.log('this.card', this.cardData);
				this.cardData &&
					this.cardData.data &&
					this.cardData.data.length &&
					this.cardData.data.map(v => {
						allPrice += v.productNumber * v.productPrice;
					});
				return allPrice;
			}
		}
	}
};
</script>

<style lang="scss">
@import 'uView-ui/libs/css/color.scss';
.card-order {
	width: 100%;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	margin-top: 100rpx;
	border: solid 2rpx #f2f2f2;
	background-color: #ffffff;
	padding: 16rpx 0;
	z-index: 29999;
	.navigation {
		width: 100%;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		margin-top: 100rpx;
		border: solid 2rpx #f2f2f2;
		background-color: #ffffff;
		padding: 16rpx 0;
		z-index: 29999;
		.left {
			display: flex;
			font-size: 20rpx;
			.item {
				margin: 0 30rpx;
				&.car {
					text-align: center;
					position: relative;
					.car-num {
						position: absolute;
						top: -10rpx;
						right: -10rpx;
					}
				}
			}
		}
		.right {
			height: 90rpx;
			background-color: rgba(61, 61, 63, 0.9);
			font-size: 28rpx;
			display: flex;
			flex-grow: 1;
			align-items: center;
			justify-content: space-between;
			padding: 10rpx 20rpx 10rpx 20rpx;
			margin: 0 20rpx;
			border-radius: 100rpx;
			position: relative;
			.badge-box {
				width: 90rpx;
				height: 90rpx;
				background-color: $u-type-primary;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 100%;
				position: absolute;
				left: 20rpx;
				top: -30rpx;
				border: 10rpx solid #444;
			}
			.all-price {
				color: #fff;
				font-size: 40rpx;
				padding-left: 100rpx;
				.price-icon {
					font-size: 28rpx;
				}
			}
			.btn {
			}
			.cart {
				background-color: #ed3f14;
				margin-right: 30rpx;
			}
		}
	}
	.card-box {
		padding: 20rpx;
		.card-title {
			padding: 20rpx 0;
			border-bottom: 1px solid #eee;
			display: flex;
			justify-content: space-between;
			.left-label {
				font-size: 24rpx;
			}
			.right-clear {
				font-size: 24rpx;
			}
		}
		.card-content {
			padding: 20rpx 0;
			max-height: 600rpx;
			overflow: hidden;
			overflow-y: auto;
			.card-list {
				.card-item {
					display: flex;
					padding: 20rpx 0;
					border-bottom: 1rpx solid #eee;
					.item-img {
						width: 100rpx;
						height: 100rpx;
						flex-shrink: 0;
					}
					.item-box {
						display: flex;
						flex-direction: column;
						flex-grow: 1;
						justify-content: space-between;
						margin-left: 10rpx;
						.item-title {
							font-size: 30rpx;
						}
						.item-price {
							display: flex;
							justify-content: space-between;
							align-items: flex-end;
							.price-box {
								color: red;
								.price-icon {
									font-size: 24rpx;
								}
								.price-num {
									font-size: 30rpx;
								}
							}
							.item-num {
							}
						}
					}
				}
			}
		}
	}
	.item-menu-image {
		width: 180rpx;
		height: 180rpx;
		flex-shrink: 0;
	}
}
</style>
