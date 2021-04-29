<template>
	<view class="goods-detail">
		<!-- logo -->
		<u-image v-if="detail.productCover" :src="`${BASE_URL}/files/${detail.productCover}`" width="100%" height="400rpx" />
		<view class="shop-item">
			<u-icon name="shopping-cart" size="36rpx"></u-icon>
			<text class="item-name">{{ detail.productName }}</text>
		</view>
		<view class="shop-item">
			<u-icon name="rmb-circle" size="36rpx" />
			<text class="item-name">
			￥ {{Number(detail.productPrice).toFixed(2)}}
			<text class="origin-txt"> ￥{{Number(detail.originalPrice).toFixed(2)}}</text>
			</text>
		</view>
		<view class="shop-item">
			<u-icon name="tags" size="36rpx"></u-icon>
			<view class="item-name"><u-tag v-if="categoryList.length" :text="setTag(detail)" type="warning" size="mini"></u-tag></view>
		</view>
		<view class="shop-item">
			<u-icon name="info-circle" size="36rpx"></u-icon>
			<text class="item-name">{{ detail.productIntro }}</text>
		</view>
		<!-- 底部菜单栏 -->
		<view class="navigation">
			<view class="left">
				<view class="item" @click="showShare = true">
					<u-icon name="share" :size="40" :color="$u.color['contentColor']"></u-icon>
					<view class="text u-line-1">分享</view>
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
							url: `/pages/Card/Card`,
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
			show-cancel-button
			ref="payRef"
			async-close
			@confirm="payProduct()"
		>
			<view>
				<view class="input-box">
					<view class="input-label">商品数量</view>
					<view class="input-value"><u-number-box v-model="productNumber" :min="1" :color="numColor"></u-number-box></view>
				</view>
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
		<u-popup v-model="showShare" mode="bottom">
			<view class="share-box">
				<u-button type="default" open-type="share">
					<u-icon name="chat" size="100" color="#00aa00" />
					<view>分享好友</view>
				</u-button>
				<u-button
					type="default"
					@click="
						showShare = false;
						showShareBanner = true;
					"
				>
					<u-icon name="photo" size="100" color="#ff5500" />
					<view>生成海报</view>
				</u-button>
			</view>
		</u-popup>
		<ShareGoods
			v-if="showShareBanner"
			@cancel="
				() => {
					showShare = false;
					showShareBanner = false;
				}
			"
			:goods-detail="detail"
		></ShareGoods>
		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
import ShareGoods from '../../components/ShareGoods/ShareGoods.vue';
export default {
	components: {
		ShareGoods
	},
	data() {
		return {
			BASE_URL,
			detail: {},
			carLength: 0,
			goodsId: '',
			productNumber: 1,
			showCar: false,
			showPay: false,
			numColor: this.$u.color.error,
			showAddress: false,
			addressList: [],
			tenantMemberReceiveId: '',
			addressName: '',
			categoryList: [],
			showShare: false,
			showShareBanner: false
		};
	},
	mounted() {
		console.log('333333', this.$u);
	},
	onLoad(option) {
		console.log('option', option);
		this.goodsId = option.id;
		this.getGoodsItem();
		this.getDetail(option.id);
		uni.getStorageSync('token') && this.getCarLength();
		uni.getStorageSync('token') && this.getData();
	},
	onShareAppMessage(e) {
		console.log('e', e);
		this.showShare = false;
		const vm = this;
		return {
			title: this.detail.productName,
			imageUrl: BASE_URL + '/files/' + this.detail.productCover,
			content: this.detail.productIntro,
			desc: this.detail.productIntro,
			path: `/pages/shareWd/shareWd?id=${this.detail.productId}`,
			query: `id=${this.detail.productId}`,
			success() {
				vm.$u.showToast(`分享成功`);
			},
			fail() {
				vm.$u.showToast({
					title: '分享失败',
					icon: 'none'
				});
			}
		};
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
		getGoodsItem() {
			this.$u.api.listProductCategory().then(res => {
				if (res.data.code === '200') {
					this.categoryList = res.data.data;
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
		getData() {
			this.$u.api.pageMemberReceive().then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					this.addressList = data;
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
					if (res.data.code !== '200') return;
					this.$refs.uTips.show({
						type: 'success',
						title: '已加入购物车'
					});
					this.getCarLength();
				});
		},
		setTag(detail) {
			const data = this.categoryList.filter(v => v.productCategoryId === detail.productCategoryId);
			console.log('data', data[0] && data[0].categoryName);
			return data[0] && data[0].categoryName;
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
			const data = this.$u.deepClone(this.detail);
			data.productNumber = 1;
			this.$u.api
				.generateOrder({
					productList: [data],
					tenantMemberReceiveId: this.tenantMemberReceiveId,
					buyCount: this.productNumber,
					orderPrice: (data && data.productPrice * this.productNumber) || 0
				})
				.then(res => {
					this.showCar = false;
					this.showPay = false;
					const { data, code } = res.data;
					console.log('erer', res.data);
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
		},
		clickShare(index) {
			switch (index) {
				case 0:
					uni.share({
						imageUrl: this.detail.productCouver
					});
					break;
				case 1:
					this.showShareBanner = true;
					break;
				default:
					this.showShareBanner = false;
			}
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
		align-items: start;
		.u-icon {
			color: rgba($color: $u-type-primary, $alpha: 0.5);
		}
		.item-name {
			margin-left: 20rpx;
			color: red;
			.origin-txt{
				color: #999;
				font-style: oblique;
				text-decoration: line-through;
				margin-left: 20rpx;
			}
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

	.address-box {
		margin: 20rpx;
		padding: 20rpx;
		border-bottom: 1px solid $uni-border-color;
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
	.share-box {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
		padding: 40rpx 40rpx 0;
		.u-btn {
			width: 100%;
			height: auto;
			display: flex;
			flex-direction: column;
			flex-grow: 1;
			margin-bottom: 40rpx;
			border-width: 0;
			&::after {
				border: none;
			}
		}
	}
}
</style>
