<template>
	<view class="loginView">
		<view class="loginForm">
			<view class="inputView">
				<input type="text" value="" placeholder="请输入账号" v-model="user">
			</view>
			<view class="inputView">
				<input type="text" value="" placeholder="请输入密码" v-model="password">
			</view>
		</view>
		<navigator url="../pwd/forget" class="forgetPass">忘记密码？</navigator>
		<view class="tapBtn">
			<button @tap="login" class="commBtn">登录</button>
		</view>
	</view>
</template>

<script>
	import {config} from "../../common/config.js"
	export default{
		data(){
			return{
				"user":"",
				"password":""
			}
		},
		onLoad() {
			
		},
		methods:{
			login:function(){
				if(this.user==""){
					uni.showToast({
						title: '请输入用户名',
						duration: 2000,
						icon:"none"
					});
					return;
				}
				if(this.password==""){
					uni.showToast({
						title: '请输入密码',
						duration: 2000,
						icon:"none"
					});
					return;
				}
				let postData={
					phone:this.user,
					password:this.password
				};
				this.common.commonRequest({
				   url: this.commonConfig.controllerPath+'/UserInfo/Login',
				   data: postData,
				   method:"POST",
				   header : {'content-type':'application/json'}  
				}).then(data=>{
					uni.hideLoading();	
					if(data[1]&&data[1]!==null){
						if(data[1].data.state=="success"){
							const userData=data[1].data.data;
							uni.setStorageSync('userId',userData.UserInfo.Id)
							uni.setStorageSync('user', userData.UserInfo.User_name);
							uni.setStorageSync('token', userData.Token);
							uni.setStorageSync('phone', userData.UserInfo.Phone);
							uni.setStorageSync('icon', userData.UserInfo.Icon);
								
							if(userData.UserInfo.Shop_code==null){
								uni.navigateTo({
									url: '../selectArea/selectArea'
								});
							}else{
								this.common.commonGet({
									url:this.commonConfig.controllerPath+'/ShopInfo/GetShopInfoByCode',
									data:{
										shopCode:userData.UserInfo.Shop_code
									},
									success:res=>{
										if(res.data.state=="success"){
											uni.setStorageSync('shopName', res.data.data.Shop_name);
											uni.setStorageSync("payType",res.data.data.Pay_type);
										}
									}
								});
								uni.setStorageSync('shopCode', userData.UserInfo.Shop_code);
								
								uni.navigateTo({
									url: '../main/main'
								});
							}
						}else{
							uni.showModal({
								title: '提示',
								content: "登录失败",
								showCancel:false
							});
						}	
					}else{
						uni.showModal({
							title: '提示',
							content: "网络错误，请稍后重试",
							showCancel:false
						});
					}
				})
			}
		}
	}
</script>

<style>
	.loginView{
		padding:0 10px;
	}
	.loginForm{
		padding:10px;
	}
	
	.forgetPass{
		font-size:28upx;
		padding:20px 0;
		color:#3AA7F8;
	}
	
</style>
