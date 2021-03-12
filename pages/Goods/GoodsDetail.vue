<template>
	<view class="goods-detail">
		<!-- logo -->
		<u-image :src="detail.productCover" width="100%" height="400rpx" />
		<view class="shop-item">
			<u-icon name="shopping-cart" size="36rpx"></u-icon>
			<text class="item-name">{{ detail.productName }}</text>
		</view>
		<view class="shop-item">
			<u-icon name="rmb-circle" size="36rpx" />
			<text class="item-name">{{ detail.productPrice }}</text>
		</view>
		<view class="shop-item">
			<u-icon name="tags" size="36rpx"></u-icon>
			<text class="item-name">{{ detail.productCategoryId }}</text>
		</view>
		<view class="shop-item">
			<u-icon name="info-circle" size="36rpx"></u-icon>
			<text class="item-name">{{ detail.productIntro }}</text>
		</view>
		<!-- 底部菜单栏 -->
		<view class="navigation">
			<view class="left">
				<view class="item" @click="callServer">
					<u-icon name="server-fill" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">客服</view>
				</view>
				<view
					class="item"
					@click="
						$u.route({
							url: `/pages/index/index`,
							type: 'reLaunch'
						})
					"
				>
					<u-icon name="home" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">店铺</view>
				</view>
				<view
					class="item car"
					@click="
						$u.route({
							url: `/pages/Car/Car`,
							type: 'reLaunch'
						})
					"
				>
					<u-badge class="car-num" :count="carLength" type="error" :offset="[-3, -6]" :overflow-count="99" absolute show-zero></u-badge>
					<u-icon name="shopping-cart" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">购物车</view>
				</view>
			</view>
			<view class="right">
				<view
					class="cart btn u-line-1"
					@click="
						showPay = false;
						showCar = true;
					"
				>
					加入购物车
				</view>
				<view
					class="buy btn u-line-1"
					@click="
						showCar = false;
						showPay = true;
					"
				>
					立即购买
				</view>
			</view>
		</view>

		<!-- 加入购物车 -->
		<u-modal
			v-model="showCar"
			title="加入购物车"
			@cancel="
				() => {
					showCar = false;
					showPay = false;
				}
			"
			@confirm="addCar()"
		>
			<view class="input-box">
				<view class="input-label">商品数量</view>
				<view class="input-value"><u-number-box v-model="productNumber" :min="1" :color="numColor"></u-number-box></view>
			</view>
		</u-modal>

		<!-- 立即购买 -->
		<u-modal
			v-model="showPay"
			title="立即购买"
			@cancel="
				() => {
					showCar = false;
					showPay = false;
				}
			"
			@confirm="payProduct()"
		>
			<view class="input-box">
				<view class="input-label">商品数量</view>
				<view class="input-value"><u-number-box v-model="productNumber" :min="1" :color="numColor"></u-number-box></view>
			</view>
		</u-modal>
	</view>
</template>

<script>
export default {
	data() {
		return {
			detail: {},
			carLength: 0,
			goodsId: '',
			productNumber: 1,
			showCar: false,
			showPay: false,
			numColor: this.$u.color.error
		};
	},
	mounted() {
		console.log('333333', this.$u);
	},
	onLoad(option) {
		this.goodsId = option.id;
		this.getDetail(option.id);
		this.getCarLength();
	},
	methods: {
		getDetail(productId) {
			this.$u.api
				.getProductById({
					productId
				})
				.then(res => {
					if (res.data.code === '200') {
						this.detail = res.data.data;
					}
				});
		},
		// 获取购物车数量
		getCarLength() {
			this.$u.api.pageShoppingCart({ pageNum: 1, pageSize: 10 }).then(res => {
				if (res.data.code === '200') {
					this.carLength = res.data.total;
				}
			});
		},
		// 添加到购物车
		addCar() {
			this.$u.api
				.addShoppingCart({
					productId: this.goodsId,
					productNumber: this.productNumber,
					productPrice: (this.detail && this.detail.productPrice * this.productNumber) || 0
				})
				.then(res => {
					this.$u.route(`/pages/Car/Car`);
				});
		},
		payProduct() {
			this.$u.api
				.generateOrder({
					productList: [this.detail],
					tenantMemberReceiveId: '',
					buyCount: this.productNumber,
					orderPrice: (this.detail && this.detail.productPrice * this.productNumber) || 0
				})
				.then(res => {
					this.$u.route({
						url: `/pages/Order/Order`
					});
				});
		},
		callServer() {
			uni.makePhoneCall({
				phoneNumber: '1111'
			});
		}
	}
};
</script>

<style lang="scss">
.goods-detail {
	padding-bottom: 100rpx;
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
			display: flex;
			font-size: 28rpx;
			align-items: center;
			.btn {
				line-height: 66rpx;
				padding: 0 30rpx;
				border-radius: 36rpx;
				color: #ffffff;
			}
			.cart {
				background-color: #ed3f14;
				margin-right: 30rpx;
			}
			.buy {
				background-color: #ff7900;
			}
		}
	}
	.input-box {
		padding: 40rpx 20rpx;
		display: flex;
		.input-label {
			width: 180rpx;
			flex-shrink: 0;
		}
		.input-value {
			flex-grow: 1;
		}
	}
}
</style>
