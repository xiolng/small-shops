import Vue from 'vue';
export const isLogin = () => {
	const token = uni.getStorageSync('token')
	if (!token) {
		goLogin()
		return false
	}
	return true
}

export const goLogin = () => {
	uni.login({
		success(result) {
			console.log('result', result)
			if (result.code) {
				Vue.prototype.$u.api.wxCode({
					code: result.code
				}).then(res => {
					console.log('res', res)
					const {
						code,
						data,
						msg
					} = res.data
					if (code === '200') {
						if (data.type === '1') {
							uni.setStorageSync('token', 'Bearer ' + data.result)
							Vue.prototype.$u.api.getMember().then(user => {
								uni.setStorageSync('userInfo', user.data.data)
								Vue.prototype.$store.dispatch('setUserInfoAction', user.data
									.data)
									console.log('aaaaaaaaaaaaa', uni.getCurrentPages)
									uni.navigateBack({
										delta: 0
									})
							})
						} else {
							console.log('openId', data.result)
							uni.setStorageSync('openId', data.result)
							uni.navigateTo({
								url: '/pages/Login/Login'
							})
						}
						uni.reLaunch({
							url: `/pages/ToIndex/ToIndex`
						})
					} else {
						uni.showModal({
							title: '登录错误',
							content: msg,
							showCancel: false,
							success(res) {
								// res.confirm && uni.navigateTo({
								// 	url: `/pages/Login/Login`
								// })
							}
						})
					}
				})
			}
		}
	})
}
/**
 * 菜单平级，组合成树结构
 * @param data
 * @returns {[]}
 */
export const treeMenu = (data, id) => {
  console.log(222, id, data)
  const result = []
  if (!Array.isArray(data)) {
    return result
  }
  data.forEach(item => {
    delete item.children
  })
  const map = {}
  data.forEach(item => {
    map[item[id]] = item
  })
  data.forEach(item => {
    item.key = item[id]
    item.value = item[id]
    item.title = item.categoryName
    item.icon = item.categoryIcon
    const parentId = map[item.parentId]
    if (parentId) {
      (parentId.children || (parentId.children = [])).push(item)
    } else {
      result.push(item)
    }
  })
  console.log(result, 111)
  return result
}