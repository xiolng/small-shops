<template>
	<view class="card-box">
		<!-- 购物车 -->
		<view class="cart u-p-20">
			<u-checkbox-group @change="changeCheckbox" :active-color="$u.color.primary">
				<view class="cart-item" :key="index" v-for="(item, index) in cartList">
					<u-row gutter="10">
						<u-col span="1"><u-checkbox v-model="item.checked" shape="circle" :name="item.productId"></u-checkbox></u-col>
						<u-col span="3"><u-image height="160rpx" :src="BASE_URL + '/files/' + item.productCover" class="cart-item-cover"></u-image></u-col>
						<u-col span="8">
							<view class="cart-info">
								<view class="goods-name">
									<u-row>
										<u-col span="9">
											<view class="u-line-1">{{ item.productName }}</view>
										</u-col>
										<u-col span="3"><u-button size="mini" type="error" @click="removeProduct(item)">删除</u-button></u-col>
									</u-row>
								</view>
								<view class="" v-show="item.productIntro"><u-tag :text="item.productIntro" mode="light" size="mini" type="info" /></view>
								<u-row class="cart-footer">
									<u-col span="6">
										<text class="price">￥{{ item.productPrice }}</text>
									</u-col>
									<u-col span="6" class="number-box">
										<u-number-box v-model="item.productNumber" @change="valChange" :index="index" :min="1" :max="100" :color="numColor"></u-number-box>
									</u-col>
								</u-row>
							</view>
						</u-col>
					</u-row>
				</view>
			</u-checkbox-group>
			<view v-if="!cartList.length || !isLogin()"><u-empty mode="car"></u-empty></view>
		</view>

		<!-- 底部框 -->
		<u-row gutter="4" class="cart-footer-tool" align-items="center">
			<u-col span="4">
				<view style="align-self: center; min-height: 76rpx; display: flex; align-items: center; margin-left: 10rpx;">
					<u-checkbox v-model="checked" shape="circle" @change="checkAll">全选</u-checkbox>
					<view v-if="checked && cartList.length" style="display: inline;"><u-button @click="clearCard" type="error" size="mini">清空</u-button></view>
				</view>
			</u-col>
			<u-col span="8">
				<view class="" style="text-align: right; display: flex; align-items: center; justify-content: flex-end; margin-right: 10rpx;">
					<text>
						合计:
						<text>￥{{ allPrice.toFixed(2) }}</text>
					</text>
					<u-button type="error" size="medium" style="margin:0 0 0 20rpx;" @click="showPay = true" :disabled="!activeArr || !cartList.length">结算</u-button>
				</view>
			</u-col>
		</u-row>

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
			show-cancel-button
			ref="payRef"
			async-close
			@confirm="payProduct()"
		>
			<view>
				<view class="input-box">
					<view class="input-label">收货地址</view>
					<view class="input-value"><u-input v-model="addressName" disabled type="select" @click="showAddress = true" border /></view>
				</view>
			</view>
		</u-modal>
		<u-popup v-model="showAddress" mode="bottom" :height="$u.sys().windowHeight / 2">
			<view>
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
import { isLogin } from '../../utils/index.js';
export default {
	data() {
		return {
			isLogin,
			BASE_URL,
			// 背景
			background: {
				backgroundImage: 'linear-gradient(45deg, rgb(42,132,255), rgb(234,175,200))'
			},
			// 是否全选
			checked: false,
			// 是否选中商品
			activeArr: 0,
			// 全局主题色
			numColor: this.$u.color.error,
			// 购物车列表
			cartList: [],
			// 购买弹窗
			showPay: false,
			// 选择收货地址
			showAddress: false,
			// 收货地址列表
			addressList: [],
			// 收货地址Id
			tenantMemberReceiveId: '',
			// 已选择收货地址名称
			addressName: ''
		};
	},
	mounted() {
		console.log(this.$u.color);
		const token = uni.getStorageSync('token');
		token && this.getCard();
		token && this.getData();
	},
	onShow() {
		this.getCard();
	},
	methods: {
		getCard() {
			this.$u.api.pageShoppingCart().then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					if (!data || data.length <= 0) {
						this.cartList = [];
						this.$forceUpdate();
						return false;
					}
					this.cartList = data.map(v => {
						v.checked = false;
						return v;
					});
					this.$forceUpdate();
				}
			});
		},
		// 获取收货地址
		getData() {
			this.$u.api.pageMemberReceive().then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					this.addressList = data;
					this.addressList.map(v => {
						if(v.isDefault){
							this.tenantMemberReceiveId = v.tenantMemberReceiveId;
							this.addressName = v.receiveAddress;
						}
					});
				}
			});
		},
		/**
		 * 选择或取消全部
		 * @param {Object} item
		 */
		checkAll(item) {
			console.log(item);
			this.cartList.map((v, index) => {
				this.$set(this.cartList[index], 'checked', item.value);
			});
			this.checked = item.value;
			this.activeArr = +item.value;
		},
		/**
		 * 是否全选
		 * @param {Object} active
		 */
		changeCheckbox(active) {
			this.activeArr = active.length;
			this.checked = this.cartList.length === active.length;
		},
		/**
		 * 数量改变
		 * @param {Object} e
		 */
		valChange(e) {
			console.log('当前值为: ' + e.value);
			this.cartList[e.index].productNumber = e.value;
		},
		// 删除商品
		removeProduct(item) {
			this.cartList = this.cartList.filter(v => v.productId !== item.productItem);
			this.$u.api
				.removeShoppingCart({
					shoppingCartDetailIds: item.memberShoppingCartDetailId
				})
				.then(res => {
					if (res.data.code === '200') {
						this.$refs.uTips.show({
							title: `删除成功`,
							type: 'success'
						});
						this.getCard();
					} else {
						this.$refs.uTips.show({
							title: res.data.msg,
							type: 'error'
						});
					}
				});
		},
		clearCard() {
			this.$u.api
				.clearShoppingCart({
					memberShoppingCartId: this.cartList[0].memberShoppingCartId
				})
				.then(res => {
					if (res.data.code === '200') {
						this.$refs.uTips.show({
							type: 'success',
							title: '已清空购物车'
						});
						this.getCard();
					}
				});
		},
		selectAddress(item) {
			this.tenantMemberReceiveId = item.tenantMemberReceiveId;
			this.addressName = item.receiveAddress;
			this.showAddress = false;
		},
		payProduct() {
			if (!this.addressName) {
				this.$refs.uTips.show({
					type: 'error',
					title: '请选择收货地址'
				});
				this.$refs.payRef.clearLoading();
				return false;
			}
			this.$u.api
				.generateOrder({
					productList: this.cartList.filter(v => v.checked).map(v => ({productId: v.productId, productNumber: v.productNumber})),
					tenantMemberReceiveId: this.tenantMemberReceiveId,
					buyCount: this.cartList.filter(v => v.checked).length,
					orderPrice: this.allPrice
				})
				.then(res => {
					this.showPay = false;
					this.$refs.payRef.clearLoading();
					this.clearCard();
					const { data, code } = res.data;
					if (code === '200') {
						this.$u.route({
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
		}
	},
	computed: {
		/**
		 * 总价格
		 */
		allPrice: {
			get: function() {
				let allPrice = 0;
				this.cartList.map(v => {
					v.checked && (allPrice += v.productNumber * v.productPrice);
				});
				return allPrice;
			}
		}
	}
};
</script>

<style lang="scss">
.card-box {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #fdfdfd;
	.cart {
		width: 100vw;
		background-color: #ffffff;

		.cart-item {
			width: 100%;
			margin-bottom: 40rpx;
			.u-col,
			.u-checkbox-group {
				height: 100%;
			}
			.cart-item-cover {
				// border: 1rpx solid #DBF1E1;
				align-items: center;
			}
			.cart-info {
				display: flex;
				flex-direction: column;
				align-items: left;
				justify-content: center;
				.goods-name {
					font-size: 36rpx;
					margin-bottom: 10rpx;
				}
				.cart-footer {
					margin-top: 10rpx;
					.number-box {
						display: flex;
						flex-direction: column;
						align-items: right;
					}
					.price{
						color: #FA3534;
					}
				}
			}
		}
	}

	.cart-footer-tool {
		width: 100vw;
		height: 100rpx;
		border: 1px solid #dcdfe6;
		padding-top: 20rpx;
		position: fixed;
		left: 0;
		bottom: 0;
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

	.address-box {
		margin: 20rpx;
		padding: 20rpx;
		border-bottom: 1px solid $uni-border-color;
		.address-item {
			display: flex;
			align-items: center;
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
}
</style>
