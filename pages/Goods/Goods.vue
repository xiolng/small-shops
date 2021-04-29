<template>
	<view class="goods-box">
		<view class="u-search-box">
			<u-search
				v-model="page.productName"
				placeholder="请输入商品名称"
				@search="
					page.pageNum = 1;
					getList(page.productCategoryId);
				"
				@clear="
					page.pageNum = 1;
					getList(page.productCategoryId);
				"
				@custom="
					page.pageNum = 1;
					getList(page.productCategoryId);
				"
			/>
		</view>
		<view class="u-menu-wrap">
			<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
				<view
					v-for="(item, index) in classList"
					:key="index"
					class="u-tab-item"
					:class="[current == index ? 'u-tab-item-active' : '']"
					:data-current="index"
					@tap.stop="swichMenu(index, item)"
				>
					<text class="u-line-2">{{ item.categoryName }}</text>
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
								<view class="thumb-box" v-for="(item1, index1) in list" :key="index1" @click="goDetail(item1)">
									<image class="item-menu-image" :src="BASE_URL + '/files/' + item1.productCover" mode=""></image>
									<view class="right-box">
										<view class="item-menu-name u-line-2">{{ item1.productName }}</view>
										<view class="item-menu-info u-line-2">{{ item1.productIntro }}</view>
										<view class="price-box">
											<view class="price-txt">
											<view class="price-origin">
												<text class="red">￥</text>
												<text class="txt">{{ item1.originalPrice.toFixed(2) }}</text>
											</view>
												<text class="red">￥</text>
												<text class="txt">{{ item1.productPrice.toFixed(2) }}</text>
											</view>
											<view class="price-btn"><image class="btn-s" src="../../static/icon/shopping.png"></image></view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
export default {
	data() {
		return {
			BASE_URL,
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
			}
		};
	},
	onLoad() {
		this.getClassList();
	},
	methods: {
		getList(productCategoryId = '') {
			this.$u.api.pageProduct({ ...this.page, productCategoryId }).then(res => {
				const { data, code, total } = res.data;
				if (code === '200') {
					this.list = data || [];
					this.page.total = total;
					this.page.productCategoryId = (this.list.length && this.list[0].productCategoryId) || ''
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
					id: item1.productId
				}
			});
		},
		// 点击左边的栏目切换
		async swichMenu(index, item) {
			this.page.productName = ''
			this.page.productCategoryId = item.productCategoryId
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
			align-items: center;
			.price-txt {
				color: red;
				.red {
					font-size: 20rpx;
				}
				.txt {
					font-size: 30rpx;
				}
				.price-origin{
					color: #999;
					text-decoration: line-through;
					font-style: oblique;
					font-size: 18rpx;
					.txt{
						font-size: 24rpx;
					}
				}
			}
			.price-btn {
				width: 80rpx;
				height: 80rpx;
				.btn-s {
					width: 100%;
					height: 100%;
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
