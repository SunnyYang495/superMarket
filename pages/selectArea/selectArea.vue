<template>
	<view class="inputView">
		<view class="provinces">
			<view>请选择所在省</view>
			<view class="provinceList list">
				<block v-for="(item,index) in proList" :key="index">
				    <button class="province" @tap="provinceTap(index)">{{item.Areaname}}</button>
				</block>
			</view>
		</view>
		<view>
			<view>
				请选择所在市
			</view>
			<view class="cityList list">
				<block v-for="(item,index) in cityList" :key="index">
				    <button class="city" @tap="cityTap(index)">{{item.Areaname}}</button>
				</block>
			</view>
		</view>
		<view>
			<view>
				请选择所在区
			</view>
			<view class="areaList list">
				<block v-for="(item,index) in areaList" :key="index">
				    <button class="area" @tap="areaTap(index)">{{item.Areaname}}</button>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '../../store'
	export default{
		data(){
			return {
				proList:[],
				cityList:[],
				areaList:[],
				isFromAddr:false  //是否从地址页面跳过来
			}
		},
		store,
		onLoad:function(options) {
			if(options.fromAddr){
				this.isFromAddr=true;
			}
			let _this=this;
			_this.common.commonRequest({
				url:this.commonConfig.controllerPath+"/Area/FindProvinceList",
				method:"GET",
			}).then(function(data){
				uni.hideLoading();	
				if(data[1]&&data[1]!==null){
					_this.proList=data[1].data.data;
				}
			});	
		},
		methods:{
			provinceTap:function(index){
				if(this.isFromAddr){
					this.$store.commit("changeAddrProvince",this.proList[index]);
				}
				let _this=this;
				var postData={
					pId:this.proList[index].Areaid
				};
				this.common.commonRequest({
					url:this.commonConfig.controllerPath+"/Area/FindAreaList",
					data:postData,
					method:"GET",
				}).then(function(data){
					uni.hideLoading();	
					if(data[1]&&data[1]!==null){
						_this.cityList=data[1].data.data;
					}
				});
			},
			cityTap:function(index){
				if(this.isFromAddr){
					this.$store.commit("changeAddrCity",this.cityList[index]);
				}
				let _this=this;
				var postData={
					pId:this.cityList[index].Areaid
				};
				this.common.commonRequest({
					url:this.commonConfig.controllerPath+"/Area/FindAreaList",
					data:postData,
					method:"GET",
				}).then(function(data){
					uni.hideLoading();	
					if(data[1]&&data[1]!==null){
						_this.areaList=data[1].data.data;
					}
				});
			},
			areaTap:function(index){
				this.$store.commit('changeAreaId', this.areaList[index].Areaid);
				if(this.isFromAddr){
					this.$store.commit("changeAddrArea",this.areaList[index]);
					uni.navigateTo({
						url: './villageList?fromAddr=1'
					});
				}else{
					uni.navigateTo({
						url: './villageList'
					});
				}
			}
		}
	}
</script>

<style>
	.list{
		display: flex;
		flex-flow: row wrap;
		justify-content: flex-start;
	}
	/* .list:after{
		content: "";
		flex: auto;
	} */
	.list button{
		font-size: 28upx;
		/* margin-right:10px; */
		margin-top:10px;
		/* box-sizing: border-box;
		flex: 0 0 25%; */
		
	}
</style>
