<template>
	<view class="mainBox">
		<view class="searchBox flexBox"  >
			<view class="switchShop" @tap="switchShop"><text>[切换超市]</text></view>
			<view class="searchText" @tap="gotoSearch">
				<span class="iconfont icon-search"></span>
				<text>搜索超市商品</text>
			</view>
		</view>
		<view class="slider">
			<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item  v-for="(item,index) in sliderList" :key="index">
					<view class="swiper-item uni-bg-red">
						<img v-bind:src="item.Adv_img" />
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="categoryList flexBox">
			<view class="category" @tap="gotoCategory">
				<view class=""><span class="iconfont icon-other allCate"></span></view>
				<text>全部</text>
			</view>
			<view class="category" v-for="(item,index) in cateList" :key="index" @tap="gotoGoodsList(index)">
				<view class="cateImg"><img v-bind:src="item.Cover_img" /></view>
				<text>{{item.Category_name}}</text>
			</view>
		</view>
		<view class="hotGoods">
			<view class="goodsTitle">热销商品</view>
			<view class="goodsList flexBox">
				<view class="goods" v-for="(item,index) in goodsList" :key="index" @tap="goodsTap(index)">
					<view class="goodsImg"><img v-bind:src="item.Cover_img "/></view>
					<text class="textOver">{{item.Goods_name}}</text>
				</view>
			</view>
		</view>
		<commFooter :tapIndex="0"></commFooter>
	</view>
</template>

<script>
	import commFooter from '../../components/commFooter/commFooter'
	export default{
		data(){
			return{
				sliderList:[],
				cateList:[],
				goodsList:[],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500
				
			}
		},
		mounted:function(){
			let shopCode=uni.getStorageSync("shopCode");
			let _this=this;
			let postData={
				shopNum:shopCode
			}
			let catePostData={
				shopCode:shopCode
			}
			let shopName=uni.getStorageSync("shopName");
			//设置页面title
			uni.setNavigationBarTitle({
			　　title:shopName
			});
			//获取轮播图片
			_this.common.commonGet({
				url:_this.commonConfig.controllerPath+"/Adv/GetAdvList",
				data:postData,
				success:function(res){
					if(res.data.state=="success"){
						//_this.sliderList=
						res.data.data.forEach((item)=>{
							return item.Adv_img=_this.commonConfig.advPic+item.Adv_img;
						})
						_this.sliderList=res.data.data;
					}
					
				}
			});
			//获取一级分类
			this.common.commonGet({
				url:this.commonConfig.controllerPath+"/Category/GetOneCategoryList",
				data:catePostData,
				success:res=>{
					if(res.data.state=="success"){
						res.data.data.forEach((item)=>{
							return item.Cover_img=_this.commonConfig.categoryPic+item.Cover_img;
						})
						if(res.data.data.length<10){
							this.cateList=res.data.data;
						}else{
								
							for(let i=0;i<9;i++){
								this.cateList.push(res.data.data[i]);
							}
						}
						
					}
				}
			});
			//获取热销商品
			_this.common.commonGet({
				url:_this.commonConfig.controllerPath+"/GoodsInfo/GetHotGoods",
				data:catePostData,
				success:function(res){
					if(res.data.state=="success"){
						res.data.data.forEach((item)=>{
							return item.Cover_img=_this.commonConfig.goodsPic+item.Cover_img;
						})
						_this.goodsList=res.data.data;
					}
				}
			});
		},
		methods:{
			goodsTap:function(index){
				let goodsId=this.goodsList[index].Id;
				uni.navigateTo({
					url:"../detail/detail?goodsId="+goodsId
				});
			},
			gotoCategory:function(){
				uni.navigateTo({
					url:"../category/category"
				});
			},
			gotoGoodsList:function(index){
				uni.navigateTo({
					url:"../goods/goods?CategoryId="+this.cateList[index].Category_id
				});
			},
			gotoSearch:function(){
				uni.navigateTo({
					url:"../search/search"
				})
			},
			switchShop:function(){
				uni.navigateTo({
					url:"../selectArea/selectArea"
				})
			}
		},
		components:{
			commFooter
		}
	}
</script>

<style>
	.mainBox{
		background:#eee;
	}
	.searchBox{
		width:100%;
		height:40px;
		line-height: 40px;
		color:#ababab;
		font-size: 28upx;
		text-align: center;
		position:fixed;
		left:0;
		top:0;
		background:#fff;
		z-index:99;
		padding:0 10px;
	}
	.switchShop{
		width:25%;
		
	}
	.searchText{
		width:75%;
		background: #EAEAEA;
	}
	.slider{
		margin-top:40px;
	}
	.allCate{
		font-size: 102upx;
	}
	.categoryList{
		margin:10px 0;
	}
	.category{
		padding:5px;
		width:20%;
		font-size:20upx;
		background:#fff;
		box-sizing:border-box;
		text-align:center;
	}
	.cateImg{
		height: 110upx;
		line-height: 110upx;
	}
	.category img{
		width:80%;
		height: 100upx;
	}
	.hotGoods{
		padding:10px;
		background:#fff;
		margin-bottom: 70px ;
	}
	.goodsTitle{
		font-size:30upx;
	}
	.goods{
		box-sizing: border-box;
		width:50%;
		padding:5px;
		font-size: 24upx;
		text-align: center;
	}
	.goodsImg{
		height: 280upx;
		overflow: hidden;
		line-height: 280upx;
		margin-bottom: 5px;
	}
	.goods img{
		width:100%;
	}
	.tapColor{
		color:#3AA7F8;
	}
</style>
