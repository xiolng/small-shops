<template>
	<view class="my-box">
		<view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30" @click="isLogin()">
			<view class="u-m-r-10">
				<u-avatar v-if="memberDetail.avatarUrl" :src="memberDetail.avatarUrl.includes('https') ? memberDetail.avatarUrl : `${BASE_URL}/files/${memberDetail.avatarUrl}`" size="140"></u-avatar>
				<u-avatar v-else :src="`${memberDetail.avatarUrl}`" size="140"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{ memberDetail.nickName }}</view>
				<view class="u-font-14 u-tips-color">{{ memberDetail.phone }}</view>
			</view>
			<!-- <view class="u-m-l-10 u-p-10"><u-icon name="scan" color="#969799" size="28"></u-icon></view> -->
			<!-- <view class="u-m-l-10 u-p-10"><u-icon name="arrow-right" color="#969799" size="28"></u-icon></view> -->
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<!-- <u-cell-item
					icon="order"
					:icon-style="{ color: $u.color.warning }"
					title="订单管理"
					@click="
						isLogin() &&
							$u.route({
								url: `/pages/Order/Order`
							})
					"
				></u-cell-item> -->
				<u-cell-item
					icon="coupon"
					:icon-style="{ color: $u.color.warning }"
					title="券码"
					@click="
						isLogin() &&
							$u.route({
								url: `/pages/StockOrder/StockOrder`
							})
					"
				></u-cell-item>
			</u-cell-group>
			<u-cell-group>
				<u-cell-item
					icon="edit-pen"
					:icon-style="{ color: $u.color.warning }"
					title="信息修改"
					@click="
						isLogin() &&
							$u.route({
								url: `/pages/My/MemberDetail`
							})
					"
				></u-cell-item>
			</u-cell-group>
			<u-cell-group>
				<u-cell-item
					icon="car"
					:icon-style="{ color: $u.color.warning }"
					title="收货地址"
					@click="
						isLogin() &&
							$u.route({
								url: `/pages/My/Address`
							})
					"
				></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="chat" :icon-style="{ color: $u.color.warning }" title="问题反馈" @click="isLogin() && $u.route(`/pages/My/Feedback`)"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
import { BASE_URL } from '../../Api/BASE_API.js';
import { isLogin } from '../../utils/index.js';
import store from '../../store/index.js'
import {mapActions, mapState} from 'vuex'
export default {
	data() {
		return {
			isLogin,
			BASE_URL,
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
					this.setUserInfoAction(data)
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

.camera {
	width: 54px;
	height: 44px;

	&:active {
		background-color: #ededed;
	}
}
.user-box {
	background-color: #fff;
}
</style>
