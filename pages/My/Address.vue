<template>
	<view class="address-main">
		<scroll-view scroll-y style="width: 100%; height: 100vh;" @scrolltolower="onreachBottom">
			<view class="item" v-for="(res, index) in siteList" :key="res.id">
				<view class="top">
					<view class="name">{{ res.receiveName }}</view>
					<view class="phone">{{ res.receivePhone }}</view>
				</view>
				<view class="bottom">{{ res.receiveAddress }}</view>
				<view class="footer">
					<view class="left-default">
						<u-checkbox v-model="res.isDefault" :disabled="!res.isDetault" shape="circle" :active-color="$u.color.primary" :name="res.id">默认收货地址</u-checkbox>
					</view>
					<view class="right-icons">
						<view class="icon-box" @click="$u.route(`/pages/My/AddSite?id=${res.tenantMemberReceiveId}`)">
							<u-image width="27" height="27" :src="editImg" style="margin-right: 8rpx;" />
							<text>编辑</text>
						</view>
						<view class="icon-box" @click="delAddress" :index="res.tenantMemberReceiveId">
							<u-image width="27" height="27" :src="deleteImg" style="margin-right: 8rpx;" />
							<text>删除</text>
						</view>
					</view>
				</view>
			</view>
			<view class="addSite" @click="toAddSite"><view class="add">新建收货地址</view></view>
			<u-loadmore status="nomore" />
		</scroll-view>
		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
import editImg from './image/edit.svg';
import deleteImg from './image/delete.svg';
export default {
	data() {
		return {
			editImg,
			deleteImg,
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

<style lang="scss">
.address-main {
	background: #eee;
	padding: 20rpx;
}
.item {
	background: #fff;
	padding: 40rpx 20rpx 0;
	margin-bottom: 20rpx;
	border-radius: 10rpx;
	.top {
		display: flex;
		font-weight: bold;
		font-size: 34rpx;
		.phone {
			font-size: 30rpx;
			font-weight: normal;
			margin-left: 60rpx;
		}
	}
	.bottom {
		display: flex;
		margin: 20rpx 0;
		font-size: 28rpx;
		justify-content: space-between;
		color: #999999;
	}
	.footer {
		width: 100%;
		display: flex;
		border-top: 1px solid #eee;
		padding: 20rpx;
		justify-content: space-between;
		align-items: center;
		font-size: 24rpx;
		.left-default {
			.u-checkbox__icon-wrap--disabled--checked {
				background-color: #f9c100;
				border-color: #f9c100;
			}
			.u-checkbox__label{
				font-size: 24rpx;
			}
		}
		.right-icons {
			display: flex;
			justify-content: end;
			.icon-box {
				display: flex;
				margin-left: 20rpx;
				align-items: center;
			}
		}
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
	border-radius: 80rpx;
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
