<template>
	<view class="shop-detail">
		<u-form :form="form" label-width="180">
			<u-form-item label="用户名"><u-input v-model="form.nickName" placeholder="请输入用户名"></u-input></u-form-item>
			<u-form-item label="头像">
				<u-upload :action="action" :file-list="fileList" max-count="1" :multiple="false" @on-error="changeImgErr" @on-success="changeImgSuccess" @on-remove="removeImg" :header="header"></u-upload>
			</u-form-item>
			<!-- <u-form-item label="真实姓名"><u-input v-model="form.realName" placeholder="请输入真实姓名"></u-input></u-form-item> -->
		</u-form>
		<view class="save-btn">
			<u-button type="primary" @click="saveShopDetail()">提交信息</u-button>
		</view>

		<u-top-tips ref="uTips" />
	</view>
</template>

<script>
	import {BASE_URL} from '@/Api/BASE_API.js'
export default {
	data() {
		return {
			BASE_URL,
			form: {
				nickName: '',
				// realName: '',
				avatarUrl: '',
			},
			// 演示地址，请勿直接使用
			action: BASE_URL + '/api/file/upload',
			fileList: [],
			header: {
				Authorization: uni.getStorageSync('token')
			}
		};
	},
	mounted() {
		this.getShopDetail();
	},
	methods: {
		getShopDetail() {
			this.$u.api.getMember().then(res => {
				Object.keys(this.form).map(v => {
					this.form[v] = res.data.data[v]
				})
				this.fileList = res.data.data.avatarUrl && [{url: `${BASE_URL}/files/${res.data.data.avatarUrl}`}]
			});
		},
		saveShopDetail() {
			this.$u.api.updateMember({
				...this.form,
				tenantMemberId: uni.getStorageSync('userInfo').tenantMemberId
			}).then(res => {
				if (res.data.code === '200') {
					this.$refs.uTips.show({
						title: '保存成功',
						type: 'primary'
					});
					setTimeout(() => {
						this.$u.route({
							type: 'reLaunch',
							url: '/pages/My/My'
						});
					}, 1500);
				}
			});
		},
		/**
		 * 上传图片失败
		 * @param {Object} res
		 * @param {Object} index
		 * @param {Object} lists
		 * @param {Object} name
		 */
		changeImgErr(res, index, lists, name) {
			if (res.status === 403) {
				this.$refs.uTips.show({
					title: '登录超时，请重新登录',
					type: 'error'
				});
				setTimeout(() => {
					this.$u.route({
						url: '/pages/Login/Login'
					});
				}, 2000);
			}
		},
		/**
		 * 上传图片成功
		 * @param {Object} data
		 * @param {Object} index
		 * @param {Object} lists
		 * @param {Object} name
		 */
		changeImgSuccess(data, index, lists, name) {
			if (data.code === '200') {
				this.form.avatarUrl = data.data;
			}
		},
		/**
		 * @param {Object} index
		 * @param {Object} lists
		 * @param {Object} name
		 */
		removeImg(index, lists, name){
			console.log(index, lists, name)
			this.form.avatarUrl = ''
		}
	}
};
</script>

<style lang="scss">
.shop-detail {
	padding: 40rpx;
	.save-btn{
		margin-top: 40rpx;
	}
}
</style>
