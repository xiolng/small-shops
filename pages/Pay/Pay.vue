<template>
	<view class="pay-box">
		<!-- <view class="order-time">
			<text class="time-txt">{{ orderTime === '00:00' ? '订单已失效，请重新下单' : orderTime }}</text>
		</view> -->
		<view class="order-item">
			<view class="order-label">订单编码：</view>
			<view class="order-val">{{ orderDetail.orderNo }}</view>
		</view>
		<view class="order-item">
			<view class="order-label">订单数量：</view>
			<view class="order-val">{{ orderDetail.buyCount }}</view>
		</view>
		<view class="order-item">
			<view class="order-label">订单价格：</view>
			<view class="order-val" style="color: #FA3534;">￥{{ orderDetail.orderPrice }}</view>
		</view>
		<view class="order-item">
			<view class="order-label">商品：</view>
			<view class="order-val">
				<view class="order-list">
					<view class="order-box" v-for="(item, index) in orderDetail.orderDetailList" :key="index">
						<view class="order-img"><u-image :src="BASE_URL + '/files/' + item.productCover" width="93rpx" height="93rpx" /></view>
						<view class="right-box">
							<view class="order-name">{{ item.productName }}</view>
							<view class="flex-box">
								<view class="order-price">￥{{ item.productPrice }}</view>
								<view class="order-num">数量：{{ item.productNumber }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="order-item">
			<view class="order-label">姓名：</view>
			<view class="order-val">{{ orderDetail.buyerName }}</view>
		</view>
		<view class="order-item">
			<view class="order-label">电话：</view>
			<view class="order-val">{{ orderDetail.buyerTel }}</view>
		</view>
		<view class="order-item">
			<view class="order-label">地址：</view>
			<view class="order-val">{{ orderDetail.buyerAddress }}</view>
		</view>
		<!-- 购买按钮 -->
		<view class="btn-box"><u-button type="error" :disabled="isEnd" @click="orderPay">支付</u-button></view>
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
export default {
	data() {
		return {
			orderDetail: {},
			BASE_URL,
			orderTime: '10:00',
			timer: null,
			isEnd: false
		};
	},
	onLoad(option) {
		option.orderId && this.getOrder(option.orderId);
		// this.changeTime();
	},
	onHide() {
		// clearInterval(this.timer);
		// this.timer = null;
	},
	onUnload() {
		// clearInterval(this.timer);
		// this.timer = null;
	},
	methods: {
		getOrder(orderId) {
			this.$u.api.getOrderById({ orderId }).then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					this.orderDetail = data;
					// this.orderTime = '10:00';
					// this.changeTime();
				}
			});
		},
		changeTime() {
			clearInterval(this.timer)
			let timeNum = new Date();
			let newTime = Date.parse(timeNum) + 590000;
			this.timer = setInterval(() => {
				let oldTime = new Date();
				let timeTo = Date.parse(oldTime);
				let mm = Math.floor((newTime - timeTo) / 1000 / 60);
				let ss = ((newTime - timeTo) / 1000) % 60;
				console.log(newTime, timeTo, mm, ss);
				if (newTime >= oldTime) {
					this.orderTime = `${mm > 9 ? mm : '0' + mm} : ${ss > 9 ? ss : '0' + ss}`;
				} else {
					this.orderTime = '00:00';
					this.isEnd = true;
					clearInterval(this.timer);
					this.$u.api.cancelOrder({ orderId: this.orderDetail.orderId });
				}
			}, 1000);
		},
		orderPay() {
			const vm = this;
			this.$u.api
				.pay({
					orderId: vm.orderDetail.orderId
				})
				.then(res => {
					const { data, code } = res.data;
					if (code === '200') {
						console.log('pay', res, data);
						data.package = data.packageValue;
						delete data.packageValue;
						uni.requestPayment({
							...data,
							success(result) {
								console.log('result', result);
								vm.changePay();
								// vm.$u.api.prePayNotify({
								// 	orderId: vm.orderDetail.orderId,
								// 	payResult: 1
								// }).then(resd => {
								// 	console.log('resd', resd);
								// });
							},
							fail(err) {
								console.log('err', err);
							}
						});
					}
				});
		},
		changePay() {
			uni.showLoading({
				mask: true,
				title: '加载中'
			});
			this.$u.api.getPayStatus({ orderId: this.orderDetail.orderId }).then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					console.log('status', data);
					if (data == 4) {
						this.$u.toast(`支付成功`);
						uni.hideLoading();
						setTimeout(() => {
							uni.switchTab({
								url: `/pages/Order/Order`
							});
						}, 100);
					} else if (data == 5) {
						this.$u.toast(`支付失败`);
						uni.hideLoading();
					} else {
						setTimeout(() => {
							this.changePay();
						}, 1000);
					}
				}
			});
		}
	}
};
</script>

<style lang="less">
.pay-box {
	width: 100%;
	padding-bottom: 130rpx;
	.order-time {
		height: 100rpx;
		line-height: 100rpx;
		text-align: center;
		.time-txt {
			font-size: 40rpx;
			color: #fa3534;
		}
	}
	.order-item {
		padding: 20rpx;
		display: flex;
		.order-label {
			width: 140rpx;
			flex-shrink: 0;
		}
		.order-val {
			flex-grow: 1;
			.order-list {
				display: flex;
				flex-direction: column;
				.order-box {
					width: 100%;
					margin-bottom: 20rpx;
					display: flex;
					align-items: flex-start;
					.order-img {
						width: 100rpx;
						border: 1px solid #eee;
						margin-right: 10rpx;
					}
					.right-box {
						min-height: 96rpx;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						.order-name {
							font-size: 30rpx;
						}
						.flex-box {
							display: flex;
							justify-content: space-between;
							.order-price {
								color: #fa3534;
								margin-right: 10rpx;
							}
							.order-num {
							}
						}
					}
				}
			}
		}
	}
	.btn-box {
		width: 100%;
		height: 120rpx;
		background: #fff;
		padding: 20rpx;
		box-sizing: border-box;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
	}
}
</style>
