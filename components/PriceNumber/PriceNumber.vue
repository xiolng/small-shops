<template>
	<view>
		<view v-if="priceVal">
			<u-number-box :value="priceVal" @change="valChange" :color="numColor"></u-number-box>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		price: String | Number,
		default: 0
	},
	data() {
		return {
			numColor: this.$u.color.error,
			priceVal: 0
		};
	},
	mounted() {
		this.priceVal = this.price
	},
	methods: {
		valChange(e){
			console.log(e)
			this.$emit('getPrice', e.value)
		}
	},
	watch:{
		price: function(val) {
			console.log('asaaasas', val)
			this.priceVal = 0
			this.$nextTick(function(){
				this.priceVal = val
			})
		}
	}
};
</script>

<style></style>
