<template>
	<view class="goods-search">
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
				:focus="true"
			/>
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
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
export default {
	data() {
		return {
			BASE_URL,
			list: [],
			classList: [],
			page: {
				pageNum: 1,
				pageSize: 10,
				total: 0,
				productName: ''
			}
		};
	},
	onLoad() {},
	mounted() {
	},
	methods: {
		getList() {
			this.$u.api.pageProduct({ ...this.page }).then(res => {
				const { data, code, total } = res.data;
				if (code === '200') {
					this.list = data || [];
					this.page.total = total;
				}
			});
		},
		goDetail(item1) {
			this.$u.route({
				url: `/pages/Goods/GoodsDetail`,
				params: {
					id: item1.productId,
					productType: item1.productType
				},
				type: 'redirectTo'
			});
		},
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
		display: flex;
		flex-wrap: wrap;
	}

	.thumb-box {
		width: 100%;
		background: #efefef;
		padding: 10rpx;
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
					width: 80rpx;
					height: 80rpx;
					.btn-s {
						width: 100%;
						height: 100%;
					}
				}
			}
		}
		.item-menu-image {
			width: 180rpx;
			height: 180rpx;
			flex-shrink: 0;
		}
	}
}
</style>
