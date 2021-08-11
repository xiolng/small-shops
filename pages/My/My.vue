<template>
	<view class="my-box">
		<view class="u-flex customeNav">
			<view class="abs-box">
				<view class="static-box">
					<view class="u-m-r-10 abs-item">
						<u-avatar
							v-if="memberDetail.avatarUrl"
							:src="memberDetail.avatarUrl.includes('https') ? memberDetail.avatarUrl : `${BASE_URL}/files/${memberDetail.avatarUrl}`"
							size="140"
						></u-avatar>
						<u-avatar v-else :src="`${memberDetail.avatarUrl}`" size="140"></u-avatar>
					</view>
					<view class="u-flex-1 abs-item">
						<view class="u-font-18 u-p-b-20">{{ memberDetail.nickName }}</view>
						<view class="u-font-14">{{ memberDetail.phone }}</view>
					</view>
					<!-- <view class="u-m-l-10 u-p-10"><u-icon name="scan" color="#969799" size="28"></u-icon></view> -->
					<!-- <view class="u-m-l-10 u-p-10"><u-icon name="arrow-right" color="#969799" size="28"></u-icon></view> -->
				</view>
			</view>
		</view>

		<view class="tab-box">
			<view class="tab-title">我的订单</view>
			<u-grid :col="4">
				<u-grid-item
					@click="
						isLogin() &&
							$u.route({
								url: `/pages/StockOrder/StockOrder`
							})
					"
				>
					<u-icon name="rmb" size="49" color="#ff0000"></u-icon>
					<view class="grid-text">待付款</view>
				</u-grid-item>
				<u-grid-item
					@click="
						$u.route({
							url: `/pages/My/MemberDetail`
						})
					"
				>
					<u-icon name="shopping-cart-fill" size="49" color="#ff0000"></u-icon>
					<view class="grid-text">待发货</view>
				</u-grid-item>
				<u-grid-item
					@click="
						$u.route({
							url: `/pages/My/Address`
						})
					"
				>
					<u-icon name="car" size="49" color="#ff0000"></u-icon>
					<view class="grid-text">待收货</view>
				</u-grid-item>
				<u-grid-item @click="isLogin() && $u.route(`/pages/My/Feedback`)">
					<u-icon name="chat" size="49" color="#ff0000"></u-icon>
					<view class="grid-text">待评价</view>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="u-m-20">
			<u-cell-group>
				<u-cell-item
					icon="edit-pen"
					:icon-style="{color: '#00aa7f'}"
					title="信息修改"
					@click="
						$u.route({
							url: `/pages/My/ShopDetail`
						})
					"
				></u-cell-item>
				<u-cell-item
					icon="red-packet"
					:icon-style="{color: '#ff00ff'}"
					title="我的券码"
					@click="
						$u.route({
							url: `/pages/StockOrder/StockOrder`
						})
					"
				></u-cell-item>
				<u-cell-item
					icon="coupon"
					:icon-style="{color: '#ff0000'}"
					title="我的优惠券"
					@click="
						$u.route({
							url: `/pages/My/Coupon`
						})
					"
				></u-cell-item>
				<u-cell-item
					icon="list-dot"
					:icon-style="{color: '#55aaff'}"
					title="收货地址"
					@click="
						$u.route({
							url: `/pages/My/Address`
						})
					"
				></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-20">
			<u-cell-group><u-cell-item icon="chat"
					:icon-style="{color: '#ffaa7f'}" title="问题反馈" @click="$u.route(`/pages/My/Feedback`)"></u-cell-item></u-cell-group>
		</view>
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
import { isLogin } from '../../utils/index.js';
import store from '../../store/index.js';
import { mapActions, mapState } from 'vuex';
import squImg from './image/squ.svg';
import msgImg from './image/msg.svg';
import addressImg from './image/address.svg';
import faImg from './image/fa.svg';
export default {
	data() {
		return {
			isLogin,
			BASE_URL,
			squImg,
			msgImg,
			addressImg,
			faImg
		};
	},
	mounted() {
		this.getMemberDetail();
	},
	computed: mapState({
		memberDetail: 'userInfo'
	}),
	methods: {
		getMemberDetail() {
			this.$u.api.getMember().then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					uni.setStorageSync('userInfo', data);
					this.setUserInfoAction(data);
				}
			});
		},
		...mapActions(['setUserInfoAction'])
	}
};
</script>

<style lang="scss">
page {
	background-color: #ededed;
}
.my-box {
	.customeNav {
		width: 100vw;
		height: 480rpx;
		position: relative;
		.abs-box {
			width: 1000px;
			background: linear-gradient(to bottom, $u-type-primary-light, $u-type-primary);
			display: flex;
			justify-content: center;
			padding: 250rpx calc(100vw - 1000px) 50rpx;
			border-radius: 0 0 100% 100%;
			overflow: hidden;
			position: absolute;
			left: -300px;
			top: 0;
			box-sizing: border-box;
			color: #fff;
			.static-box {
				width: 100vw;
				padding: 0 40rpx;
				display: flex;
				align-items: center;
			}
		}
	}
	.tab-box {
		background: #fff;
		margin: 10rpx 20rpx;
		.tab-title {
			font-size: 32rpx;
			padding: 20rpx;
		}
		.grid-text {
			margin-top: 20rpx;
		}
	}
}
.camera {
	width: 54px;
	height: 44px;

	&:active {
		background-color: #ededed;
	}
}
</style>
