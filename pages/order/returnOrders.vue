<template>
	<view>
		<view class="returnHead flexBox">
			<view class="orderType" v-for="(item,index) in stateList" :key="index" v-bind:class="[{clickedType:item.stateClicked}]" @tap="getOrderList(index,1)">
				{{item.stateName}}
			</view>
		</view>
		<view class="orderList">
			<view class="order flexBox" v-for="(item,index) in orederList" :key="index" @tap="viewOrderDetail(index)">
				<view>
					<view class="orderId">订单号:{{item.Order_num}}</view>
					<view class="orderMargin">店铺名:{{item.Shop_name}}</view>
					<view class="orderMargin">合计:￥{{item.Goods_amount}}</view>
					<view>订单状态:{{item.stateName}}</view>
				</view>
				<view>{{item.time}}</view>
			</view>
			<view class="loadMore" v-show="loadMoreShow" @tap="loadMoreOrder">加载更多...</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				stateList:[
					{
						state:0,
						stateName:"处理中",
						stateClicked:true
					},
					{
						state:1,
						stateName:"已退货",
						stateClicked:false
					}
				],
			orederList:[],
			currentPage:1,
			pageSize:10,
			totalPage:0,
			loadMoreShow:true,
			currentState:0
			}
		},
		methods:{
			getOrderList:function(index,page){
				//如果切换了类型
				if(page==1){
					this.orederList=[];
					this.currentPage=1;
				}
				this.currentState=this.stateList[index].state;
				this.stateList.forEach(item=>{
					item.stateClicked=false;
				});
				this.stateList[index].stateClicked=true;
				let userId=uni.getStorageSync("userId");
				let token=uni.getStorageSync("token");
				let shopCode=uni.getStorageSync("shopCode");
				let queryJson={
					"userId": userId,
					"state": this.stateList[index].state,
					"shopCode": shopCode
				};
				let postData={
					"queryJson": queryJson,
					"token": token,
					"pagin": {
						"rows":this.pageSize,
						"sord": "asc",
						"total": "0",
						"sidx": "Create_time",
						"page": page,
						"records": "0"
					}
				};
				let that=this;
				this.common.commonPost({
					url:this.commonConfig.controllerPath+"/OutOrder/GetOutOrderListByState",
					data:postData,
					success:function(res){
						res.data.data.rows.forEach(item=>{
							item.stateName=that.stateList[index].stateName;
							item.time=that.common.formatDate(item.Create_time);
							that.orederList.push(item);
						})
						//that.orederList=res.data.data.rows;
						that.totalPage=res.data.data.total;
						if(that.totalPage==0||that.totalPage==page){
							that.loadMoreShow=false;
						}else{
							that.loadMoreShow=true;
						}
					}
				})
			},
			viewOrderDetail:function(index){
				this.$store.commit("changeOrderInfo",this.orederList[index]);
				uni.navigateTo({
					url:"../order/orderDetail?orderNum="+this.orederList[index].Order_num
				})
			},
			loadMoreOrder:function(){
				this.currentPage++;
				this.getOrderList(this.currentState,this.currentPage);
			}
		},
		onLoad: function(){
			this.getOrderList(0,1);
		}
	}
</script>

<style>
	.returnHead{
		height: 70upx;
		line-height: 70upx;
		font-size: 28upx;
	}
	.orderType{
		width:50%;
		text-align: center;
		border-bottom: 1px solid #DADADA;
	}
	.clickedType{
		color: #3AA7F8;
		border-bottom: 1px solid #3AA7F8;
	}
	.order{
		padding:10px;
		font-size: 28upx;
		color:#8F8F94;
		align-items: flex-end;
		border-bottom:1px solid #DADADA ;
	}
	.orderId{
		font-size: 30upx;
		font-weight: bold;
		color:#000;
		margin:5px 0;
	}
	.orderMargin{
		margin:3px 0;
	}
	.loadMore{
		height: 80upx;
		line-height: 80upx;
		text-align:center;
	}
</style>
