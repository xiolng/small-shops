const install = (Vue, vm) => {
	vm.$u.api = {
		/********************************
		 * 登录
		 *******************************/
		login: data => vm.$u.post(`/auth/signin`, data),
		wxCode: params => vm.$u.get(`/system/login/${uni.getAccountInfoSync().miniProgram.appId}/getOpenId/`,
			params),
		wxLogin: data => vm.$u.post(`/system/login/${uni.getAccountInfoSync().miniProgram.appId}/signin`, data),
		getValidateCode: params => vm.$u.get(`/system/login/{appid}/getValidateCode`, params),
		/********************************
		 * 商铺
		 ********************************/
		// 商铺详情
		getShop: params => vm.$u.get(`/business/shop/getShop`, params),
		/***********************************************
		 * 商品分类管理
		 ***********************************************/
		// 商品分类列表
		listProductCategory: params => vm.$u.get(`/business/productCategory/listProductCategory`, params),
		/*************************************************
		 * 商品管理
		 *************************************************/
		// 按id查询商品
		getProductById: params => vm.$u.get(`/business/product/getProductById`, params),
		// 分页查询商品
		pageProduct: data => vm.$u.post(`/business/product/pageProduct`, data),
		// 查询热卖商品
		getBaseShell: params => vm.$u.get(`/business/product/getBaseShell`, params),
		// 分享跳转解密
		getShareParam: params => vm.$u.get(`/business/share/getShareParam`, params),
		/*************************************************
		 * 订单管理
		 *************************************************/
		// 订单分页列表
		pageOrder: data => vm.$u.post(`/business/order/pageOrder`, data),
		// 订单详情
		getOrderById: params => vm.$u.get(`/business/order/getOrderById`, params),
		// 生成订单
		generateOrder: data => vm.$u.post(`/business/order/generateOrder`, data),
		// 支付
		pay: params => vm.$u.get(`/business/product/pay`, params),
		// 支付回调-微信使用
		// notify: data => vm.$u.post(`/business/product/notify`, data),
		// 支付回调-前端使用
		prePayNotify: params => vm.$u.get(`/business/product/prePayNotify`, params),
		// 支付回调-前端使用
		getPayStatus: params => vm.$u.get(`/business/product/getPayStatus`, params),
		// 取消订单
		cancelOrder: params => vm.$u.get(`/business/order/cancelOrder`, params),
		/*************************************************
		 * 购物车管理
		 *************************************************/
		// 订单分页列表
		pageShoppingCart: data => vm.$u.post(`/business/shoppingCart/pageShoppingCart`, data),
		// 添加到购物车
		addShoppingCart: data => vm.$u.post(`/business/shoppingCart/addShoppingCart`, data),
		// 移除购物车
		removeShoppingCart: data => vm.$u.get(`/business/shoppingCart/removeShoppingCart`, data),
		// 清空购物车
		clearShoppingCart: params => vm.$u.get(`/business/shoppingCart/clearShoppingCart`, params),
		/*************************************************
		 * 我的
		 *************************************************/
		// 忘记密码
		forgotPassword: data => vm.$u.post(`/business/member/forgotPassword`, data),
		// 忘记密码获取验证码
		forgotPasswordCode: params => vm.$u.get(`/business/member/forgotPasswordCode`, params),
		// 获取会员信息
		getMember: params => vm.$u.get(`/business/member/getMember`, params),
		// 修改密码
		modifyPassword: data => vm.$u.post(`/business/member/modifyPassword`, data),
		// 更新会员信息
		updateMember: data => vm.$u.post(`/business/member/updateMember`, data),
		// 删除地址
		deleteMemberReceive: params => vm.$u.get(`/business/memberReceive/deleteMemberReceive`, params),
		// 获取默认收货地址
		getDefaultMemberReceive: params => vm.$u.get(`/business/memberReceive/getDefaultMemberReceive`, params),
		// 查询收货地址
		getMemberReceiveById: params => vm.$u.get(`/business/memberReceive/getMemberReceiveById`, params),
		// 分页查询收货地址
		pageMemberReceive: data => vm.$u.post(`/business/memberReceive/pageMemberReceive`, data),
		// 保存收货地址
		saveMemberReceive: data => vm.$u.post(`/business/memberReceive/saveMemberReceive`, data),
		// 设置默认收货地址
		setDefaultMemeberReceive: params => vm.$u.get(`/business/memberReceive/setDefaultMemeberReceive`,
			params),
		// 更新收货地址
		updateMemberReceive: data => vm.$u.post(`/business/memberReceive/updateMemberReceive`, data),
		// 提交意见反馈
		saveSystemIdea: data => vm.$u.post(`/business/systemIdea/saveSystemIdea`, data),
	}
}
export default {
	install
}
