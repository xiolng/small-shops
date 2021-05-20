<template>
	<view class="order-list-page">
		<view class="order-item u-border" v-for="item in orderList" :key="item.orderId" @click="goDetail(item)">
			<view class="order-content">
				<view class="content-txt">买家姓名：{{ item.buyerName }}</view>
				<view class="content-txt">买家电话：{{ item.buyerTel }}</view>
				<view class="content-txt">订单状态：{{ orderStatus[item.orderStatus] }}</view>
				<view class="content-txt">订单编号：{{ item.orderNo }}</view>
				<view class="content-txt" v-if="item.logsticsNo">物流单号：{{ item.logisticsNo }}</view>
				<view class="content-txt" v-if="item.logsticsName">物流公司：{{ item.logisticsName }}</view>
			</view>
			<view class="goods-list">
				<view class="goods-item" v-for="(goods, index) in item.orderDetailListOutDTOList" :key="index">
					<view class="order-img"><u-image :src="BASE_URL + '/files/' + goods.productCover" width="100%" height="100rpx"></u-image></view>
					<view class="order-detail">
						<view class="detail-txt">商品名称：{{ goods.productName }}</view>
						<view class="detail-txt">商品数量：{{ goods.productNumber }}</view>
						<view class="detail-txt">单价：{{ goods.productPrice }}</view>
					</view>
					<view class="tip-box" :class="{ active: !getIsUsed(goods) == '0' }" v-if="goods.productType == '1' && item.payStatus == 4">
						{{ !getIsUsed(goods) == '0' ? '未使用' : '已使用' }}
					</view>
				</view>
			</view>
			<view class="all-price">共{{ item.buyCount }}件，总价格：{{ item.orderPrice }}元</view>
			<view class="order-addrenss">
				<u-icon name="map"></u-icon>
				<view class="address-txt">{{ item.buyerAddress }}</view>
			</view>
			<view class="order-btn">
				<u-button v-if="item.payStatus <= 0" type="error" size="mini" @click="pushGoods(item)">支付</u-button>
				<u-button v-if="item.payStatus == 4 && (item.orderStatus >= 3 && item.orderStatus <= 7)" type="primary" size="mini" @click="ConfirmReceipt(item)">确认收货</u-button>
			</view>
		</view>

		<u-loadmore :status="status" />
		<u-top-tips ref="uTips" navbar-height="0" />
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
import { orderStatus } from '../../utils/statusBase.js';
export default {
	props: {
		orderList: Array
	},
	data() {
		return {
			BASE_URL,
			page: {
				pageNum: 1,
				pageSize: 10,
				total: 0
			},
			status: '',
			orderStatus
		};
	},
	mounted() {},
	methods: {
		ConfirmReceipt(item) {
			this.$u.api.receiptOrder({ orderId: item.orderId }).then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					this.$refs.uTips.show({
						title: '确认收货成功',
						type: 'primary'
					});
					this.$emit('get-list');
				}
			});
		},
		pushGoods(item) {
			uni.navigateTo({
				url: `/pages/Pay/Pay?orderId=${item.orderId}`
			});
			// this.$u.api
			// 	.sendProduct({
			// 		orderId: item.orderId
			// 	})
			// 	.then(res => {
			// 		if (res.data.code === '200') {
			// 			this.$refs.uTips.show({
			// 				title: '发货成功',
			// 				type: 'primary'
			// 			});
			// 		} else {
			// 			this.$refs.uTips.show({
			// 				title: res.data.msg,
			// 				type: 'error'
			// 			});
			// 		}
			// 	});
		},
		goDetail(item) {
			this.$u.route(`/pages/StockOrder/StockOrderDetail?id=${item.orderId}`);
		},
		// 总价格
		addPrice(item) {
			let allPrice = 0;
			item.orderDetailListOutDTOList.map(v => {
				allPrice += +v.productPrice;
			});
			return allPrice;
		},
		getIsUsed(item) {
			const list = (item && item.orderCardNoList) || [];
			console.log('item', item, list);
			return list.length && list.some(v => v.isUsed == '0');
		}
	}
};
</script>

<style lang="scss">
.order-list-page {
	.order-item {
		background-color: #fff;
		margin: 20rpx;
		padding: 20rpx;
		box-shadow: 0rpx 3rpx 12rpx 3rpx rgba(0, 0, 0, 0.1);
		border-radius: 10rpx;
		.order-content {
			margin-bottom: 20rpx;
			padding-bottom: 20rpx;
			border-bottom: 1px solid #eee;
			.content-txt {
				font-size: 24rpx;
				margin-bottom: 10rpx;
			}
		}
		.goods-list {
			padding: 0 20rpx;
			.goods-item {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				.order-img {
					width: 100rpx;
					flex-shrink: 0;
					align-items: center;
					margin-right: 20rpx;
				}
				.order-detail {
					flex-grow: 1;
					margin-right: 10rpx;
					.detail-txt {
						font-size: 24rpx;
					}
				}
				.tip-box {
					flex-shrink: 0;
					flex-wrap: nowrap;
					color: #999;
					&.active {
						color: $u-type-error;
					}
				}
			}
		}
		.all-price {
			line-height: 80rpx;
			text-align: right;
			padding-right: 40rpx;
			border-top: 1px solid #eee;
			border-bottom: 1px solid #eee;
		}
		.order-addrenss {
			display: flex;
			align-items: center;
			margin: 20rpx 0;
			.address-txt {
				margin-left: 20rpx;
			}
		}

		.order-btn {
			text-align: right;
		}
	}
}
</style>
