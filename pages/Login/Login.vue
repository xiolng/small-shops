<template>
	<view class="login-box">
		<view class="login-title">欢迎登录小店</view>
		<u-form :model="form" ref="uForm" label-width="100" label-position="top">
			<u-form-item label="手机号" prop="phone" left-icon="phone"><u-input v-model="form.phone" placeholder="请输入手机号" /></u-form-item>
			<u-form-item v-if="ispwd" label="密码" prop="password" left-icon="lock">
				<u-input v-model="form.password" placeholder="请输入密码" type="password" @confirm="submit" />
			</u-form-item>
			<u-form-item v-else label="验证码" prop="validateCode" left-icon="email">
				<u-input :border="border" placeholder="请输入验证码" v-model="form.validateCode" type="text"></u-input>
				<u-button slot="right" type="error" size="mini" @click="getCode">{{ codeTips }}</u-button>
			</u-form-item>
		</u-form>
		<u-button type="primary" :disabled="!form.phone" @click="submit" open-type="getUser">登录</u-button>
		<!-- <view class="change-login">
			<text @click="changeLogin">{{ ispwd ? '验证码登录' : '密码登录' }}</text>
		</view> -->
		<u-verification-code seconds="60" ref="uCode" @change="codeChange"></u-verification-code>
	</view>
</template>

<script>
import { mapActions } from 'vuex';
export default {
	data() {
		return {
			ispwd: false,
			form: {
				phone: '',
				password: '',
				validateCode: ''
			},
			rules: {
				phone: [
					{
						required: true,
						message: `请输入手机号`,
						trigger: ['blur']
					},
					{
						validator: (rule, value, callback) => {
							return this.$u.test.mobile(value);
						},
						message: `手机号码格式不正确`,
						trigger: ['change', 'blur']
					}
				],
				password: [
					{
						required: true,
						message: `请输入密码`,
						trigger: ['blur']
					}
				],
				validateCode: [
					{
						required: true,
						message: `请输入验证码`,
						trigger: ['blur']
					}
				]
			},
			codeTips: ''
		};
	},
	mounted() {
	},
	methods: {
		submit() {
			const vm = this;
			const userInfo = uni.getStorageSync('userInfo') || null;
			if (userInfo) {
				vm.login(vm);
				return false;
			}
			uni.getUserProfile({
				desc: `获取用户昵称、头像`,
				success(result) {
					console.log(result);
					uni.setStorageSync('userInfo', result.userInfo);
				},
				fail(err) {
					console.log('err', err);
					uni.setStorageSync('userInfo', true);
				},
				complete() {
					console.log('userInfo', uni.getStorageSync('userInfo'));
					vm.login(vm);
				}
			});
		},
		login(vm) {
			vm.$refs.uForm.validate(valid => {
				const userInfo = uni.getStorageSync('userInfo');
				delete userInfo.gender;
				delete userInfo.language;
				if (valid) {
					vm.$u.api
						.wxLogin({
							...vm.form,
							loginType: +!vm.ispwd,
							...userInfo,
							openId: uni.getStorageSync('openId')
						})
						.then(res => {
							uni.setStorageSync(`token`, `${res.data.tokenType} ${res.data.accessToken}`);
							uni.setStorageSync('userInfo', res.data.data);
							vm.$u.api.getMember().then(resd => {
								const { data, code } = resd.data;
								if (code === '200') {
									uni.setStorageSync('userInfo', data);
									vm.setUserInfoAction(data);
								}
							});
							vm.$refs.uForm.resetFields();
							vm.$u.route({
								type: 'navigateBack',
								delta: 2
							});
						});
				}
			});
		},
		...mapActions(['setUserInfoAction']),
		codeChange(text) {
			this.codeTips = text;
		},
		// 获取验证码
		getCode() {
			if(!this.$u.test.mobile(this.form.phone)){
				this.$u.toast(`请输入正确的手机号码`)
				return false
			}
			if (this.$refs.uCode.canGetCode) {
				// 模拟向后端请求验证码
				uni.showLoading({
					title: '正在获取验证码',
					mask: true
				});
				this.$u.api
					.getValidateCode({
						phone: this.form.phone
					})
					.then(res => {
						// 这里此提示会被this.start()方法中的提示覆盖
						this.$u.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
						uni.hideLoading();
					});
			} else {
				this.$u.toast('倒计时结束后再发送');
			}
		},
		changeLogin() {
			if (this.ispwd) {
				this.form.password = '';
			} else {
				this.form.validateCode = '';
			}
			this.ispwd = !this.ispwd;
		}
	},
	onReady() {
		this.$refs.uForm.setRules(this.rules);
	}
};
</script>

<style lang="scss">
.login-box {
	padding: 40rpx;
	.login-title {
		font-size: 40rpx;
		margin-bottom: 30rpx;
	}
	.change-login {
		padding: 20rpx 0;
	}
}
</style>
