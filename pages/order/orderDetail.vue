<template>
	<view class="orderDetail">
		<view class="orderState">
			<span class="iconfont icon-order"></span><text>交易状态：</text><text class="stateName">{{orderDetail.stateName}}</text>
		</view>
		<view class="orderAddr flexBox">
			<view><span class="iconfont icon-coordinates"></span></view>
			<view>
				<view>收货地址：</view>
				<view class="grayFont">{{orderDetail.Recipient}} {{orderDetail.Phone}}</view>
				<view class="grayFont">{{orderDetail.Province_name+orderDetail.City_name+orderDetail.County_name+orderDetail.Village_name+orderDetail.Address}}</view>
			</view>
		</view>
		<view>
			<view class="shopName">
				<span></span>
				<text>{{orderDetail.Shop_name}}</text>
			</view>
			<view class="orderGoodsList">
				<view class="orderGoods flexBox" v-for="(item,index) in goodsList" :key="index">
					<view class="goodsImg"><img :src="item.cover" /></view>
					<view class="goodsName">{{item.Goods_name}}</view>
					<view class="goodsCount">x{{item.Goods_count}}</view>
					<view class="goodsPrice">￥{{item.Goods_price}}</view>
				</view>
			</view>
		</view>
		<view class="orderSummary">
			<view>订单合计：<text class="summaryVal">￥{{orderDetail.Goods_amount}}</text></view>
			<view>运费：<text class="summaryVal">￥0.00</text></view>
			<view>创建时间：<text class="summaryVal">{{orderDetail.time}}</text></view>
			<view>订单号：<text class="summaryVal">{{orderDetail.Order_num}}</text></view>
		</view>
		<view class="cancelOrder flexBox">
			<!-- <view class="detailBtn payBtn" v-show="payShow" @tap="pay">支付</view> -->
			<view class="detailBtn" v-show="cancelShow" @tap="cancelOrder">取消订单</view>
		</view>
	</view>
</template>

<script>
	import md5 from 'md5'
	export default{
		data(){
			return {
				orderDetail:{},
				goodsList:[],
				payShow:false,
				cancelShow:false
			}
		},
		methods:{
			cancelOrder:function(){
				this.$store.commit("changeCancelOrder",this.goodsList);
				uni.navigateTo({
					url:"../order/cancelOrder"
				});
			},
			pay:function(){
				//小程序
				// #ifdef  MP-WEIXIN
				let money=parseFloat(this.orderDetail.Goods_amount).toFixed(2);
				let orderId=this.orderDetail.Order_num;
				let shopId="816ff5d3a0090ada85098502704ac44f";
				let payInfo="money="+money+"&orderId="+orderId+"&shopId="+shopId;
				let key="&key=1A031F2C6118F9D9EA94461587156CF0";
				let sign=md5(payInfo+key).toUpperCase();
				let payUrl="http://pay.congmingpay.com/pay/buypay.do?"+payInfo+"&sign="+sign+"&redirectUrl=http://www.congmingpay.com";
				console.log(payUrl);
				let jumpUrl=encodeURIComponent(payUrl);
				uni.navigateTo({
					url:'../payUrl/payUrl?url='+jumpUrl
				});
				// #endif
			}
		},
		onLoad:function(options){
			this.orderDetail=this.$store.state.orderInfo;
			if(!this.orderDetail.stateName){
				if(this.orderDetail.State==0){
					this.orderDetail.stateName="未付款";
				}
				if(this.orderDetail.State==1){
					this.orderDetail.stateName="待发货";
				}
				if(this.orderDetail.State==2){
					this.orderDetail.stateName="备货中";
				}
				if(this.orderDetail.State==3){
					this.orderDetail.stateName="待收货";
				}
				if(this.orderDetail.State==4){
					this.orderDetail.stateName="完成";
				}
			}
			if(this.orderDetail.State=="0"){
				this.payShow=true;
				this.cancelShow=true;
			}
			if(this.orderDetail.State=="1"){
				this.cancelShow=true;
			}
			if(options.fromSettle){
				this.goodsList=this.$store.state.settleGoods;
				this.goodsList.forEach(item=>{
					item.cover=this.commonConfig.goodsPic+item.Cover_img;
				});
			}else{
				let token=uni.getStorageSync("token");
				let postData={
					orderNum:options.orderNum,
					token:token
				};
				this.common.commonPost({
					url:this.commonConfig.controllerPath+"/Order/GetOrderGoodsList",
					data:postData,
					success:res=>{
						if(res.data.state=="success"){
							res.data.data.forEach(item=>{
								item.cover=this.commonConfig.goodsPic+item.Cover_img;
							});
							this.goodsList=res.data.data;
						}else{
							this.common.errorBox("网络错误，请稍后重试");
						}
						
					}
				});
			}
			
		}
	}
</script>

<style>
	.orderDetail{
		font-size: 28upx;
	}
	.orderState{
		height: 80upx;
		line-height: 80upx;
		padding:0 10px;
		border-bottom:10px solid #eee;
	}
	.stateName{
		color: #3AA7F8;
	}
	.orderAddr{
		padding:10px;
		justify-content: flex-start;
		border-bottom:10px solid #eee;
	}
	.shopName{
		padding:0 10px;
		height: 70upx;
		line-height: 70upx;
		border-bottom:1px solid #eee;
	}
	.orderGoods{
		padding:10px;
		font-size: 28upx;
		border:1px solid #eee;
	}
	.goodsImg{
		width:30%;
		height: 165upx;
		overflow: hidden;
	}
	.goodsName{
		width:40%;
		padding-left: 10px;
		box-sizing: border-box;
	}
	.goodsCount,.goodsPrice{
		width:15%;
	}
	.orderSummary{
		padding:10px;
		font-size: 24upx;
		color:#ABABAB;
		margin-bottom:100upx ;
	}
	.summaryVal{
		color:#555555;
	}
	.cancelOrder{
		position: fixed;
		left: 0;
		bottom: 0;
		width:100%;
		justify-content: flex-end;
		height: 100upx;
		background: #fff;
		padding:0 10px;
		/* align-items: center; */
		box-sizing: border-box;
	}
	.detailBtn{
		width:30%;
		height:60upx;
		border:1px solid #ABABAB;
		margin:20upx 0;
		box-sizing: border-box;
		text-align: center;
		font-size:28upx;
		border-radius:10upx;
		line-height:60upx ;
	}
	.detailBtn{
		margin-right:10px ;
	}
	.grayFont{
		color: #ABABAB;
		margin:5px 0;
	}
</style>
