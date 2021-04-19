<template>
	<view class="login-box">
		<view class="login-title">欢迎登录商家管理系统</view>
		<u-form :model="form" ref="uForm" label-width="100" label-position="top">
			<u-form-item label="手机号" prop="phone" left-icon="phone"><u-input v-model="form.phone" placeholder="请输入手机号" /></u-form-item>
			<u-form-item v-if="ispwd" label="密码" prop="password" left-icon="lock">
				<u-input v-model="form.password" placeholder="请输入密码" type="password" @confirm="submit" />
			</u-form-item>
			<u-form-item v-else label="验证码" prop="validate" left-icon="email">
				<u-input :border="border" placeholder="请输入验证码" v-model="form.validate" type="text"></u-input>
				<u-button slot="right" type="error" size="mini" @click="getCode">{{ codeTips }}</u-button>
			</u-form-item>
		</u-form>
		<u-button type="primary" :disabled="!form.phone" @click="submit">提交</u-button>
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
				validate: ''
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
				validate: [
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
		const token = uni.getStorageSync('token');
		if (token) {
			this.$u.route({
				type: 'navigateBack',
				delta: 2
			});
		}
	},
	methods: {
		submit() {
			this.$refs.uForm.validate(valid => {
				const userInfo = uni.getStorageSync('userInfo');
				delete userInfo.gender;
				delete userInfo.language;
				if (valid) {
					this.$u.api
						.wxLogin({
							...this.form,
							loginType: +!this.ispwd,
							...userInfo,
							openId: uni.getStorageSync('openId')
						})
						.then(res => {
							uni.setStorageSync(`token`, `${res.data.tokenType} ${res.data.accessToken}`);
							uni.setStorageSync('userInfo', res.data.data);
							this.$u.api.getMember().then(resd => {
								const { data, code } = resd.data;
								if (code === '200') {
									uni.setStorageSync('userInfo', data);
									this.setUserInfoAction(data);
								}
							});
							this.$refs.uForm.resetFields();
							this.$u.route({
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
			if (this.$refs.uCode.canGetCode) {
				// 模拟向后端请求验证码
				uni.showLoading({
					title: '正在获取验证码',
					mask: true
				});
				setTimeout(() => {
					uni.hideLoading();
					// 这里此提示会被this.start()方法中的提示覆盖
					this.$u.toast('验证码已发送');
					// 通知验证码组件内部开始倒计时
					this.$refs.uCode.start();
				}, 2000);
			} else {
				this.$u.toast('倒计时结束后再发送');
			}
		},
		changeLogin() {
			if (this.ispwd) {
				this.form.password = '';
			} else {
				this.form.validate = '';
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
