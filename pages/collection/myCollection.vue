<template>
	<view class="goodsList">
		<view class="goods flexBox" v-for="(item,index) in goodsList" :key="index" @tap="gotoDetail(index)">
			<view class="goodsImg">
				<img :src="item.cover">
			</view>
			<view class="goodsInfo">
				<view class="goodsName">{{item.Goods_name}}</view>
				<view class="price">￥{{item.Goods_price}}</view>
				<view class="saleCount">销量:{{item.Sale_count}}</view>
			</view>
			<view class="addCart" @click.stop="cancelCollect(index)">
				<span class="iconfont icon-trash"></span>
			</view>
		</view>
		<view class="loadMore" v-show="isLoad" @tap="loadMoreGoods">加载更多...</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				goodsList:[],
				isLoad:false,
				currentPage:1,
				totalPage:0,
				pageSize:10
			}
		},
		methods:{
			getCollectionList:function(page){
				if(page==1){
					this.goodsList=[];
				}
				let userId=uni.getStorageSync("userId");
				let shopCode=uni.getStorageSync("shopCode");
				let token=uni.getStorageSync("token");
				let queryJson={
					"userId": userId,
					"state": "1",
					"shopCode": shopCode
				}
				let postData={
					"queryJson":queryJson,
					"token": token,
					"pagin": {
						"rows": this.pageSize,
						"sord": "asc",
						"total": "0",
						"sidx": "Create_time",
						"page": page,
						"records": "0"
					}
				};
				this.common.commonPost({
					url:this.commonConfig.controllerPath+"/UserCollection/GetUserCollectionList",
					data:postData,
					success:res=>{
						if(res.data.state=="success"){
							
							res.data.data.rows.forEach(item=>{
								item.cover=this.commonConfig.goodsPic+item.Cover_img;
								this.goodsList.push(item);
							});
							this.totalPage=res.data.data.total;
							if(this.totalPage==this.currentPage||this.totalPage==0){
								this.isLoad=false;
							}else{
								this.isLoad=true;
							}
						}
					}
				});
			},
			cancelCollect:function(index){
				uni.showModal({
					title: '温馨提示',
					content: '您将删除收藏商品',
					success: (res) => {
						//注册后直接登录
						if (res.confirm) {
							let token=uni.getStorageSync("token");
							let postData={
								Id:this.goodsList[index].Collect_id,
								token:token
							};
							this.common.commonPost({
								url:this.commonConfig.controllerPath+"/UserCollection/DelUserCollection",
								data:postData,
								success:res=>{
									if(res.data.state=="success"){
										this.common.errorBox("删除收藏商品成功");
									};
									this.getCollectionList(1);
								}
							})
						}else{
							uni.hideModal();
						}
					}
				});
			},
			gotoDetail:function(index){
				uni.navigateTo({
					url:'../../pages/detail/detail?goodsId='+this.goodsList[index].Id
				})
			},
			loadMoreGoods:function(){
				this.currentPage++;
				this.getCollectionList(this.currentPage);
			}
		},
		onLoad:function(){
			this.getCollectionList(1);
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
	.goodsInfo{
		padding-left: 10px;
		font-size: 28upx;
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
		background: #3AA7F8;
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
