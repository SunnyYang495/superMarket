<template>
	<view class="inputView">
		<view>请选择超市</view>
		<view class="shopList">
			<block v-for="(item,index) in shopList" :key="index">
				<button @tap="shopTap(index)">{{item.Shop_name}}</button>
			</block>
		</view>
	</view>
</template>

<script>
	import store from '../../store'
	export default{
		store,
		data(){
			return {
				vId:this.$store.state.vId,
				shopList:[]
			}
		},
		mounted:function(){
			let postData={
				vId:this.vId
			};
			let _this=this;
			_this.common.commonRequest({
				url:_this.commonConfig.controllerPath+"/ShopInfo/GetShopListByVillage",
				method:"GET",
				data:postData
			}).then(function(data){
				uni.hideLoading();
				if(data[0]===null){
					if(data[1].data.state=="success"){
						_this.shopList=data[1].data.data
					}else{
						_this.common.errorBox(data[1].data.message);
					}
				}else{
					_this.common.errorBox("网络错误，请稍后重试");
				}
			});
		},
		methods:{
			shopTap:function(index){
				uni.showModal({
					title: '提示',
					content: '确定选择此超市为默认超市',
					success:(res) => {
						if(res.confirm){
							const token=uni.getStorageSync('token');
							const postData={
								shopCode:this.shopList[index].Shop_code,
								token:token
							};
							let self=this;
							self.common.commonRequest({
								url:self.commonConfig.controllerPath+'/UserInfo/UpdateDefaultShop',
								method:'POST',
								data:postData
							}).then(function(data){
								uni.hideLoading();
								if(data[0]===null){
									if(data[1].data.state=="success"){
										uni.setStorageSync('shopCode', self.shopList[index].Shop_code);
										uni.setStorageSync('shopName', self.shopList[index].Shop_name);
										uni.navigateTo({
											url: '../main/main'
										});
									}else{
										self.common.errorBox(data[1].data.message);
									}
								}else{
									self.common.errorBox("网络错误，请稍后重试");
								}
							});
						}
					}
				})
				
			}
		}
	}
</script>

<style>
	.shopList button{
		margin-top:10px;
	}
</style>
