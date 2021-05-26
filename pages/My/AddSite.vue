<template>
	<view class="wrap">
		<view class="top">
			<view class="item">
				<view class="left">收货人</view>
				<input type="text" v-model="form.receiveName" placeholder-class="line" placeholder="请填写收货人姓名" />
			</view>
			<view class="item">
				<view class="left">手机号码</view>
				<input type="text" v-model="form.receivePhone" placeholder-class="line" placeholder="请填写收货人手机号" />
			</view>
			<!-- <view class="item" @tap="showRegionPicker">
				<view class="left">所在地区</view>
				<input disabled type="text" placeholder-class="line" placeholder="省市区县、乡镇等" />
			</view> -->
			<view class="item address">
				<view class="left">收货人地址</view>
				<input type="text" v-model="form.receiveAddress" placeholder-class="line" placeholder="请输入收货人地址" />
			</view>
			<!-- <view class="site-clipboard">
				<textarea placeholder-class="line" value="" placeholder="粘贴文本,可自动识别姓名和地址等" />
				<view class="clipboard">
					地址粘贴板
					<u-icon name="arrow-down" class="icon" :size="20"></u-icon>
				</view>
			</view> -->
		</view>
		<view class="bottom">
			<!-- <view class="tag">
				<view class="left">标签</view>
				<view class="right">
					<text class="tags">家</text>
					<text class="tags">公司</text>
					<text class="tags">学校</text>
					<view class="tags plus"><u-icon size="22" name="plus"></u-icon></view>
				</view>
			</view> -->
			<view class="default">
				<view class="left">
					<view class="set">设置默认地址</view>
					<view class="tips">提醒：每次下单会默认推荐该地址</view>
				</view>
				<view class="right u-m-r-10"><u-switch color="red" v-model="form.isDefault" @change="setDefault" /></view>
			</view>
			<view class="u-m-l-10 u-m-r-10 u-m-t-20"><u-button type="primary" @click="saveAddress" shape="circle">提交</u-button></view>
		</view>
		<!-- <u-picker mode="region" ref="uPicker" v-model="show" /> -->
		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			show: false,
			form: {
				isDefault: false,
				receiveAddress: '',
				receiveName: '',
				receivePhone: ''
			},
			isEdit: ''
		};
	},
	onLoad(options) {
		this.isEdit = options.id;
		this.getAddressDetail(options.id);
	},
	methods: {
		getAddressDetail(tenantMemberReceiveId) {
			this.$u.api.getMemberReceiveById({ tenantMemberReceiveId }).then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					Object.keys({ ...this.form, tenantMemberId: '', tenantMemberReceiveId: '' }).map(v => {
						this.form[v] = data[v];
					});
					this.form.isDefault = !!res.data.data.isDefault;
				}
			});
		},
		saveAddress() {
			this.$u.api[this.isEdit ? 'updateMemberReceive' : 'saveMemberReceive']({
				...this.form,
				tenantMemberId: uni.getStorageSync('userInfo').tenantMemberId,
				isDefault: +this.form.isDefault
			}).then(res => {
				if (res.data.code === '200') {
					let pages = getCurrentPages(); // 当前页面
					let beforePage = pages[pages.length - 2]; // 前一个页面
					console.log('beforePage', beforePage);
					console.log(pages);

					beforePage.$vm.getData(true);
					this.$refs.uTips.show({
						title: `提交成功`,
						type: 'success'
					});
					this.$u.route({
						type: 'navigateBack',
						delta: 1
					});
				}
			});
		},
		setDefault(data) {
			console.log(data);
			this.form.isDefault = data;
		}
	}
};
</script>

<style lang="scss" scoped>
/deep/ .line {
	color: $u-light-color;
	font-size: 28rpx;
}
.wrap {
	background-color: #f2f2f2;
	.top {
		background-color: #ffffff;
		border-top: solid 2rpx $u-border-color;
		padding: 22rpx;
		.item {
			display: flex;
			font-size: 32rpx;
			line-height: 100rpx;
			align-items: center;
			border-bottom: solid 2rpx $u-border-color;
			.left {
				width: 180rpx;
			}
			input {
				text-align: left;
			}
		}

		.address {
			padding: 20rpx 0;
			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
		}
		.site-clipboard {
			padding-right: 40rpx;
			textarea {
				// width: 100%;
				height: 150rpx;
				background-color: #f7f7f7;
				line-height: 60rpx;
				margin: 40rpx auto;
				padding: 20rpx;
			}
			.clipboard {
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 26rpx;
				color: $u-tips-color;
				height: 80rpx;
				.icon {
					margin-top: 6rpx;
					margin-left: 10rpx;
				}
			}
		}
	}
	.bottom {
		margin-top: 20rpx;
		padding: 20rpx;
		background-color: #ffffff;
		font-size: 28rpx;
		.tag {
			display: flex;
			.left {
				width: 160rpx;
			}
			.right {
				display: flex;
				flex-wrap: wrap;
				.tags {
					width: 140rpx;
					padding: 16rpx 8rpx;
					border: solid 2rpx $u-border-color;
					text-align: center;
					border-radius: 50rpx;
					margin: 0 10rpx 20rpx;
					display: flex;
					font-size: 28rpx;
					align-items: center;
					justify-content: center;
					color: $u-content-color;
					line-height: 1;
				}
				.plus {
					//padding: 10rpx 0;
				}
			}
		}
		.default {
			margin-top: 50rpx;
			display: flex;
			justify-content: space-between;
			border-bottom: solid 2rpx $u-border-color;
			line-height: 64rpx;
			.tips {
				font-size: 24rpx;
			}
			.right {
			}
		}
	}
}
</style>
