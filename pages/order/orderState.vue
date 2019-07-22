<template>
	<view>
		<view class="commitSucc">
			<view class="succIcon"><span class="iconfont icon-success_fill"></span></view>
			<view><text>订单提交成功</text></view>
		</view>
		<view class="orderInfos">
			<view class="orderInfo">店铺名称:{{shopName}}</view>
			<view class="orderInfo">交易单号:{{orderNum}}</view>
			<view class="orderInfo">订单时间:{{createTime}}</view>
			<view class="viewOrder"><button type="primary" @tap="gotoOrderDetail">查看订单详情</button></view>
		</view>
	</view>
</template>

<script>
	import md5 from 'md5'
	export default{
		data(){
			return {
				shopName:"",
				orderNum:"",
				createTime:"",
				payType:0
			}
		},
		methods:{
			gotoOrderDetail:function(){
				uni.navigateTo({
					url:"../order/orderDetail?orderNum="+this.orderNum+"&fromSettle=1"
				});
			}
		},
		onLoad:function(options){
			this.orderNum=options.orderNum;
			this.createTime=options.orderDate;
			this.payType=options.payType;
			this.shopName=uni.getStorageSync("shopName");
			if(this.payType=="1"){
				uni.showModal({
					title: '温馨提示',
					content: '订单已提交，是否支付',
					success: (res) => {
						if (res.confirm) {
							let money=parseFloat(options.settleAmount).toFixed(2);
							let orderId=this.orderNum;
							let shopId="816ff5d3a0090ada85098502704ac44f";
							let payInfo="money="+money+"&orderId="+orderId+"&shopId="+shopId;
							let sign=md5(payInfo).toUpperCase();
							let payUrl="http://pay.congmingpay.com/pay/buypay.do?"+payInfo+"&sign="+sign+"&redirectUrl=http://www.congmingpay.com"
							let jumpUrl=encodeURIComponent(payUrl);
							uni.navigateTo({
								url:'../payUrl/payUrl?url='+jumpUrl
							});
						}else{
							uni.hideModal();
						}
					}
				});
			}
		}
	}
</script>

<style>
	.commitSucc{
		text-align: center;
	}
	.succIcon span{
		font-size: 150upx;
		color:#42B983;
		
	}
	.orderInfos{
		padding:0 10px;
	}
	.orderInfo{
		height: 80upx;
		line-height: 80upx;
		border-bottom:1px solid #DADADA;
	}
	.viewOrder{
		border-bottom:1px solid #DADADA;
	}
	.viewOrder button{
		margin: 10px 0;
	}
</style>
