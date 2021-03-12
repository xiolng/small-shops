<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
			this.$u.color = {
				...this.$u.color,
				primary: "#f60",
				primaryDark: "#e46007",
				primaryDisabled: "#d99465",
				primaryLight: "#f4a16a"
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	/*每个页面公共css */
</style>
