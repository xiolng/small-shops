const install = (Vue, vm) => {
	vm.$u.api = {
		/********************************
		 * 登录
		 *******************************/
		login: data => vm.$u.post(`/auth/signin`, data),
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
		 getProductById: data => vm.$u.post(`/business/product/getProductById`, data),
		 // 分页查询商品
		 pageProduct: data => vm.$u.post(`/business/product/pageProduct`, data),
		/*************************************************
		 * 订单管理
		 *************************************************/
		 // 订单分页列表
		 pageOrder: data => vm.$u.post(`/business/order/pageOrder`, data),
		 // 订单详情
		 getOrderById: params => vm.$u.get(`/business/order/getOrderById`, params),
		 // 生成订单
		 generateOrder: data => vm.$u.post(`/business/order/generateOrder`, data),
		/*************************************************
		 * 购物车管理
		 *************************************************/
		 // 订单分页列表
		 pageShoppingCart: data => vm.$u.post(`/business/shoppingCart/pageShoppingCart`, data),
		 // 添加到购物车
		 addShoppingCart: data => vm.$u.post(`/business/shoppingCart/addShoppingCart`, data),
		 // 移除购物车
		 removeShoppingCart: data => vm.$u.post(`/business/shoppingCart/removeShoppingCart`, data),
	}
}
export default {
	install
}