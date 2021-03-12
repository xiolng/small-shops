<template>
	<view class="content">
		<!-- 购物车 -->
		<view class="cart u-p-20">
			<u-checkbox-group @change="changeCheckbox" :active-color="$u.color.primary">
				<view class="cart-item" :key="index" v-for="(item, index) in cartList">
					<u-row gutter="10">
						<u-col span="1"><u-checkbox v-model="item.checked" shape="circle" :name="item.productId"></u-checkbox></u-col>
						<u-col span="3"><u-image height="160rpx" :src="item.productCover" class="cart-item-cover"></u-image></u-col>
						<u-col span="8">
							<view class="cart-info">
								<view class="goods-name">
									<text>{{ item.productName }}</text>
								</view>
								<view class=""><u-tag :text="item.productIntro" mode="light" size="mini" type="info" /></view>
								<u-row class="cart-footer">
									<u-col span="6">
										<text class="price">{{ item.productPrice }}￥</text>
									</u-col>
									<u-col span="6" class="number-box">
										<u-number-box v-model="item.productNumber" @change="valChange" :index="index" :min="1" :max="100" :color="numColor"></u-number-box>
									</u-col>
								</u-row>
							</view>
						</u-col>
					</u-row>
				</view>
			</u-checkbox-group>
		</view>

		<!-- 底部框 -->
		<u-row gutter="16" class="cart-footer-tool" align-items="center">
			<u-col span="3"><u-checkbox v-model="checked" shape="circle" @change="checkAll">全选</u-checkbox></u-col>
			<u-col span="9">
				<view class="" style="text-align: right;">
					<text>
						合计:
						<text>￥{{ allPrice }}</text>
					</text>
					<u-button type="error" size="medium" style="margin:0 30rpx;">结算</u-button>
				</view>
			</u-col>
		</u-row>
	</view>
</template>

<script>
export default {
	data() {
		return {
			background: {
				backgroundImage: 'linear-gradient(45deg, rgb(42,132,255), rgb(234,175,200))'
			},
			checked: false,
			value: 1,
			numColor: this.$u.color.error,
			cartList: [
				{
					memberShoppingCartDetailId: '1',
					memberShoppingCartId: '1',
					productCover: '/static/goods/p1.jpg',
					productId: '1',
					productIntro: 'productIntro3',
					productName: '商品1',
					productNumber: 1,
					productPrice: 10,
					checked: false
				},
				{
					memberShoppingCartDetailId: '2',
					memberShoppingCartId: '2',
					productCover: '/static/goods/p1.jpg',
					productId: '2',
					productIntro: 'productIntro3',
					productName: '商品2',
					productNumber: 2,
					productPrice: 12,
					checked: false
				},
				{
					memberShoppingCartDetailId: '3',
					memberShoppingCartId: '3',
					productCover: '/static/goods/p1.jpg',
					productId: '3',
					productIntro: 'productIntro3',
					productName: '商品3',
					productNumber: 3,
					productPrice: 13,
					checked: false
				}
			]
		};
	},
	mounted() {
		console.log(this.$u.color)
	},
	methods: {
		/**
		 * 选择或取消全部
		 * @param {Object} item
		 */
		checkAll(item) {
			console.log(item);
			this.cartList.map((v, index) => {
				this.$set(this.cartList[index], 'checked', item.value);
			});
			this.checked = item.value;
		},
		/**
		 * 是否全选
		 * @param {Object} active
		 */
		changeCheckbox(active) {
			this.checked = this.cartList.length === active.length;
		},
		/**
		 * 数量改变
		 * @param {Object} e
		 */
		valChange(e) {
			console.log('当前值为: ' + e.value);
			this.cartList[e.index].productNumber = e.value;
		}
	},
	computed: {
		/**
		 * 总价格
		 */
		allPrice: {
			get: function() {
				let allPrice = 0;
				this.cartList.map(v => {
					v.checked && (allPrice += v.productNumber * v.productPrice);
				});
				return allPrice;
			}
		}
	}
};
</script>

<style lang="scss">
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #fdfdfd;
}
.cart {
	width: 100vw;
	background-color: #ffffff;

	.cart-item {
		width: 100%;
		margin-bottom: 40rpx;
		.u-col,
		.u-checkbox-group {
			height: 100%;
		}
		.cart-item-cover {
			// border: 1rpx solid #DBF1E1;
			align-items: center;
		}
		.cart-info {
			display: flex;
			flex-direction: column;
			align-items: left;
			justify-content: center;
			.goods-name {
				font-size: 36rpx;
				margin-bottom: 10rpx;
			}
			.cart-footer {
				margin-top: 10rpx;
				.number-box {
					display: flex;
					flex-direction: column;
					align-items: right;
				}
			}
		}
	}
}

.cart-footer-tool {
	width: 100vw;
	height: 100rpx;
	border: 1px solid #dcdfe6;
	padding-top: 20rpx;
	position: fixed;
	left: 0;
	bottom: 0;
}
</style>
