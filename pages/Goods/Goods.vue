<template>
	<view class="goods-box">
		<view class="u-search-box">
			<view class="left"><u-search v-model="page.productName" placeholder="请输入商品名称" disabled @click="$u.route(`/pages/Goods/GoodsSearch`)" :show-action="false" /></view>
			<view class="right"><u-icon :name="isColumn ? 'grid-fill' : 'grid'" size="48" @click="isColumn = !isColumn" /></view>
		</view>
		<!-- select -->
		<view class="select-box">
			<view class="select-item" @click="clickItem('defaults')"><view class="select-txt" :class="[defaults && 'active']">默认</view></view>
			<view class="select-item" @click="clickItem('prices')">
				<view class="select-txt" :class="[priceNum !== 0 && priceNum <= 2 && 'active']">价格</view>
				<view class="select-icon">
					<u-icon name="arrow-up-fill" size="10" :color="prices.up && '#dc2626'" />
					<u-icon name="arrow-down-fill" size="10" :color="prices.down && '#dc2626'" />
				</view>
			</view>
			<view class="select-item" @click="clickItem('sales')">
				<view class="select-txt" :class="[salesNum !== 0 && salesNum <= 2 && 'active']">销量</view>
				<view class="select-icon">
					<u-icon name="arrow-up-fill" size="10" :color="sales.up && '#dc2626'" />
					<u-icon name="arrow-down-fill" size="10" :color="sales.down && '#dc2626'" />
				</view>
			</view>
			<view class="select-item" @click="clickItem('upNews')"><view class="select-txt" :class="[upNews && 'active']">新上架</view></view>
		</view>
		<!-- 底部菜单栏 -->
		<scroll-view class="view-container" scroll-y>
			<view class="view-box" :class="[isColumn && 'columns']">
				<view class="view-item" v-for="(item, index) in list" :key="index">
					<view class="left">
						<view class="img"><image class="img-privew" :src="BASE_URL + '/files/' + item.productCover" mode=""></image></view>
					</view>
					<view class="right">
						<view class="title u-line-2">
							{{ item.productName }}{{ item.productName }}{{ item.productName }}{{ item.productName }}{{ item.productName }}{{ item.productName }}{{ item.productName
							}}{{ item.productName }}{{ item.productName }}
						</view>
						<view class="info u-line-1">{{ item.productIntro }}</view>
						<view class="bottom">
							<view class="price-box">
								<view class="tip">￥</view>
								<view class="price-txt">{{ item.productPrice }}</view>
							</view>
							<view class="by"><u-tag text="包邮" type="error" shape="circle" /></view>
							<view class="sale">已售{{ item.productPrice }}</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
export default {
	data() {
		return {
			BASE_URL,
			list: [],
			isColumn: false,
			defaults: false,
			prices: {
				default: false,
				up: false,
				down: false
			},
			sales: {
				default: false,
				up: false,
				down: false
			},
			upNews: false,
			priceNum: 0,
			salesNum: 0,
			page: {
				pageNum: 1,
				pageSize: 10,
				total: 0,
				productCategoryId: '',
				productName: ''
			}
		};
	},
	onLoad(option) {
		console.log('option', option);
		this.getList(option.searchName);
		this.page.productName = option.searchName
	},
	onShow(option) {
		console.log('query', this, option);
	},
	methods: {
		clickItem(item) {
			switch (item) {
				case 'defaults':
					this.defaults = !this.defaults;
					break;
				case 'prices':
					if (this.priceNum === 2) {
						this.priceNum = 0;
					} else {
						this.priceNum++;
					}
					console.log('v', this.priceNum);
					Object.keys(this.prices).map((v, index) => {
						this.prices[v] = false;
						if (index == this.priceNum) {
							this.prices[v] = true;
							console.log(this.prices[v]);
						}
					});
					break;
				case 'sales':
					if (this.salesNum === 2) {
						this.salesNum = 0;
					} else {
						this.salesNum++;
					}
					console.log('111v', this.salesNum);
					Object.keys(this.sales).map((v, index) => {
						this.sales[v] = false;
						if (index == this.salesNum) {
							this.sales[v] = true;
						}
					});
					break;
				default:
					this.upNews = !this.upNews;
			}
		},
		getList(searchName) {
			this.$u.api
				.pageProduct({
					productName: searchName
				})
				.then(res => {
					const { code, data, msg } = res.data;
					if (code == '200') {
						this.list = data;
					}
				});
		}
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
	.u-search-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10rpx;
		border-bottom: 1rpx solid #eee;
		.left {
			flex-grow: 2;
			padding: 0 10rpx;
		}
		.right {
			padding: 0 10rpx;
			flex-shrink: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #dc2626;
		}
	}
	.select-box {
		height: 80rpx;
		display: flex;
		justify-content: space-around;
		.select-item {
			display: flex;
			justify-content: center;
			align-items: center;
			.select-txt {
				font-size: 28rpx;
				&.active {
					color: #dc2626;
				}
			}
			.select-icon {
				display: flex;
				flex-direction: column;
				margin-left: 10rpx;
				&.active {
					color: #dc2626;
				}
			}
		}
	}

	// 商品
	.view-container {
		height: calc(100vh - 213rpx);
	}
	.view-box {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		padding: 10rpx;
		background: #eee;
		.view-item {
			width: calc(50% - 20rpx);
			background: #fff;
			border-radius: 10rpx;
			box-shadow: 0 0 3rpx 3rpx #eee;
			display: flex;
			flex-grow: 1;
			flex-direction: column;
			padding: 0 10rpx 20rpx;
			margin: 10rpx;
			.left {
				display: flex;
				justify-content: center;
				.img {
					width: 300rpx;
					height: 300rpx;
					.img-privew {
						width: 100%;
						height: 100%;
					}
				}
			}
			.right {
				.title {
					font-size: 31rpx;
				}
				.info {
					color: #999;
				}
				.bottom {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.price-box {
						flex-shrink: 0;
						display: flex;
						color: #dc2626;
					}
					.by {
						margin: 0 10rpx;
					}
					.sale {
						color: #999;
					}
				}
			}
		}
		&.columns {
			.view-item {
				width: calc(100% - 20rpx);
				flex-direction: row;
				.right {
					display: flex;
					flex-direction: column;
					justify-content: space-around;
				}
			}
		}
	}
}
</style>
