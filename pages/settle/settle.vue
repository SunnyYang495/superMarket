<template>
	<view>
		<view class="address">	
			<!-- <view class="commTitle">收货地址</view> -->
			<view class="addressView flexBox" @tap="gotoAddr">
				<view class="noAddr addr" v-show="!hasAddr">请创建收货地址，以确保货物顺利到达</view>
				<view class="haveAddr addr" v-show="hasAddr">
					<view class="flexBox basicInfo">
						<view>收货人:{{addr.Recipient}}</view>
						<view>{{addr.Phone}}</view>
					</view>
					<view class="detailInfo">收货地址:{{addr.Province_name+addr.City_name+addr.County_name+addr.Village_name+addr.Address}}</view>
				</view>
				<view class="linkAddrs">
					<span class="iconfont icon-enter"></span>
				</view>
			</view>
		</view>
		<view class="GoodsList">
			<view class="goods flexBox" v-for="(item,index) in settleList" :key="index">
				<view class="goodsImg">
					<img :src="item.Cover" alt=""/>
				</view>
				<view class="goodsInfo">
					<view>{{item.Goods_name}}</view>
					<view class="flexBox">
						<view>￥{{item.Goods_price}}</view>
						<view>×{{item.Goods_count}}</view>
					</view>
				</view>
				
			</view>
		</view>
		<view class="payType">
			<view class="commTitle">付款方式</view>
			<view class="uni-list">
				<radio-group @change="radioChange">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in payTypeArr" :key="item.value" v-show="item.isShow">
						<view>
							<radio :value="item.value" :checked="index === current" />{{item.name}}
						</view>
					</label>
				</radio-group>
			</view>
		</view>
		<view class="commitOrder">
			<view class="flexBox commitView">
				<view class="freight">运费:￥0.00</view>
				<view class="totalMoney">合计:<text class="price">￥{{settleAmount}}</text></view>
				<view class="commit" @tap="commitOrder">提交订单</view>
			</view>
		</view>
	</view>
</template>

<script>
	import store from '../../store'
	export default{
		data(){	
			return {
				addr:"",
				settleList:[],
				hasAddr:true,
				settleAmount:0.00,
				payType:0,
				payTypeArr: [{
                    value: '4',
                    name: '货到付款',
					checked: 'true',
					isShow:false
                },
				{
					value: '2',
                    name: '支付宝',
					checked: 'true',
					isShow:false
				},
                {
                    value: '1',
                    name: '微信',
                    checked: 'true',
					isShow:false
                }
				],
				current: 0
			}
		},
		methods: {
			radioChange: function(evt) {
				for (let i = 0; i < this.payTypeArr.length; i++) {
					if (this.payTypeArr[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			gotoAddr:function(){
				this.$store.commit("changeIsFromSettle",true);
				uni.navigateTo({
					url:"../addr/addr"
				})
			},
			commitOrder:function(){
				let shopCode=uni.getStorageSync("shopCode");
				let token=uni.getStorageSync("token");
				let goodsId=[];
				this.settleList.forEach(item=>{
					goodsId.push(item.Id);
				});
				let commitGoods=goodsId.join(",");
				let postData={
					shopCode:shopCode,
					token:token,
					cartIds:commitGoods
				}
				this.common.commonPost({
					url:this.commonConfig.controllerPath+"/Order/GetTempOrder",
					data:postData,
					success:res=>{
						if(res.data.state=="success"){
							let info=res.data.data.info;
							for(var name in info){
								for(var i in this.addr){
									if(i==name){
										info[name]=this.addr[i];
									}
								}
							}
							info.Goods_amount=this.settleAmount;
							info.Pay_type=parseInt(this.payTypeArr[this.current].value);
							info.Payment_num=0;
							info.Shipping_name="";
							info.Shipping_phone="";
							info.Shop_name=uni.getStorageSync("shopName");
							let addList=JSON.parse(JSON.stringify(this.settleList));
							addList.forEach(item=>{
								delete item.Cover;
								item.Order_num=info.Order_num;
							});
							this.common.commonPost({
								url:this.commonConfig.controllerPath+"/Order/AddOrder",
								data:{
									info:info,
									list:addList,
									token:token,
								},
								success:res=>{
									if(res.data.state=="success"){
										let orderDate=this.common.formatDate(info.Create_time);
										this.$store.commit("changeSettle",[]);
										this.$store.commit("changeSettleAmount","0.00");
										this.$store.commit("changeSettleGoods",addList);
										this.$store.commit("changeOrderInfo",info);
										uni.navigateTo({
											url:"../order/orderState?orderNum="+info.Order_num+"&orderDate="+orderDate+"&payType="+info.Pay_type+"&settleAmount="+this.settleAmount
										});
									}else{
										this.common.errorBox("订单提交失败，请稍后重试");
									}
								}
							});
						}
					}
				})
			}
		},
		onLoad :function(options) {
			this.payType=uni.getStorageSync("payType");
			this.settleList=this.$store.state.settleList;
			this.settleAmount=this.$store.state.settleAmount;
			if(options.fromAddr){
				this.addr=this.$store.state.selectAddr;
			}else{
				let shopCode=uni.getStorageSync("shopCode");
				let userId=uni.getStorageSync("userId");
				let token=uni.getStorageSync("token");
				let postData={
					shopCode:shopCode,
					userId:userId,
					token:token
				};
				//获取收货地址
				this.common.commonPost({
					url:this.commonConfig.controllerPath+'/UserAddress/GetAddListByShop',
					data:postData,
					success:res=>{
						if(res.data.state=="success"){
							if(res.data.data.length==0){
								this.hasAddr=false;
							}else{
								res.data.data.forEach(item=>{
									item.SonData.forEach(sonItem=>{
										if(sonItem.Is_default){
											this.addr=sonItem;
										}
									});
								})
								if(this.addr==""){
									this.addr=res.data.data[0].SonData[0];
								}
							}
						}
					}
				});
			}
			
			//支付方式（1微信；2支付宝；4货到付款）
			let payTypeStr=this.payType.toString(2);
			let payTypeShow=payTypeStr.split("");
			this.payTypeArr.forEach((item,index)=>{
				item.isShow=parseInt(payTypeShow[index]);
				if(item.value!=4){
					item.isShow=false;
				}
			});
			
		}
	}
</script>

<style>
	.commTitle{
		height: 70upx;
		line-height: 70upx;
		padding:0 10px;
		box-sizing: border-box;
		border-bottom:1px solid #EEEEEE;
		font-weight: bold;
	}
	.addressView{
		padding:10px;
		border-bottom:10px solid #eee;
	}
		
	.addr{
		width:90%;
	}
	.basicInfo{
		margin-bottom: 5px;
		font-size:30upx;
	}
	.detailInfo{
		font-size:28upx;
		color:#ABABAB;
	}
	.linkAddrs{
		height:136upx;
		line-height: 136upx;
	}
	.GoodsList{
		border-bottom:10px solid #eee;
	}
	.goods{
		padding:10px;
		justify-content: flex-start;
		border-bottom:1px solid #eee;
	}
	.goodsImg{
		width:25%;
	}	
	.goodsImg img{
		width:100%;
		min-height:180upx;
		max-height: 200upx;
	}
	.goodsInfo{
		 padding-left:10px;
		 width:75%;
		 box-sizing: border-box ;
	}
	.payType{
		padding:10px;
		margin-bottom:110upx ;
	}
	.payTypes{
		height: 70upx;
		line-height: 70upx;
		padding:0 10px;
	}
	.commitOrder{
		height: 100upx;
		line-height: 100upx;
		position:fixed;
		width:100%;
		left:0;
		bottom:0;
		font-size:30upx;
		border-top:1px solid #eee;
		background: #fff;
	}
	.freight{
		width:30%;
		box-sizing: border-box;
		padding-left: 10px;
	}
	.totalMoney{
		width:40%;
		box-sizing: border-box;
		padding-right: 10px;
		text-align: right;
	}
	.commit{
		width:30%;
		background:#3AA7F8;
		color:#fff;
		text-align: center;
	}
	.uni-list{
		padding-top:10px;
	}
	.uni-list-cell{
		height: 68upx;
		line-height: 68upx;
	}
	.price{
		color:red;
		font-weight: bold;
	}
</style>
