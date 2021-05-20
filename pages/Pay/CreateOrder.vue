<template>
	<view class="pay-box">
		<div class="shadow-box">
			<view class="address-show" @click="showAddress = true">
				<view class="address-left">
					<view class="address-txt u-line-1">{{ activeAddress.receiveAddress }}</view>
					<view class="users">
						<view class="user-name">{{ activeAddress.receiveName }}</view>
						<view class="user-phone">{{ activeAddress.receivePhone }}</view>
					</view>
				</view>
				<view class="address-right"><u-icon name="arrow-right" size="40" color="#999" /></view>
			</view>
		</div>

		<view class="shadow-box">
			<view class="shop-box">
				<view class="shop-name">
					<u-icon name="home" />
					<text class="shop-title">{{ getShopDetail() }}</text>
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
								<view class="item-num">x{{ item.productNumber }}</view>
							</view>
						</view>
					</view>
				</view>
				<u-empty mode="car" v-else />
			</view>
			<view class="all-price">
				<text>小计：￥</text>
				<text class="price-txt">{{allPrice.toFixed(2)}}</text>
			</view>
		</view>
		<!-- 购买按钮 -->
		<view class="btn-box"><u-button type="error" :disabled="isEnd" @click="payProduct">提交订单</u-button></view>
		<u-popup v-model="showAddress" mode="bottom" :z-index="39999">
			<view class="address-group">
				<view class="address-box" v-for="item in addressList" :key="item.tenantMemberReceiveId" @click="selectAddress(item)">
					<view class="address-item">
						<view class="splice-box" style="margin-right: 30rpx;">
							<view class="address-label"><u-icon name="account"></u-icon></view>
							<view class="address-val">{{ item.receiveName }}</view>
						</view>
						<view class="splice-box">
							<view class="address-label"><u-icon name="phone"></u-icon></view>
							<view class="address-val">{{ item.receivePhone }}</view>
						</view>
					</view>
					<view class="address-item">
						<view class="address-label"><u-icon name="map"></u-icon></view>
						<view class="address-val">{{ item.receiveAddress }}</view>
					</view>
				</view>
				<view class="no-address" v-if="!addressList.length">
					<view class="title">暂无收货地址</view>
					<view class="btn-box" @click="$u.route(`/pages/My/AddSite`)">现在去填写</view>
				</view>
			</view>
		</u-popup>
		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
export default {
	data() {
		return {
			orderDetail: {},
			BASE_URL,
			orderTime: '10:00',
			timer: null,
			isEnd: false,
			showAddress: false,
			addressList: [],
			cardData: {},
			activeAddress: {}
		};
	},
	onLoad(option) {
		this.getCarLength();
		setTimeout(() => {
			uni.getStorageSync('token') && this.getData();
		}, 100);
		option.orderId && this.getOrder(option.orderId);
	},
	onHide() {
		clearInterval(this.timer);
		this.timer = null;
	},
	onUnload() {
		clearInterval(this.timer);
		this.timer = null;
	},
	methods: {
		getShopDetail() {
			return uni.getStorageSync('shopDetail').shopName;
		},
		// 获取购物车数量
		getCarLength() {
			this.$u.api.pageShoppingCart({ pageNum: 1, pageSize: 10 }).then(res => {
				if (res.data.code === '200') {
					console.log(111, res.data);
					this.cardData = null;
					this.cardData = res.data;
					this.cardData.data &&
						this.cardData.length &&
						this.cardData.data.map(v => {
							this.list.map(j => {
								if (v.productId == j.productId) {
									j.productNumber = v.productNumber;
								}
							});
						});
					this.$forceUpdate();
				}
			});
		},
		selectAddress(item) {
			console.log('item,', item);
			this.activeAddress = item;
			this.showAddress = false;
		},
		payProduct() {
			if (!this.activeAddress.receiveAddress) {
				this.$refs.uTips.show({
					type: 'error',
					title: '请选择收货地址'
				});
				return false;
			}
			this.$u.api
				.generateOrder({
					productList: this.cardData.data.map(v => ({ productId: v.productId, productNumber: v.productNumber })),
					tenantMemberReceiveId: this.activeAddress.tenantMemberReceiveId,
					detailIds: this.cardData.data.map(v => v.memberShoppingCartDetailId),
					buyCount: this.cardData.data.length,
					orderPrice: this.allPrice
				})
				.then(res => {
					this.showCar = false;
					this.showPay = false;
					const { data, code } = res.data;
					console.log('erer', res.data);
					if (code === '200') {
						this.getCarLength();
						uni.redirectTo({
							url: `/pages/Pay/Pay?orderId=${data}`
						});
					}
				})
				.catch(() => {
					this.$refs.uTips.show({
						type: 'error',
						title: '服务器错误，请联系管理员'
					});
					this.$refs.payRef.clearLoading();
				});
		},
		getData() {
			this.$u.api.pageMemberReceive().then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					this.addressList = data;
					this.addressList.map(v => {
						if (v.isDefault) {
							this.activeAddress = v;
						}
					});
				}
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

<style lang="less">
.pay-box {
	width: 100%;
	padding-bottom: 130rpx;
	.shadow-box {
		padding: 30rpx;
		background-color: #fff;
		border-radius: 30rpx;
		margin: 30rpx;
		border: 1rpx solid #eee;
		box-shadow: 0 0 10rpx #eee;
		.address-show {
			display: flex;
			justify-content: space-between;
			.address-left {
				width: calc(100% - 60rpx);
				flex-grow: 1;
				.address-txt {
					width: 100%;
					font-size: 36rpx;
					margin-bottom: 20rpx;
				}
				.users {
					display: flex;
					.user-name {
						margin-right: 40rpx;
					}
				}
			}
			.address-right {
				width: 60rpx;
				display: flex;
				flex-shrink: 0;
				justify-content: center;
				align-items: center;
			}
		}
		.shop-box {
			padding: 0 10rpx 20rpx;
			display: flex;
			justify-content: space-between;
			font-size: 30rpx;
			border-bottom: 1px solid #eee;
			.shop-name {
				.shop-title {
					margin-left: 20rpx;
				}
			}
		}
		.all-price{
			padding: 10rpx 0;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			.price-txt{
				font-size: 40rpx;
			}
		}
	}
	.btn-box {
		width: 100%;
		height: 120rpx;
		background: #fff;
		padding: 20rpx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.address-group {
		max-height: 700rpx;
		margin-bottom: 140rpx;
		overflow: hidden;
		overflow-y: auto;
	}
	.address-box {
		margin: 20rpx;
		padding: 20rpx;
		border-bottom: 1px solid #eee;
		.address-item {
			display: flex;
			align-items: start;
			padding: 10rpx 0;
			.splice-box {
				display: flex;
				align-items: center;
			}
			.address-label {
				margin-right: 10rpx;
			}
			.address-val {
				flex-grow: 3;
			}
		}
	}

	.no-address {
		padding: 20rpx;
		text-align: center;
		.title {
			font-size: 40rpx;
			margin-bottom: 20rpx;
		}
		.btn-box {
			color: #00aaff;
			font-size: 30rpx;
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
							font-size: 24rpx;
						}
					}
				}
			}
		}
	}
}
</style>
