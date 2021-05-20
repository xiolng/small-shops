<template>
	<view class="order-detail">
		<view class="order-box">
			<view class="order-title">订单信息</view>
			<view class="order-content">
				<view class="item-box">
					<view class="item-label">订单编号：</view>
					<view class="item-val">{{ orderDetail.orderNo }}</view>
				</view>
				<view class="item-box">
					<view class="item-label">订单状态：</view>
					<view class="item-val">{{ orderStatus[orderDetail.orderStatus] }}</view>
				</view>
				<view class="item-box">
					<view class="item-label">支付状态：</view>
					<view class="item-val">{{ payStatus[orderDetail.payStatus] }}</view>
				</view>
				<view class="item-box">
					<view class="item-label">订单价格：</view>
					<view class="item-val">{{ orderDetail.orderPrice }}</view>
				</view>
			</view>
		</view>
		<view class="order-box">
			<view class="order-title">商品信息</view>
			<view class="order-content">
				<view class="goods-list">
					<view class="box-list" v-for="(goods, index) in orderDetail.orderDetailList" :key="index">
						<view class="goods-item">
							<view class="order-img"><u-image :src="BASE_URL + '/files/' + goods.productCover" width="100%" height="100rpx"></u-image></view>
							<view class="order-details">
								<view class="detail-txt">商品名称：{{ goods.productName }}</view>
								<view class="detail-txt">商品数量：{{ goods.productNumber }}</view>
								<view class="detail-txt">单价：{{ goods.productPrice }}</view>
							</view>
						</view>
						<view class="card-msg" :class="{ active: goods.checked }" v-if="goods.orderCardNoList && goods.orderCardNoList.length">
							<view class="card-box" v-for="(item, inx) in goods.orderCardNoList" :key="inx">
								<view class="card-label">卡券码：</view>
								<view class="card-content">
									{{ item.orderCardNo }}
									<view class="btn-box" v-if="!item.isUsed">
										<u-button type="primary" size="mini" :disabled="!changeIsUsed(goods)" @click="setQr(goods)">使用</u-button>
									</view>
								</view>
							</view>
							<view class="card-box">
								<view class="card-label">商品名称：</view>
								<view class="card-content">{{ goods.productName }}</view>
							</view>
							<view class="card-box">
								<view class="card-label">有效期：</view>
								<view class="card-content">{{ goods.startTime }}/{{ goods.endTime }}</view>
							</view>
							<view class="card-box">
								<view class="card-label">使用范围：</view>
								<view class="card-content">{{ goods.applyRange }}</view>
							</view>
							<view class="card-box">
								<view class="card-label">使用规则：</view>
								<view class="card-content">{{ goods.useRole }}</view>
							</view>
							<view class="card-box">
								<view class="card-label">不可用：</view>
								<view class="card-content">{{ goods.unAvailable }}</view>
							</view>
							<view class="card-box">
								<view class="card-label">使用时间：</view>
								<view class="card-content">{{ goods.useTime }}</view>
							</view>
							<!-- <u-divider class="absolute-box" @click="setChecked(goods)">{{ goods.checked ? '收起' : '展开更多' }}</u-divider> -->
						</view>
					</view>
				</view>
				<view class="all-price">共{{ orderDetail.buyCount }}件，总价格：{{ orderDetail.orderPrice }}元</view>
			</view>
		</view>
		<view class="order-box" v-if="orderDetail.logisticsName && orderDetail.logisticsNo">
			<view class="order-title">物流信息</view>
			<view class="order-content">
				<view class="item-box">
					<view class="item-label">物流名称：</view>
					<view class="item-val">{{ orderDetail.logisticsName }}</view>
				</view>
				<view class="item-box">
					<view class="item-label">物流单号：</view>
					<view class="item-val">{{ orderDetail.logisticsNo }}</view>
				</view>
			</view>
		</view>
		<view class="order-box">
			<view class="order-title">用户信息</view>
			<view class="order-content">
				<view class="item-box">
					<view class="item-label">用户名：</view>
					<view class="item-val">{{ orderDetail.buyerName }}</view>
				</view>
				<view class="item-box">
					<view class="item-label">电话：</view>
					<view class="item-val">{{ orderDetail.buyerTel }}</view>
				</view>
				<view class="item-box">
					<view class="item-label">收货地址：</view>
					<view class="item-val">{{ orderDetail.buyerAddress }}</view>
				</view>
			</view>
		</view>
		<u-modal title="券码" v-model="showQrCode" ref="qrcodeModal" mask-close-able>
			<view style="height: 420rpx; text-align: center; margin-top: 30rpx;">
				<tki-qrcode v-if="showQrCode" cid="qrcode1" ref="qrcode" :val="val" :size="400" :lv="lv" :onval="onval" :loadMake="loadMake" :usingComponents="true" />
			</view>
		</u-modal>
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
import{orderStatus, payStatus} from '../../utils/statusBase.js'
export default {
	components: {
		tkiQrcode
	},
	data() {
		return {
			BASE_URL,
			orderDetail: {},
			orderStatus,
			payStatus,
			showQrCode: false,
			ifShow: true,
			val: '二维码', // 要生成的二维码值
			lv: 3, // 二维码容错级别 ， 一般不用设置，默认就行
			onval: false, // val值变化时自动重新生成二维码
			loadMake: true // 组件加载完成后自动生成二维码
		};
	},
	onLoad(options) {
		console.log('options', options);
		this.$u.api
			.getOrderById({
				orderId: options.id
			})
			.then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					data.orderDetailList.map(v => {
						v.checked = true;
						return v;
					});
					this.orderDetail = data;
				}
			});
		setTimeout(() => {
			console.log('qr', this.$refs);
		}, 2000);
	},
	methods: {
		setQr(item, order) {
			this.val = `orderCardNo=${item.orderCardNo}&orderDetailId=${order.orderDetailId}`;
			this.showQrCode = true;
		},
		setChecked(item) {
			item.checked = !item.checked;
		},
		changeIsUsed(item) {
			const list = item.orderCardNoList || [];
			const actives = list.filter(v => !v.isUsed) || [];
			console.log('actives0', actives);
			return actives.length;
		}
	}
};
</script>

<style lang="less">
.order-detail {
	width: 100%;
	min-height: 100vh;
	padding: 20rpx;
	background-color: #f1f1f1;
	.order-box {
		background-color: #fff;
		border-radius: 20rpx;
		border: 1px solid #dddddd;
		padding: 20rpx 20rpx;
		margin-bottom: 20rpx;
		.order-title {
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
		.order-content {
			font-size: 24rpx;
			padding: 10rpx;
			.item-box {
				padding: 5rpx 0;
				display: flex;
				.item-label {
					width: 124rpx;
					flex-shrink: 0;
					color: #3f536e;
					text-align: right;
				}
				.item-val {
					flex-grow: 1;
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
					.order-details {
						flex-grow: 1;
						margin-right: 10rpx;
						.detail-txt {
							font-size: 24rpx;
						}
					}
				}
				.card-msg {
					height: 60rpx;
					overflow: hidden;
					border: 1px solid #eee;
					border-top: 0;
					border-width: 0;
					border-radius: 0 0 20rpx 20rpx;
					position: relative;
					padding: 0 20rpx 20rpx;
					margin: 0 0 20rpx;
					font-size: 24rpx;
					&.active {
						height: auto;
						border-width: 1rpx;
					}
					.absolute-box {
						position: absolute;
						left: 0;
						bottom: 0;
						right: 0;
						background-color: #fff;
						text-align: center;
						line-height: 60rpx;
						z-index: 9;
					}
					.card-box {
						display: flex;
						margin-bottom: 10rpx;
						.card-label {
							width: 120rpx;
							flex-shrink: 0;
							color: #999;
							text-align: right;
						}
						.card-content {
							flex-grow: 1;
							.active {
								color: #999;
							}
							.btn-box{
								display: inline;
								margin-left: 20rpx;
							}
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
		}
	}
}
</style>
