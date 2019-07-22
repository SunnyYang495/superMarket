<template>
	<view class="my">
		<view class="info flexBox">
			<view class="head"><img :src="userIcon"></view>
			<view class="basicInfo">
				<view class="nickName"><text class="nick">昵称:{{nickName}}</text></view>
				<view class="phone"><text>{{phone}}</text></view>
			</view>
		</view>
		<view class="mainFunct">
			<view class="funct flexBox" @tap="gotoOrder">
				<view class="functIcon"><span class="iconfont icon-document"></span></view>
				<view class="functName">订单管理</view>
				<view class="functEnter"><span class="iconfont icon-enter"></span></view>
			</view>
			<view class="funct flexBox" @tap="gotoReturnOrder">
				<view class="functIcon"><span class="iconfont icon-shielding"></span></view>
				<view class="functName">退货管理</view>
				<view class="functEnter"><span class="iconfont icon-enter"></span></view>
			</view>
			<view class="funct flexBox" @tap="gotoAddr">
				<view class="functIcon"><span class="iconfont icon-coordinates"></span></view>
				<view class="functName">地址管理</view>
				<view class="functEnter"><span class="iconfont icon-enter"></span></view>
			</view>
			<view class="funct flexBox" @tap="gotoCollection">
				<view class="functIcon"><span class="iconfont icon-collection"></span></view>
				<view class="functName">我的收藏</view>
				<view class="functEnter"><span class="iconfont icon-enter"></span></view>
			</view>
		</view>
		<view class="otherFunct">
			<view class="funct flexBox" @tap="gotoFeedback">
				<view class="functIcon"><span class="iconfont icon-editor"></span></view>
				<view class="functName">意见反馈</view>
				<view class="functEnter"><span class="iconfont icon-enter"></span></view>
			</view>
			<view class="funct flexBox">
				<view class="functIcon"><span class="iconfont icon-trash"></span></view>
				<view class="functName">清除缓存</view>
				<view class="functEnter"><span class="iconfont icon-enter"></span></view>
			</view>
		</view>
		<view class="">
			<view class="funct flexBox">
				<view class="functIcon"><span class="iconfont icon-prompt"></span></view>
				<view class="functName">版本信息</view>
				<view class="functEnter"></view>
			</view>
		</view>
		<view class="logOut" @tap="logOut">
			退出登录
		</view>
		<commFooter :tapIndex="2"></commFooter>
		<view class="mask" v-show="maskShow">
			<view class="confirmBox">
				<view>
					<view class="hintTitle">温馨提示</view>
					<view class="hintMsg">退出登录</view>
					<view class="flexBox operate">
						<view class="operateBtn cancelDel" @tap="cancelLogout">取消</view>
						<view class="operateBtn" @tap="confirmLogout">确定</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import commFooter from '../../components/commFooter/commFooter.vue'
	export default{
		data(){	
			return{
				userIcon:"",
				nickName:"",
				phone:"",
				maskShow:false
			}
		},
		methods:{
			gotoOrder:function(){
				uni.navigateTo({
					url:"../order/orderList"
				});
			},
			gotoAddr:function(){
				uni.navigateTo({
					url:"../addr/addr"
				});
			},
			gotoReturnOrder:function(){
				uni.navigateTo({
					url:"../order/returnOrders"
				});
			},
			gotoFeedback:function(){
				uni.navigateTo({
					url:"../feedback/feedback"
				});
			},
			gotoCollection:function(){
				uni.navigateTo({
					url:"../collection/myCollection"
				});
			},
			logOut:function(){
				this.maskShow=true;
			},
			cancelLogout:function(){
				this.maskShow=false;
			},
			confirmLogout:function(){
				localStorage.removeItem('token');
				localStorage.removeItem('userId');
				localStorage.removeItem('phone');
				localStorage.removeItem('icon');
				localStorage.removeItem('shopCode');
				localStorage.removeItem('shopName');
				localStorage.removeItem('user');
				uni.navigateTo({
					url:"../index/index"
				})
			}
		},
		onLoad:function(){
			this.nickName=uni.getStorageSync("user");
			this.phone=uni.getStorageSync("phone");
			this.userIcon=this.commonConfig.contentPic+uni.getStorageSync("icon");
		},
		components:{
			commFooter
		}
	}
</script>

<style>
	.my{
		height: 100%;
		background: #dadada;
	}
	.info{
		height: 100px;
		background: url(../../static/head.jpg) no-repeat center;
		background-color: rgba(0, 0, 0, 0.6) ;
		background-size: 100%;
		background-clip: content-box;
		justify-content: flex-start;
		/* opacity:0.4;
		filter:alpha(opacity=40); */
	}
	.head{
		width:30%;
		text-align: right;
		padding:10px;
		box-sizing: border-box;
	}
	.head img{
		width: 150upx;
		height: 150upx;
		border-radius:50% ;
	}
	.basicInfo{
		width:70%;
		padding:10px;
		box-sizing: border-box;
	}
	.nickName{
		margin-bottom:10px;
	}
	.nick{
		background: #ABABAB;
		color: #fff;
		opacity:1;
		filter:alpha(opacity=100);
	}
	.phone{
		opacity:1;
		filter:alpha(opacity=100);
	}
	.funct{
		background: #fff;
		height: 80upx;
		line-height: 80upx;
		border-top:1px solid #eee;
		padding:0 10px;
	}
	.functIcon{
		width:10%;
	}
	.functIcon span{
		font-size: 44upx;
	}
	.functName{
		width:75%;
		text-align: left;
	}
	.functEnter{
		width:15%;
		text-align: right;
	}
	.otherFunct{
		margin: 10px 0;
	}
	.logOut{
		height: 80upx;
		line-height: 80upx;
		color:red;
		background: #fff;
		margin:15px 0;
		text-align: center;
	}
	.mask{
		width:100%;
		height: 100%;
		position: fixed;
		left: 0;
		top:0;
		background:rgba(0,0,0,0.5);
	}
	.confirmBox{
		width:80%;
		background: #fff;
		margin: 400upx auto 0;
		border-radius:5px ;
		text-align: center;
	}
	.hintTitle{
		height: 100upx;
		line-height: 100upx;
		font-weight: bold;
	}
	.hintMsg{
		height: 120upx;
		/* line-height: 120upx; */
		font-size: 30upx;
		margin-top: 20upx;
	}
	.operate{
		height: 100upx;
		line-height: 100upx;
		color:#3AA7F8;
		border-top: 1px solid #DADADA;
	}
	.operateBtn{
		width:50%;
	}
	.cancelDel{
		border-right:1px solid #DADADA ;
		box-sizing: border-box;
	}
</style>
