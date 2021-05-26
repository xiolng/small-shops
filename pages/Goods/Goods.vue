<template>
	<view class="goods-box">
		<view class="u-search-box"><u-search v-model="page.productName" placeholder="请输入商品名称" disabled @click="$u.route(`/pages/Goods/GoodsSearch`)" /></view>
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view class="tab-bg">
					<view
						v-for="(item, index) in classList"
						:key="index"
						class="u-tab-item"
						:class="[current == index ? 'u-tab-item-active' : (current + 1) == index ? 'radius-right' : '']"
						:data-current="index"
						@tap.stop="swichMenu(index, item)"
					>
						<text class="u-line-2">{{ item.categoryName }}</text>
					</view>
				</view>
			</scroll-view>
			<block v-for="(item, index) in classList" :key="index">
				<scroll-view scroll-y class="right-box" v-if="current == index">
					<view class="page-view">
						<view class="class-item">
							<view class="item-title">
								<text>{{ item.categoryName }}</text>
							</view>
							<view class="item-container">
								<view class="thumb-box" v-for="(item1, index1) in list" :key="index1">
									<u-image class="item-menu-image" width="180" height="180" :src="BASE_URL + '/files/' + item1.productCover" mode="" @click="goDetail(item1)"></u-image>
									<view class="right-box">
										<view class="item-menu-name u-line-2" @click="goDetail(item1)">{{ item1.productName }}</view>
										<view class="item-menu-info u-line-2" @click="goDetail(item1)">{{ item1.productIntro }}</view>
										<view class="price-box">
											<view class="price-txt" @click="goDetail(item1)">
												<view class="price-origin">
													<text class="red">￥</text>
													<text class="txt">{{ item1.originalPrice.toFixed(2) }}</text>
												</view>
												<text class="red">￥</text>
												<text class="txt">{{ item1.productPrice.toFixed(2) }}</text>
											</view>
											<view v-if="changeCardItem(item1)" class="price-btn">
												<price-number v-if="changeCardItem(item1)" :price="bindCard(item1)" @getPrice="getPrice($event, item1)"></price-number>
											</view>
											<view v-else class="price-btn" @click="addCar(item1)"><u-image class="btn-s" width="50" height="50" :src="CardImg"></u-image></view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
		<card-order :cardData="cardData" @getPrice="getPrice" @getCarLength="getCarLength"></card-order>
		<!-- 底部菜单栏 -->

		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
import PriceNumber from '@/components/PriceNumber/PriceNumber.vue';
import CardOrder from '@/components/CardOrder/CardOrder.vue'
import CardImg from './image/card.svg'
export default {
	components: {
		PriceNumber,
		CardOrder
	},
	data() {
		return {
			BASE_URL,
			CardImg,
			scrollTop: 0, //tab标题的滚动条位置
			current: 0, // 预设当前项的值
			menuHeight: 0, // 左边菜单的高度
			menuItemHeight: 0, // 左边菜单item的高度
			list: [],
			classList: [],
			page: {
				pageNum: 1,
				pageSize: 10,
				total: 0,
				productCategoryId: '',
				productName: ''
			},
			numColor: this.$u.color.error,
			categoryList: [],
			showShare: false,
			showShareBanner: false,
			productType: 0,
			showCard: false,
			cardData: null,
			cardIndex: 0
		};
	},
	onLoad() {
		this.getClassList();
		uni.getStorageSync('token') && this.getCarLength();
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
		getList(productCategoryId = '') {
			this.$u.api.pageProduct({ ...this.page, productCategoryId }).then(res => {
				const { data, code, total } = res.data;
				this.list = [];
				if (code === '200') {
					this.list = data || [];
					this.page.total = total;
					this.page.productCategoryId = (this.list.length && this.list[0].productCategoryId) || this.classList[0].productCategoryId;
					this.$forceUpdate();
				}
			});
		},
		getClassList() {
			this.$u.api.listProductCategory().then(res => {
				this.classList = res.data.data;
				this.getList(res.data.data[0].productCategoryId);
			});
		},
		goDetail(item1) {
			this.$u.route({
				url: `/pages/Goods/GoodsDetail`,
				params: {
					id: item1.productId,
					productType: item1.productType
				}
			});
		},
		// 点击左边的栏目切换
		async swichMenu(index, item) {
			this.page.productName = '';
			this.page.productCategoryId = item.productCategoryId;
			this.getList(item.productCategoryId);
			if (index == this.current) return;
			this.current = index;
			// 如果为0，意味着尚未初始化
			if (this.menuHeight == 0 || this.menuItemHeight == 0) {
				await this.getElRect('menu-scroll-view', 'menuHeight');
				await this.getElRect('u-tab-item', 'menuItemHeight');
			}
			// 将菜单菜单活动item垂直居中
			this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
		},
		// 获取一个目标元素的高度
		getElRect(elClass, dataVal) {
			new Promise((resolve, reject) => {
				const query = uni.createSelectorQuery().in(this);
				query
					.select('.' + elClass)
					.fields({ size: true }, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
					})
					.exec();
			});
		},
		// 获取购物车数量
		getCarLength() {
			this.$u.api.pageShoppingCart({ pageNum: 1, pageSize: 10 }).then(res => {
				if (res.data.code === '200') {
					console.log(111, res.data);
					this.cardData = null;
					this.cardData = res.data;
					this.cardData.data &&
						this.cardData.data.map(v => {
							this.list.map(j => {
								j.productNumber = 0;
								if (v.productId == j.productId) {
									j.productNumber = v.productNumber;
								}
							});
						});
					this.$forceUpdate();
				}
			});
		},
		// 添加到购物车
		addCar(item1) {
			this.$u.api
				.addShoppingCart({
					productId: item1.productId,
					productNumber: item1.productNumber || 1,
					productPrice: item1.productPrice || 0
				})
				.then(res => {
					if (res.data.code !== '200') return;
					this.$refs.uTips.show({
						type: 'success',
						title: '已加入购物车'
					});
					this.getCarLength();
				});
		}
	},
	onShow() {
		console.log('onShow');
		this.getCarLength();
	}
};
</script>

<style lang="scss" scoped>
.goods-box {
	height: calc(100vh);
	/* #ifdef H5 */
	height: calc(100vh - var(--window-top));
	/* #endif */
	display: flex;
	flex-direction: column;
}

.u-search-box {
	padding: 18rpx 30rpx;
}

.u-menu-wrap {
	flex: 1;
	display: flex;
	overflow: hidden;
}

.u-search-inner {
	background-color: rgb(234, 234, 234);
	border-radius: 100rpx;
	display: flex;
	align-items: center;
	padding: 10rpx 16rpx;
}

.u-search-text {
	font-size: 26rpx;
	color: $u-tips-color;
	margin-left: 10rpx;
}

.u-tab-view {
	width: 200rpx;
	height: 100%;
	background: #f6f6f6;
	.tab-bg{
		background: #fff;
	}
}

.u-tab-item {
	height: 110rpx;
	background: #f6f6f6;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 26rpx;
	color: #444;
	font-weight: 400;
	line-height: 1;
}

.u-tab-item-active {
	position: relative;
	color: #000;
	font-size: 30rpx;
	font-weight: 600;
	background: #fff;
}
.radius-right{
	border-radius: 0 30rpx 0 0;
}

.u-tab-item-active::before {
	content: '';
	position: absolute;
	border-left: 4px solid $u-type-primary;
	height: 32rpx;
	left: 0;
	top: 39rpx;
}

.u-tab-view {
	height: 100%;
}

.right-box {
	background-color: rgb(250, 250, 250);
}

.page-view {
	padding: 16rpx;
}

.class-item {
	margin-bottom: 30rpx;
	background-color: #fff;
	padding: 16rpx;
	border-radius: 8rpx;
}

.item-title {
	font-size: 26rpx;
	color: $u-main-color;
	font-weight: bold;
}

.item-menu-name {
	font-weight: normal;
	font-size: 30rpx;
	color: $u-main-color;
}

.item-menu-info {
	font-weight: normal;
	font-size: 24rpx;
	color: #999;
}

.item-container {
	display: flex;
	flex-wrap: wrap;
}

.thumb-box {
	width: 100%;
	display: flex;
	align-items: start;
	justify-content: space-between;
	margin-top: 20rpx;
	.right-box {
		flex-grow: 2;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 10rpx;
		min-height: 100%;
		.price-box {
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			.price-txt {
				color: red;
				.red {
					font-size: 20rpx;
				}
				.txt {
					font-size: 30rpx;
				}
				.price-origin {
					color: #999;
					text-decoration: line-through;
					font-style: oblique;
					font-size: 18rpx;
					.txt {
						font-size: 24rpx;
					}
				}
			}
			.price-btn {
				.btn-s {
					width: 80rpx;
					height: 80rpx;
				}
			}
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

.address-group {
	max-height: 700rpx;
	margin-bottom: 140rpx;
	overflow: hidden;
	overflow-y: auto;
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
</style>
