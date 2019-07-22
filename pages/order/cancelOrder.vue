<template>
		<view class="cart commonView">
		<view class="shopName flexBox">
			<view class="iconView" @tap="selectAll"><span class="iconfont icon-success" :class="[{ selectIcon: isAllSelect }]"></span></view>
			<view class="cartCont">{{shopName}}</view>
		</view>
		<view class="goodsList">
			<view class="goods flexBox" v-for="(item,index) in cancelList" :key="index">
				<view class="iconView" @tap="selectedGoods(index)"><span class="iconfont icon-success" :class="[{ selectIcon:item.isSelected }]"></span></view>
				<view class="cartCont flexBox">
					<view class="goodsImg">
						<img :src="item.cover">
					</view>
					<view class="goodsInfo">
						<view class="textOver">
							{{item.Goods_name}}
						</view>
						<view class="price">
							￥{{item.Goods_price}}
						</view>
					</view>
				</view>
				<view class="edit">
					<view>
						×{{item.Goods_count}}
					</view>
				</view>
			</view>
		</view>
		<view class="flexBox settleView">
			<view class="deliveryPrice">起送价:￥0.0</view>
			<view class="totalMoney">合计:<text class="price">￥{{totalMoney}}</text></view>
			<view class="settle" @tap="cancelOrder">退货</view>
		</view>
		
	</view>
</template>

<script>
export default{
	data(){
			return {
				cancelList:[],
				shopName:'',
				isAllSelect:false,
				totalGoods:0,
				totalMoney:0.00,
				payType:''
			}
		},
		methods:{
			selectAll:function(){
				let count=0;
				let money=0;
				this.isAllSelect=!this.isAllSelect;
				if(this.isAllSelect){
					this.cancelList.forEach(item=>{
						count+=item.Goods_count;
						money+=item.Goods_price*100*item.Goods_count;
						item.isSelected=true;
					});
				}else{
					this.cancelList.forEach(item=>{
						item.isSelected=false;
					});
					count=0;
					money=0
				}
				
				this.totalGoods=count;
				this.totalMoney=(money/100).toFixed(2);
			},
			selectedGoods:function(index){
				let isSelectAll=true;
				this.cancelList[index].isSelected=!this.cancelList[index].isSelected;
				if(this.cancelList[index].isSelected){
					this.totalGoods=this.totalGoods+this.cancelList[index].Goods_count;
					this.totalMoney=((this.totalMoney*100+this.cancelList[index].Goods_price*100*this.cancelList[index].Goods_count)/100).toFixed(2);
					let length=this.cancelList.length;
					for(let i=0;i<length;i++){
						if(!this.cancelList[i].isSelected){
							isSelectAll=false;
							break;
						}
					}
					if(isSelectAll){
						this.isAllSelect=true;
					}
				}else{
					this.totalGoods=this.totalGoods-this.cancelList[index].Goods_count;
					this.totalMoney=((this.totalMoney*100-this.cancelList[index].Goods_price*100*this.cancelList[index].Goods_count)/100).toFixed(2);
					if(this.isAllSelect){
						this.isAllSelect=false;
					}
				}
				
			},
			cancelOrder:function(){	
				if(this.totalGoods==0){
					this.common.errorBox("请选择要退货的商品");
					return;
				}
				let token=uni.getStorageSync("token");
				let list=[];
				this.cancelList.forEach(item=>{	
					if(item.isSelected){
						list.push(item);
					}
				})
				let postData={
					"list": list,
					"token":token
				}
				this.common.commonPost({
					url:this.commonConfig.controllerPath+"/OutOrder/AddOrder",
					data:postData,
					success:res=>{
						if(res.data.state=="success"){
							uni.navigateTo({
								url:"../order/orderList"
							})
						}else{
							this.common.errorBox(res.data.message);
						}
					}
				})
			}
		},
		mounted:function(){
			this.cancelList=this.$store.state.cancelOrder;
			this.shopName=uni.getStorageSync("shopName");
			let userid=uni.getStorageSync("userId");
			let token=uni.getStorageSync("token");
			let shopCode=uni.getStorageSync("shopCode");
			let postData={
				userId:userid,
				shopCode:shopCode,
				token:token
			};
			// let _this=this;
			// _this.common.commonPost({
			// 	url:_this.commonConfig.controllerPath+"/Cart/GetcancelList",
			// 	data:postData,
			// 	success:function(res){
			// 		res.data.data.forEach(item=>{
			// 			item.Cover=_this.commonConfig.goodsPic+item.Cover_img;
			// 			item.modifyCount=item.Goods_count;
			// 			item.showModify=false;
			// 			item.isSelected=false;
			// 		});
			// 		_this.cancelList=res.data.data;
			// 	}
			// });
			
		}
	}
</script>

<style>
	.shopName{
		justify-content: flex-start;
		height: 35px;
		line-height: 35px;
		font-size: 32upx;
		border-bottom:1px solid #eee;
	}
	.iconView{
		width:10%
	}
	.iconView span{
		font-size:40upx;
	}
	.cartCont{
		width:75%;
	}
	.edit{
		width:15%;
		text-align: right;
		color:#888888;
		font-size: 30upx;
	}
	.goodsList{
		margin-bottom: 110px;
	}
	.goods{
		width:100%;
		padding:10px 0;
		border-bottom:1px solid #eee;
		position: relative;
	}
	.goodsImg{
		width:35%;
	}
	.goodsImg img{
		width:100%;
		min-height: 135upx;
		max-height: 190upx;
	}
	.goodsInfo{
		width:65%;
		font-size:28upx;
		padding-left: 5px;
		box-sizing: border-box;
	}
	.price{
		color:red;
		font-weight: bold;
	}
	.editIcon{
		padding-bottom: 15px;
	}
	.editIcon span{
		font-size:40upx;
	}
	.countSet{
		border:1px solid #ABABAB;
		width:20%;
		text-align: center;
		box-sizing: border-box;
	}
	.countInput div{
		width:auto;
	}
	.selectIcon{
		color:#42b983;
	}
	.settleView{
		position:fixed;
		width:100%;
		font-size:30upx;
		height: 80upx;
		line-height: 80upx;
		bottom:60px;
		left: 0;
		padding-left:10px;
		box-sizing: border-box;
		background: #fff;
		border-top:2px solid #eee;
	}
	.deliveryPrice{
		width:25%;
	}
	.totalGoods{
		width:15%;
		text-align: center;
	}
	.totalMoney{
		width:25%
	}
	.settle{
		width:35%;
		background:#3AA7F8;
		color:#fff;
		text-align:center;
	}
</style>
