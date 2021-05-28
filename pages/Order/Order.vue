<template>
	<view class="order-box">
		<movable-area class="movable-box">
			<!-- <movable-view class="search-btn" :x="x" :y="y" direction="all" @change="onChange" inertia @click="showSearch = true">
				<u-icon name="search" size="40rpx"></u-icon>
			</movable-view> -->
			<scroll-view scroll-y style="height: 100vh;width: 100%;" @scrolltolower="onreachBottom">
				<order-list
					ref="OrderList"
					:order-list="orderList"
					@get-list="
						page.pageNum = 1;
						getOrder();
					"
				/>
			</scroll-view>
		</movable-area>
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
import OrderList from './OrderList.vue';
export default {
	components: {
		'order-list': OrderList
	},
	data() {
		return {
			showSearch: false,
			searchData: {
				buyerAddress: '',
				buyerName: '',
				buyerTel: '',
				orderStatus: 0,
				// productType: 0
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
			orderList: []
		};
	},
	onShow() {
		this.getOrder();
	},
	onHide() {
		this.page.pageNum = 1;
	},
	methods: {
		getOrder() {
			this.$u.api
				.pageOrder({
					...this.searchData,
					...this.page
				})
				.then(res => {
					this.searchData.buyerAddress = '';
					this.searchData.buyerName = '';
					this.searchData.buyerTel = '';
					this.searchData.orderStatus = 0;
					const { data, code, total } = res.data;
					if (code === '200') {
						if (this.page.pageNum == 1) {
							this.orderList = [];
						}
						if (!data || data.length <= 0) {
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
		}
	},
	onPullDownRefresh() {
		this.getOrder();
		uni.stopPullDownRefresh();
	}
};
</script>

<style lang="scss">
.order-box {
	background: #eee;
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
