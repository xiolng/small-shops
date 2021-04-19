import Vue from 'vue'
import App from './App'
import store from 'store/index.js'

import ShopTitle from '@/components/ShopTitle/ShopTitle'

import uView from 'uview-ui';

import httpInterceprot from '@/Api/http.interceptor.js'
import httpApi from '@/Api/http.api.js'



Vue.component('shop-title', ShopTitle)
Vue.use(uView);
Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})

Vue.use(httpInterceprot, app)
Vue.use(httpApi, app)
app.$mount()
