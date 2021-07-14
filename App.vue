<script>
import { mapActions } from 'vuex';
export default {
	onLaunch: function() {
		console.log('App Launch');
		this.$u.color = {
			...this.$u.color,
			primary: '#f60',
			primaryDark: '#e46007',
			primaryDisabled: '#d99465',
			primaryLight: '#f4a16a'
		};
		const token = uni.getStorageSync('token');
		if (token) {
			token &&
				this.$u.api.getMember().then(res => {
					if (res.data.code === '200') {
						uni.setStorageSync('userInfo', res.data.data);
						this.setUserInfoAction(res.data.data);
						console.log(this);
					}
				});
		}
	},
	methods: {
		...mapActions(['setUserInfoAction'])
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
/*每个页面公共css */
</style>
