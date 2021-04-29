<template>
	<view>
		<scroll-view scroll-y style="width: 100%; height: 100vh;" @scrolltolower="onreachBottom">
			<view class="item" v-for="(res, index) in siteList" :key="res.id">
				<view class="top">
					<view class="name">{{ res.receiveName }}</view>
					<view class="phone">{{ res.receivePhone }}</view>
					<view class="tag" v-if="res.isDefault"><text :key="index" :class="{ red: res.isDefault }">默认</text></view>
				</view>
				<view class="bottom">
					{{ res.receiveAddress }}
					<view class="right">
						<u-icon name="edit-pen" class="u-m-r-20" :size="40" color="#00aaff" @click="$u.route(`/pages/My/AddSite?id=${res.tenantMemberReceiveId}`)"></u-icon>
						<u-icon name="trash" :size="40" color="red" @click="delAddress" :index="res.tenantMemberReceiveId"></u-icon>
					</view>
				</view>
			</view>
			<view class="addSite" @click="toAddSite">
				<view class="add">
					<u-icon name="plus" color="#ffffff" class="icon" :size="30"></u-icon>
					新建收货地址
				</view>
			</view>
			<u-loadmore status="nomore" />
		</scroll-view>
		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			siteList: [],
			page: {
				pageNum: 1,
				pageSize: 10
			}
		};
	},
	onLoad() {
		this.getData();
	},
	methods: {
		getData(isAdd) {
			this.page.pageNum = isAdd ? 1 : this.page.pageNum;
			this.siteList = isAdd ? [] : this.siteList;
			this.$u.api.pageMemberReceive().then(res => {
				const { data, code } = res.data;
				if (code === '200') {
					if (data.length <= 0) {
						this.siteList = isAdd ? data : this.siteList.concat(data);
						this.$refs.uTips.show({
							title: '已加载全部',
							type: 'warning'
						});
						return false;
					}
					this.siteList = this.siteList.concat(data);
					this.page.pageNum += 1;
				}
			});
		},
		toAddSite() {
			this.$u.route('/pages/My/AddSite');
		},
		onreachBottom() {
			this.getData(true);
		},
		delAddress(tenantMemberReceiveId) {
			console.log('tenantMemberReceiveId', tenantMemberReceiveId);
			this.$u.api
				.deleteMemberReceive({
					tenantMemberReceiveId
				})
				.then(res => {
					if (res.data.code === '200') {
						this.$refs.uTips.show({
							title: '删除成功',
							type: 'success'
						});
						this.siteList = this.siteList.filter(v => v.tenantMemberReceiveId !== tenantMemberReceiveId);
					}
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.item {
	padding: 40rpx 20rpx;
	.top {
		display: flex;
		font-weight: bold;
		font-size: 34rpx;
		.phone {
			margin-left: 60rpx;
		}
		.tag {
			display: flex;
			font-weight: normal;
			align-items: center;
			text {
				display: block;
				width: 60rpx;
				height: 34rpx;
				line-height: 34rpx;
				color: #ffffff;
				font-size: 20rpx;
				border-radius: 6rpx;
				text-align: center;
				margin-left: 30rpx;
				background-color: rgb(49, 145, 253);
			}
			.red {
				background-color: red;
			}
		}
	}
	.bottom {
		display: flex;
		margin-top: 20rpx;
		font-size: 28rpx;
		justify-content: space-between;
		color: #999999;
	}
}
.addSite {
	display: flex;
	justify-content: space-around;
	width: 600rpx;
	line-height: 80rpx;
	position: fixed;
	bottom: 30rpx;
	left: 80rpx;
	background-color: $u-type-primary;
	border-radius: 10rpx;
	font-size: 30rpx;
	.add {
		display: flex;
		align-items: center;
		color: #ffffff;
		.icon {
			margin-right: 10rpx;
		}
	}
}
</style>
