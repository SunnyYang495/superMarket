<template>
	<view class="goodsList">
		<view class="flexBox">
			<view class="sort" :class="[{sortClicked:isSortByCount}]" @tap="orderByCount">默认</view>
			<view class="sort" :class="[{sortClicked:!isSortByCount}]">价格 <span class="iconfont" :class="[isSortDesc ? 'icon-unfold' : 'icon-packup' ]" @tap="orderByPrice"></span></view>
		</view>
		<view class="goods flexBox" v-for="(item,index) in goodsList" :key="index" @tap="gotoDetail(index)">
			<view class="goodsImg">
				<img :src="item.cover">
			</view>
			<view class="goodsInfo">
				<view class="goodsName">{{item.Goods_name}}</view>
				<view class="price">￥{{item.Goods_price}}</view>
				<view class="saleCount">销量:{{item.Sale_count}}</view>
			</view>
			<view class="addCart" @click.stop="addCart(index)">
				<span class="iconfont icon-gouwuche"></span>
			</view>
		</view>
		<view class="loadMore" v-show="isLoad" @tap="loadMoreGoods">加载更多...</view>
	</view>
</template>

<script>
	export default{
		name:'goodsList',
		props:['goodsList','isSortByCount','isSortDesc','isLoad'],
		methods:{
			orderByCount:function(){
				this.$emit("pOrderByCount");
			},
			orderByPrice:function(){
				this.$emit("pOrderByPrice");
			},
			loadMoreGoods:function(){
				this.$emit("pLoadMoreGoods");
			},
			gotoDetail:function(index){
				uni.navigateTo({
					url:'../../pages/detail/detail?goodsId='+this.$props.goodsList[index].Id
				})
			},
			addCart:function(index){
				//event.stopPropagation();
				let userid=uni.getStorageSync('userId');
				let token=uni.getStorageSync("token");
				let shopName=uni.getStorageSync("shopName");
				let cartData={
					user_id:userid,
					shop_code:this.$props.goodsList[index].Shop_code,
					shop_name:shopName,
					goods_num:this.$props.goodsList[index].Goods_num,
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
						//console.log(res);
						if(res.data.state=="success"){
							uni.showToast({
								title: '添加购物车成功',
								duration: 2000,
								icon:"none"
							});
						}else{
							uni.showToast({
								title: '添加失败，请重试',
								duration: 2000,
								icon:"none"
							});
						}
					}
				});
			}
		}
	}
</script>

<style>
	.goods{
		padding:10px;
		justify-content:flex-start;
		height:200upx;
		overflow: hidden;
		border-bottom:1px solid #eee;
		position:relative;
	}
	.goodsImg{
		width:30%;
		height:200upx;
		overflow: hidden;
	}
	.goodsImg img{
		width:100%;
		min-height: 220upx;
		max-height: 240upx;
	}
	.goodsInfo{
		width:70%;
		padding-left: 10px;
		font-size: 28upx;
		box-sizing: border-box;
	}
	.saleCount{
		color:#ABABAB;
		font-size: 26upx;
	}
	.addCart{
		position:absolute;
		right: 10px;
		bottom:10px;
		width:50upx;
		height: 50upx;
		border-radius: 50%;
		background: red;
		color:#fff;
		line-height: 50upx;
		text-align: center;
		font-weight: bold;
	}
	.sort{
		width:50%;
		border-bottom:2px solid #eaeaea;
		height: 60upx;
		line-height: 60upx;
		text-align: center;
	}
	.sortClicked{
		color:#3AA7F8;
		border-bottom:2px solid #3AA7F8;
	}
	.loadMore{
		height: 80upx;
		line-height: 80upx;
		text-align:center;
	}
</style>
