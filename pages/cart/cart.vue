<template>
	<view class="cart commonView">
		<view class="shopName flexBox">
			<view class="iconView" @tap="selectAll"><span class="iconfont icon-success" :class="[{ selectIcon: isAllSelect }]"></span></view>
			<view class="cartCont">{{shopName}}</view>
			<view class="edit">编辑</view>
		</view>
		<view class="goodsList">
			<view class="goods flexBox" v-for="(item,index) in cartList" :key="index">
				<view class="iconView" @tap="selectedGoods(index)"><span class="iconfont icon-success" :class="[{ selectIcon:item.isSelected }]"></span></view>
				<view class="cartCont flexBox">
					<view class="goodsImg">
						<img :src="item.Cover">
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
					<view class="editIcon" @tap="showModify(index)">
						<span class="iconfont icon-editor"></span>
					</view>
					<view>
						×{{item.Goods_count}}
					</view>
				</view>
				<view class="modifyCount" v-show="item.showModify">
					<view class="flexBox">
						<view class="minus countSet" @tap="minusCount(index)">-</view>
						<view class="countInput"><input type="text" v-model="item.modifyCount" ></view>
						<view class="plus countSet" @tap="plusCount(index)">+</view>
						<view class="modifyBtnView"><button type="primary" class="modifyBtn" @tap="modifyCount(index)">确定</button></view>
					</view>
				</view>	
			</view>
		</view>
		<view class="flexBox settleView">
			<view class="deliveryPrice">起送价:￥0.0</view>
			<view class="totalGoods">{{totalGoods}}件</view>
			<view class="totalMoney">合计:<text class="price">￥{{totalMoney}}</text></view>
			<view class="settle" @tap="gotoSettle">去结算</view>
		</view>
		<commFooter :tapIndex="1"></commFooter>
	</view>
</template>

<script>
import commFooter from '../../components/commFooter/commFooter.vue'
import store from '../../store'
export default{
	data(){
		return {
			cartList:[],
			shopName:'',
			isAllSelect:false,
			totalGoods:0,
			totalMoney:0.00,
			payType:''
		}
	},
	components:{
		commFooter
	},
	methods:{
		showModify:function(index){
			this.cartList[index].showModify=true;
		},
		minusCount:function(index){
			if(this.cartList[index].modifyCount==1){
				this.common.errorBox("不能再减了哦");
				return;
			}
			this.cartList[index].modifyCount--;
		},
		plusCount:function(index){
			this.cartList[index].modifyCount++;
		},
		modifyCount:function(index){
			let userid=uni.getStorageSync("userId");
			let token=uni.getStorageSync("token");
			let shopCode=uni.getStorageSync("shopCode");
			let cartData={
				user_id:userid,
				shop_code:shopCode,
				shop_name:this.shopName,
				goods_num:this.cartList[index].Goods_num,
				goods_count:this.cartList[index].modifyCount,
				id:this.cartList[index].Id
			};
			let postData={cart:cartData,token:token};
			let _this=this;
			this.common.commonPost({
				url:this.commonConfig.controllerPath+"/Cart/UpdateGoodsInCart",
				data:postData,
				success:res=>{
					//console.log(res);
					if(res.data.state=="success"){
						this.cartList[index].showModify=false;
					}
				}
			})
			
		},
		selectAll:function(){
			let count=0;
			let money=0;
			this.isAllSelect=!this.isAllSelect;
			if(this.isAllSelect){
				this.cartList.forEach(item=>{
					count+=item.Goods_count;
					money+=item.Goods_price*100*item.Goods_count;
					item.isSelected=true;
				});
			}else{
				this.cartList.forEach(item=>{
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
			this.cartList[index].isSelected=!this.cartList[index].isSelected;
			if(this.cartList[index].isSelected){
				this.totalGoods=this.totalGoods+this.cartList[index].Goods_count;
				this.totalMoney=((this.totalMoney*100+this.cartList[index].Goods_price*100*this.cartList[index].Goods_count)/100).toFixed(2);
				let length=this.cartList.length;
				for(let i=0;i<length;i++){
					if(!this.cartList[i].isSelected){
						isSelectAll=false;
						break;
					}
				}
				if(isSelectAll){
					this.isAllSelect=true;
				}
			}else{
				this.totalGoods=this.totalGoods-this.cartList[index].Goods_count;
				this.totalMoney=((this.totalMoney*100-this.cartList[index].Goods_price*100*this.cartList[index].Goods_count)/100).toFixed(2);
				if(this.isAllSelect){
					this.isAllSelect=false;
				}
			}
			
		},
		gotoSettle:function(){	
			if(this.totalGoods==0){
				this.common.errorBox("请选择要结算的商品");
				return;
			}
			this.$store.commit("changeSettle",this.cartList);
			this.$store.commit("changeSettleAmount",this.totalMoney);
			uni.navigateTo({
				url: '../settle/settle'
			})
		}
	},
	mounted:function(){
		this.shopName=uni.getStorageSync("shopName");
		let userid=uni.getStorageSync("userId");
		let token=uni.getStorageSync("token");
		let shopCode=uni.getStorageSync("shopCode");
		let postData={
			userId:userid,
			shopCode:shopCode,
			token:token
		};
		let _this=this;
		_this.common.commonPost({
			url:_this.commonConfig.controllerPath+"/Cart/GetCartList",
			data:postData,
			success:function(res){
				res.data.data.forEach(item=>{
					item.Cover=_this.commonConfig.goodsPic+item.Cover_img;
					item.modifyCount=item.Goods_count;
					item.showModify=false;
					item.isSelected=false;
				});
				_this.cartList=res.data.data;
			}
		});
		
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
		font-size:50upx;
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
		margin-bottom: 130px;
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
		font-size:46upx;
	}
	.modifyCount{
		width:40%;
		position:absolute;
		right:0px;
		bottom:15px;
		font-size: 28upx;
		color: #555;
		height: 60upx;
		line-height: 60upx;
	}
		
	.countInput{
		width:20%;
		/* padding:0 2px; */
		border:1px solid #ABABAB;
		height: 64upx;
		line-height: 64upx;
		box-sizing: border-box;
		display: block;
	}
	.modifyBtnView{
		width:40%;
		
		display: block;
		box-sizing: border-box;
	}
	.modifyBtn{
		font-size: 28upx;
		height: 64upx;
		line-height: 64upx;
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
		height: 100upx;
		line-height: 100upx;
		bottom:60px;
		left: 0;
		padding-left:10px;
		box-sizing: border-box;
		background: #fff;
		/* border-top:2px solid #eee; */
		background: #EEEEEE;
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
