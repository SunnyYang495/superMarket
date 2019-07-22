<template>
	<view class="footer flexBox">
		<view class="footerMenu" v-for="(item,index) in footerList" :key="index" :class="[{tapColor:item.isTap}]" @tap="gotoPage(item.page)" >
			<view><span class="iconfont" v-bind:class="item.icon"></span></view>
			<text>{{item.menuName}}</text>
		</view>
		<view class="cartCount">{{goodsCount}}</view>
	</view>
</template>

<script>
	export default{
		name:'commFooter',
		props:['tapIndex'],
		data(){
			return {
				footerList:[
					{
						icon:"icon-homepage",
						menuName:'首页',
						isTap:false,
						page:'../../pages/main/main'
					},
					{
						icon:"icon-gouwuche",
						menuName:'购物车',
						isTap:false,
						page:'../../pages/cart/cart'
					},
					{
						icon:"icon-people",
						menuName:'我的',
						isTap:false,
						page:'../../pages/my/my'
					}
				],
				goodsCount:0
			}
		},
		methods:{
			gotoPage:function(page){
				uni.navigateTo({
					url:page
				});
			}
		},
		mounted() {
			this.goodsCount=this.$store.state.cartsNum;
			this.footerList[this.$props.tapIndex].isTap=true;
			let userId=uni.getStorageSync("userId");
			let token=uni.getStorageSync("token");
			let shopCode=uni.getStorageSync("shopCode");
			let postData={
				userId:userId,
				shopCode:shopCode,
				token:token
			};
			this.common.commonPost({
				url:this.commonConfig.controllerPath+"/Cart/GetCartCount",
				data:postData,
				success:res=>{
					if(res.data.state=="success"){
						this.goodsCount=res.data.data.GoodsCount;
						this.$store.commit("changeCartsNum",res.data.data.GoodsCount);
					}else{
						this.common.errorBox("网络错误，请稍后重试");
					}
				}
			});
		}
	}
</script>

<style>
	.footer{
		width:100%;
		height: 60px;
		background: #fff;
		position:fixed;
		bottom:0;
		left:0;
		border-top:1px solid #eee;
	}
	.footer span{
		height: 35px;
		line-height: 35px;
		font-size:50upx;
	}
	.footerMenu{
		box-sizing: border-box;
		width:33.3333333%;
		text-align: center;
		font-size: 28upx;
	}
	.tapColor{
		color:#3AA7F8;
	}
	.cartCount{
		width:50upx;
		height: 40upx;
		background: red;
		color:#fff;
		position: absolute;
		left:55%;
		top:-10upx;
		border-radius:50%;
		font-size: 18upx;
		text-align: center;
		line-height: 40upx;
	}
</style>
