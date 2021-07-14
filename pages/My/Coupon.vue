<template>
	<view class="coupon-box">
		<view><u-tabs-swiper ref="uTabs" :list="list" :current="current" @change="tabsChange" :is-scroll="false" swiperWidth="750"></u-tabs-swiper></view>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish" style="height: calc(100vh - 150rpx);">
			<swiper-item class="swiper-item" v-for="(item, index) in list" :key="index">
				<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
					<view class="coupon-list">
						<view class="coupon-item" :class="[item.couponType == 1 ? 'dedu' : '']" v-for="item in couponData" :key="item.couponId">
							<view class="coupon-top">
								<view class="coupon-name" v-if="item.couponType == 0">{{ item.couponName }} (满 {{ item.fullLimit }}元 - {{ item.deduAmount }}元)</view>
								<view class="coupon-name" v-else>{{ item.couponName }} (满 {{ item.fullLimit }}元 打 {{ item.deduProp }}折)</view>
								<view class="coupon-type">{{ item.couponType ? '折扣券' : '满减券' }}</view>
							</view>
							<view class="coupon-bot">
								<view class="left">
									<view class="dates">有效时间：{{ item.launchStartTime }}-{{ item.launchEndTime }}</view>
									<view class="used-range">适用范围：{{ item.usedRange ? '指定商品' : '全部商品' }}</view>
								</view>
								<view class="right">{{ couponStatus[item.usedStatus] }}</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [
				{
					name: '待使用'
				},
				{
					name: '已使用'
				}
			],
			// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
			current: 0, // tabs组件的current值，表示当前活动的tab选项
			swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
			couponStatus: ['未使用', '已使用', '已失效'],
			couponData: [],
			tabType: 0,
			pageNum: 1
		};
	},
	mounted() {
		this.getCoupon(0);
	},
	methods: {
		getCoupon(type) {
			if (this.tabType !== type) {
				this.tabType = type;
				this.pageNum = 1;
				this.couponData = [];
			}
			this.$u.api
				.memberCouponPage({
					usedStatus: this.tabType,
					pageNum: this.pageNum,
					pageSize: 10
				})
				.then(res => {
					const { code, data, msg } = res.data;
					if (code == '200') {
						this.couponData = this.couponData.concat(data);
					}
				});
		},
		// tabs通知swiper切换
		tabsChange(index) {
			this.swiperCurrent = index;
			this.getCoupon(index)
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
		},
		// scroll-view到底部加载更多
		onreachBottom() {
			this.getCoupon(this.tabType)
		}
	}
};
</script>

<style lang="scss">
.coupon-box {
	min-height: 100vh;
	.swiper-item {
		min-height: calc(100vh - 100rpx);
		.coupon-list {
			padding: 20rpx;
			.coupon-item {
				background: #dd524d;
				border-radius: 20rpx;
				color: #fff;
				margin: 0 0 20rpx;
				padding: 20rpx;
				&.dedu {
					background: #f29100;
				}
				.coupon-top {
					border-bottom: 1px solid #fff;
					padding: 10rpx;
					display: flex;
					justify-content: space-between;
					.coupon-name {
						font-size: 28rpx;
					}
					.coupon-type {
						font-size: 28rpx;
					}
				}
				.coupon-bot {
					padding: 10rpx;
					display: flex;
					justify-content: space-between;
					.left {
						.dates {
							margin-bottom: 10rpx;
						}
						.used-range {
							font-size: 26rpx;
						}
					}
					.right {
						flex-shrink: 0;
						font-size: 30rpx;
					}
				}
			}
		}
	}
}
</style>
