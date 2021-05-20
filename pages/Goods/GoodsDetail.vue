<template>
	<movable-area class="movable-box">
		<view class="goods-detail">
			<!-- logo -->
			<u-image v-if="detail.productCover" :src="`${BASE_URL}/files/${detail.productCover}`" width="100%" height="400rpx" />
			<view class="stock-box">
				<view class="item-box">
					<view class="item-title">
						<text>{{ productType == '1' ? '券码' : '商品' }}详情</text>
						<view v-if="changeCardItem(detail)" class="price-btn">
							<price-number v-if="changeCardItem(detail)" :price="bindCard(detail)" @getPrice="getPrice($event, detail)"></price-number>
						</view>
						<u-button v-else type="primary" size="mini" @click="addCar()">加入购物车</u-button>
					</view>
					<view class="item-content">
						<view class="item-tab">
							<view class="label">名称：</view>
							<view class="val">{{ detail.productName }}</view>
						</view>
						<view class="item-tab">
							<view class="label">价格：</view>
							<view class="val">
								<text class="item-name">
									￥ {{ Number(detail.productPrice).toFixed(2) }}
									<text class="origin-txt">￥{{ Number(detail.originalPrice).toFixed(2) }}</text>
								</text>
							</view>
						</view>
						<view class="item-tab">
							<view class="label">分类：</view>
							<view class="val"><u-tag v-if="categoryList.length" :text="setTag(detail)" type="warning" size="mini"></u-tag></view>
						</view>
						<view class="item-tab">
							<view class="label">描述：</view>
							<view class="val">
								<text class="item-name">{{ detail.productIntro }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view class="stock-box" v-if="productType == '1'">
				<view class="item-box">
					<view class="item-title">券码说明</view>
					<view class="item-content">
						<view class="item-tab">
							<view class="label">有效期：</view>
							<view class="val">{{ detail.startTime }}/{{ detail.endTime }}</view>
						</view>
						<view class="item-tab">
							<view class="label">使用范围：</view>
							<view class="val">{{ detail.applyRange }}</view>
						</view>
						<view class="item-tab">
							<view class="label">使用规则：</view>
							<view class="val">{{ detail.useRole }}</view>
						</view>
						<view class="item-tab">
							<view class="label">使用时间：</view>
							<view class="val">{{ detail.useTime }}</view>
						</view>
						<view class="item-tab">
							<view class="label">不可用：</view>
							<view class="val">{{ detail.unAvailable }}</view>
						</view>
					</view>
				</view>
			</view>
			<movable-view class="search-btn" :x="x" :y="y" direction="all" @change="onChange" inertia @click="showSearch = true">
				<view class="search-box" @click="showShare = true">
					<u-icon name="zhuanfa" size="34rpx"></u-icon>
					<text class="txt">分享</text>
				</view>
			</movable-view>

			<card-order :cardData="cardData" @getPrice="getPrice" @getCarLength="getCarLength"></card-order>
			<!-- 底部菜单栏 -->

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
	</movable-area>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
import ShareGoods from '@/components/ShareGoods/ShareGoods.vue';
import PriceNumber from '@/components/PriceNumber/PriceNumber.vue';
import CardOrder from '@/components/CardOrder/CardOrder.vue'
export default {
	components: {
		ShareGoods,
		PriceNumber,
		CardOrder
	},
	data() {
		return {
			BASE_URL,
			detail: {},
			cardData: {},
			goodsId: '',
			productNumber: 1,
			numColor: this.$u.color.error,
			categoryList: [],
			showShare: false,
			showShareBanner: false,
			productType: 0,
			showCard: false,
			x: this.$u.sys().windowWidth - 90,
			y: this.$u.sys().windowHeight - 200,
			old: {
				x: this.$u.sys().windowWidth - 90,
				y: this.$u.sys().windowHeight - 200
			},
			showAllBtn: false
		};
	},
	mounted() {
		console.log('333333', this.$u);
	},
	onLoad(option) {
		console.log('option', option);
		this.goodsId = option.id;
		this.productType = option.productType;
		this.getGoodsItem();
		this.getDetail(option.id);
		uni.getStorageSync('token') && this.getCarLength();
	},
	onShow() {
		this.getCarLength()
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
		getPrice(val, item) {
			this.cardData.data.map(v => {
				if (v.productId == item.productId) {
					if (val <= 0) {
						this.$u.api
							.removeShoppingCart({
								shoppingCartDetailIds: v.memberShoppingCartDetailId
							})
							.then(res => {
								this.getCarLength();
							});
						return false;
					}
					if (val == v.productNumber) return;
					this.$u.api
						.updateShoppingCartCount({
							memberShoppingCartDetailId: v.memberShoppingCartDetailId,
							productId: item.productId,
							productPrice: item.productPrice,
							productNumber: val
						})
						.then(res => {
							if (res.data.code === '200') {
								this.getCarLength();
							}
						});
				}
			});
		},
		bindCard(item) {
			let productNumber = 0;
			this.cardData.data.map((v, index) => {
				if (v.productId == item.productId) {
					productNumber = v.productNumber;
				}
			});
			console.log('productNumber', productNumber);
			return productNumber;
		},
		changeCardItem(item) {
			if (!this.cardData.data) {
				return false;
			}
			let isCard = false;
			this.cardData.data.map((v, index) => {
				if (v.productId == item.productId) {
					this.cardIndex = index;
					isCard = v.productNumber;
				}
			});
			return isCard;
		},
		onChange: function(e) {
			this.old.x = e.detail.x;
			this.old.y = e.detail.y;
		},
		getDetail(productId) {
			this.$u.api
				.getProductById({
					productId
				})
				.then(res => {
					if (res.data.code === '200') {
						this.detail = res.data.data;
						this.productType = this.detail.productType;
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
					console.log(111, res.data);
					this.cardData = res.data;
				}
			});
		},
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
						this.getCarLength();
					}
				});
		},
		/**
		 * 数量改变
		 * @param {Object} e
		 */
		valChange(e) {
			console.log('当前值为: ' + e.value);
			this.cardData.data[e.index].productNumber = e.value;
			if (e.value <= 0) {
				this.$u.api
					.removeShoppingCart({
						shoppingCartDetailIds: this.cardData.data[e.index].memberShoppingCartDetailId
					})
					.then(res => {
						this.getCarLength();
					});
				return false;
			}
			this.$u.api
				.updateShoppingCartCount({
					...this.cardData.data[e.index]
				})
				.then(res => {
					this.getCarLength();
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
			return data[0] && data[0].categoryName;
		},
		payProduct() {
			uni.navigateTo({
				url: `/pages/Pay/CreateOrder`
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
	},
	computed: {
		/**
		 * 总价格
		 */
		allPrice: {
			get: function() {
				let allPrice = 0;
				console.log('this.card', this.cardData);
				this.cardData.data &&
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
.movable-box {
	width: 100%;
	min-height: 100vh;
}
.search-btn {
	width: 100rpx;
	height: 100rpx;
	position: fixed;
	right: 0;
	z-index: 9999;
	width: 100rpx;
	background-color: $u-type-primary;
	border-radius: 100%;
	.search-box {
		height: 100rpx;
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.txt {
			font-size: 20rpx;
		}
	}
	.u-icon {
		width: 100rpx;
		height: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 0;
	}
}
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
			.origin-txt {
				color: #999;
				font-style: oblique;
				text-decoration: line-through;
				margin-left: 20rpx;
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
		padding: 40rpx 40rpx 120rpx;
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
	.stock-box {
		margin: 20rpx 0;
		padding: 20rpx;
		.item-box {
			background-color: #fff;
			border-radius: 20rpx;
			border: 1px solid #dddddd;
			padding: 20rpx 20rpx;
			.item-title {
				font-size: 30rpx;
				margin-bottom: 10rpx;
				padding: 10rpx 10rpx 10rpx 18rpx;
				border-bottom: 1px solid #c2c2c2;
				position: relative;
				display: flex;
				justify-content: space-between;
				&::after {
					content: ' ';
					width: 7rpx;
					background-color: #007aff;
					position: absolute;
					left: 0;
					top: 12rpx;
					bottom: 10rpx;
				}
			}
			.item-content {
				padding: 20rpx 10rpx;
				.item-tab {
					display: flex;
					margin-bottom: 20rpx;
					.label {
						width: 140rpx;
						flex-shrink: 0;
						color: #999;
						text-align: right;
					}
					.val {
						font-size: 24rpx;
						.item-name {
							margin-left: 20rpx;
							color: red;
							.origin-txt {
								color: #999;
								font-style: oblique;
								text-decoration: line-through;
								margin-left: 20rpx;
							}
						}
					}
				}
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
			.card-list {
				.card-item {
					display: flex;
					padding: 20rpx 0;
					border-bottom: 1rpx solid #eee;
					.item-img {
						width: 120rpx;
						height: 120rpx;
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
}
</style>
