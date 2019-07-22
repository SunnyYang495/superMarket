<template>
	<view class="inputView">
		<view>请选择小区</view>
		<view class="villageList">
			<block v-for="(item,index) in viList" :key="index">
				<button @tap="villageTap(index)">{{item.Village_name}}</button>
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
				viList:[],
				areaId:this.$store.state.currentAreaId,
				isFromAddr:false   //是否修改或新增地址过程
			}
		},
		onLoad:function(options){
			if(options.fromAddr){
				this.isFromAddr=true;
			}
			let postData={
				cId:this.areaId,
			}
			let _this=this;
			_this.common.commonRequest({
				url:_this.commonConfig.controllerPath+"/Village/FindVillageList",
				data:postData,
				method:"GET"
			}).then(function(data){
				uni.hideLoading();
				if(data[1]!==null){
					if(data[1]&&data[1].data.state=="success"){
						_this.viList=data[1].data.data;
					}else{
						_this.common.errorBox(data[1].data.Message);
					}
				}else{
					_this.common.errorBox("网络错误，请稍后重试");
				}
			});
		},
		methods:{
			villageTap:function(index){
				if(this.isFromAddr){
					this.$store.commit("changeAddrVillage",this.viList[index]);
					uni.navigateTo({
						url: '../addr/addr?showForm=1'
					});
				}else{
					this.$store.commit("changeVid",this.viList[index].Id);
					uni.navigateTo({
						url: './shopList'
					});
				}
				
			}
		}
	}
</script>

<style>
.villageList button{
	margin-top:10px;
}
</style>
