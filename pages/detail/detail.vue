<template>
	<view>
		<view class="slider">
			<swiper class="swiper" :indicator-dots="indicatorDots"  :interval="interval" :duration="duration">
				<swiper-item  v-for="(item,index) in goodsCover" :key="index">
					<view class="swiper-item uni-bg-red">
						<img v-bind:src=item />
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="goodsInfo">
			<view class="goodsName">{{goodsInfo.Goods_name}}</view>
			<view class="spec commMargin">规格:{{goodsInfo.Goods_standard}}</view>
			<view class="commMargin">￥:{{goodsInfo.Goods_price}}</view>
			<view class="commMargin">单位:{{goodsInfo.Goods_unit}}</view>
			<view class="margin5 flexBox">
				<view class="miniAmount">
					起送价:￥0.0
				</view>
				<view>
					销量:{{goodsInfo.Sale_count}}
				</view>
			</view>
		</view>
		<view class="footer flexBox">
			<view class="blackMenu" @tap="gotoHome">
				<view><span class="icon iconfont"></span></view>
				<text>首页</text>
			</view>
			<view class="blackMenu" @tap="addCollection"  v-bind:class="[{ collected: isCollected }]">
				<view><span class="icon iconfont"></span></view>
				<text>收藏</text>
			</view>
			<view class="blackMenu" @tap="gotoCart">
				<view><span class="icon iconfont"></span></view>
				<text>购物车</text>
			</view>
			<view class="addCart" @tap="addCart">加入购物车</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				goodsCover:[],
				goodsInfo:{},
				indicatorDots: true,
				interval: 2000,
				duration: 500,
				isCollected:false
			}
		},
		methods:{
			addCart:function(){
				let userid=uni.getStorageSync('userId');
				let token=uni.getStorageSync("token");
				let shopName=uni.getStorageSync("shopName");
				let cartData={
					user_id:userid,
					shop_code:this.goodsInfo.Shop_code,
					shop_name:shopName,
					goods_num:this.goodsInfo.Goods_num,
					goods_count:1
				}
				let postData={
					token:token,
					cart:cartData
				}
				this.common.commonPost({
					url:this.commonConfig.controllerPath+"/Cart/AddGoodsInCart",
					data:postData,
					success:res=>{
						if(res.data.state=="success"){
							this.common.errorBox("添加购物车成功");
						}else{
							this.common.errorBox("添加失败，请重试");
						}
					}
				});
			},
			gotoCart:()=>{
				uni.navigateTo({
					url: '../cart/cart'
				});
			},
			addCollection:function(){
				
				let userid=uni.getStorageSync('userId');
				let token=uni.getStorageSync("token");
				let collData={
					User_code:userid,
					Collection_type:1,
					Shop_code:this.goodsInfo.Shop_code,
					Goods_id:this.goodsInfo.Goods_id,
				}
				let postData={
					info:collData,
					token:token
				}
				this.common.commonPost({
					url:this.commonConfig.controllerPath+"/UserCollection/AddUserCollection",
					data:postData,
					success:res=>{
						if(res.data.state=="success"){
							this.common.errorBox("收藏成功");
							this.isCollected=true;
						}else{
							this.common.errorBox("收藏失败");
						}
					}
				});
			},
			gotoHome:()=>{
				uni.navigateTo({
					url: '../main/main'
				});
			}
		},
		onLoad(options){
			let _this=this;
			let postData={
				goodsId:options.goodsId
			}
			_this.common.commonGet({
				url:_this.commonConfig.controllerPath+"/GoodsInfo/GetGoodsInfoById",
				data:postData,
				success:function(res){
					if(res.data.state=="success"){
						_this.goodsCover.push(_this.commonConfig.goodsPic+res.data.data.Cover_img);
						_this.goodsInfo=res.data.data;
						
					}
					
				}
			})
		}
	}
</script>

<style>
	.swiper{
		height: 500upx;
	}
	.swiper-item img{
		width:100%;
	}
	.goodsInfo{
		padding:10px;
		color:#ABABAB;
		font-size: 28upx;
	}
	.goodsName{
		color:#000000;
		padding:10px 0 15px;
		font-weight: bold;
	}
	.commMargin{
		margin:10px 0;
	}
	.margin5{
		margin:15px 0 10px;
	}
	.footer{
		position:fixed;
		left: 0;
		bottom:0;
		width:100%;
		height: 60px;
		font-size:30upx;
		text-align: center;
		color: #fff;
	}
	.blackMenu{
		width:20%;
		background: #888888;
		font-size:24upx;
	}
	.blackMenu span{
		height: 33px;
		line-height: 35px;
		font-size:50upx;
	}
	.addCart{
		width:40%;
		background: #f6770f;
		line-height: 60px;
	}
	.collected{
		color:#F6770F;
	}
</style>
