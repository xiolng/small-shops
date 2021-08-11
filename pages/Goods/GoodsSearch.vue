<template>
	<view class="goods-search">
		<view class="u-search-box"><u-search v-model="searchData" placeholder="请输入商品名称" @search="searchGoods" @custom="searchGoods" :focus="true" /></view>

		<view class="item-container" v-if="list && list.length">
			<!-- title -->
			<view class="history-title">
				<view class="history-left">
					<u-icon name="clock" size="40" />
					<text class="history-txt">历史搜索</text>
				</view>
				<view class="history-right"><u-icon name="trash-fill" size="40" @click="clearHistory" /></view>
			</view>
			<!-- history-list -->
			<view class="history-list"><u-tag v-for="(item, index) in list" :text="item" :key="index" shape="circle" type="info" style="margin: 0 10rpx 10rpx 0;" @click="goGoods(index)" @close="deleteHistory(index)" closeable /></view>
		</view>
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
export default {
	data() {
		return {
			BASE_URL,
			list: [],
			searchData: ''
		};
	},
	onLoad() {},
	onShow() {
		const oldData = uni.getStorageSync('historySearch') || [];
		this.list = oldData;
	},
	methods: {
		goGoods(index){
			uni.navigateTo({
				url: `/pages/Goods/Goods?searchName=${this.list[index]}`
			})
		},
		searchGoods() {
			if (!this.searchData) return false;
			const oldData = uni.getStorageSync('historySearch') || [];
			oldData.push(this.searchData);
			uni.setStorageSync('historySearch', oldData);
			this.searchData = ''
			uni.navigateTo({
				url: `/pages/Goods/Goods?seearchName=${this.searchData}`
			});
		},
		deleteHistory(index){
			this.list.splice(index, 1)
			uni.setStorageSync('historySearch', this.list)
		},
		clearHistory(){
			this.list = []
			uni.setStorageSync('historySearch', [])
		}
	}
};
</script>

<style lang="less">
.goods-search {
	.u-search-box {
		padding: 18rpx 30rpx;
	}

	.item-container {
		padding: 0 40rpx;
		.history-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20rpx;
			.history-left {
				display: flex;
				align-items: center;
			}
			.history-txt {
				font-size: 34rpx;
				margin-left: 4rpx;
			}
		}
		.history-list {
			display: flex;
			flex-wrap: wrap;
		}
	}
}
</style>
