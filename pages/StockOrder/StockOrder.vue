<template>
	<view class="stock-order">
		<view><u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750" bar-width="140"></u-tabs-swiper></view>
		<view class="swiper-box">
			<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" class="swiper-content">
				<swiper-item class="swiper-item" :key="0" @touchmove.stop="() => true">
					<movable-area class="movable-box">
						<!-- <movable-view class="search-btn" :x="x" :y="y" direction="all" @change="onChange" inertia @click="showSearch = true">
							<u-icon name="search" size="40rpx"></u-icon>
						</movable-view> -->
						<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
							<stock-order-list ref="OrderList" v-if="current === 0" :order-list="orderList" @get-list="page.pageNum = 1; getOrder()" />
						</scroll-view>
					</movable-area>
				</swiper-item>
				<swiper-item class="swiper-item" :key="1" @touchmove.stop="() => true">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
						<stock-order-list ref="OrderList" v-if="current === 1" :order-list="orderList" @get-list="getOrder()" />
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		<!-- search -->
		<!-- <u-popup v-model="showSearch" width="80%" border-radius="20">
			<view class="search-box">
				<view class="search-title">搜索</view>
				<u-form :model="searchData" label-width="160" ref="searchRef">
					<u-form-item label="买家地址:"><u-input placeholder="请输入买家地址" v-model="searchData.buyerAddress"></u-input></u-form-item>
					<u-form-item label="买家姓名:"><u-input placeholder="请输入买家姓名" v-model="searchData.buyerName"></u-input></u-form-item>
					<u-form-item label="买家电话:"><u-input placeholder="请输入买家电话" v-model="searchData.buyerTel"></u-input></u-form-item>
					<u-form-item label="订单状态:">
						<u-radio-group v-model="searchData.orderStatus">
							<u-radio name="0">已发货</u-radio>
							<u-radio name="1">未发货</u-radio>
							<u-radio name="2">已取消</u-radio>
						</u-radio-group>
					</u-form-item>
				</u-form>
				<u-button type="primary" @click="searchPage">搜索</u-button>
			</view>
		</u-popup> -->
		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
import StockOrderList from './StockOrderList.vue';
export default {
	components: {
		'stock-order-list': StockOrderList
	},
	data() {
		return {
			showSearch: false,
			searchData: {
				buyerAddress: '',
				buyerName: '',
				buyerTel: '',
				orderStatus: 0,
				productType: 1,
				isUsed: '0'
			},
			page: {
				pageNum: 1,
				pageSize: 10,
				total: 0
			},
			x: this.$u.sys().windowWidth,
			y: this.$u.sys().windowHeight - 200,
			old: {
				x: 0,
				y: 0
			},
			list: [
				{
					name: ' 全部 '
				},
				{
					name: ' 待使用 '
				}
			],
			// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
			current: 1, // tabs组件的current值，表示当前活动的tab选项
			swiperCurrent: 1, // swiper组件的current值，表示当前那个swiper-item是活动的
			orderList: []
		};
	},
	onShow() {
		this.getOrder();
	},
	methods: {
		getOrder() {
			this.$u.api
				.pageOrder({
					...this.searchData,
					...this.page
				})
				.then(res => {
					if (this.page.pageNum == 1) {
						this.orderList = [];
					}
					this.searchData.buyerAddress = '';
					this.searchData.buyerName = '';
					this.searchData.buyerTel = '';
					this.searchData.orderStatus = 0;
					const { data, code, total } = res.data;
					if (code === '200') {
						if (this.page.pageNum !== 1 && (!data || data.length <= 0)) {
							this.$refs.uTips.show({
								title: '已加载全部',
								type: 'warning'
							});
							return false;
						}
						this.orderList = this.orderList.concat(data);
						this.page.total = total;
						this.page.pageNum += 1;
					}
				});
		},
		searchPage() {
			this.showSearch = false;
			this.page.pageNum = 1;
			this.getOrder();
		},
		onChange: function(e) {
			this.old.x = e.detail.x;
			this.old.y = e.detail.y;
		},
		// scroll-view到底部加载更多
		onreachBottom() {
			this.getOrder();
		},
		// tabs通知swiper切换
		tabsChange(index) {
			this.swiperCurrent = index;
		},
		// swiper-item左右移动，通知tabs的滑块跟随移动
		transition(e) {
			let dx = e.detail.dx;
			this.$refs.uTabs.setDx(dx);
		},
		// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
		// swiper滑动结束，分别设置tabs和swiper的状态
		animationfinish(e) {
			let current = e.detail.current;
			this.$refs.uTabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
			this.page.pageNum = 1;
			this.searchData.isUsed = e.detail.current == '1' ? 0 : '';
			this.getOrder();
		}
	},
	onPullDownRefresh() {
		this.getOrder();
		uni.stopPullDownRefresh();
	}
};
</script>

<style lang="scss">
.stock-order {
	.swiper-box {
		margin: 20rpx;
		background-color: $u-bg-color;
		.swiper-content {
			/* #ifdef H5 */
			height: calc(100vh - 154px);
			/* #endif */
			/* #ifdef MP-WEIXIN */
			height: calc(100vh - 68px);
			/* #endif */

			.movable-box {
				width: 100%;
				height: 100%;
			}
			.search-btn {
				position: fixed;
				right: 0;
				z-index: 9999;
				width: 100rpx;
				height: 100rpx;
				background-color: $u-type-primary;
				color: #fff;
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 100%;
			}
		}
	}
	.search-btn {
		position: fixed;
		right: 0;
		z-index: 9999;
		width: 100rpx;
		height: 100rpx;
		background-color: $u-type-primary;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 100%;
	}

	.search-box {
		height: 100%;
		padding: 40rpx;
		background-color: rgba($color: $u-type-primary, $alpha: 0.05);
		box-sizing: border-box;
		.search-title {
			margin-bottom: 40rpx;
			border-bottom: 1px solid #eee;
			padding-bottom: 20rpx;
		}
		.u-btn {
			margin-top: 40rpx;
		}
	}
}
</style>
