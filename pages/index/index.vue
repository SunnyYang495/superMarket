<template>
	<view class="content">
		<view class="logoImg">
			<image class="logo" src="/static/start.png"></image>
		</view>
		<view class="regBtns">
			<navigator url="../reg/reg" class="regBtn">注册</navigator>
			
			<navigator url="../login/login" class="loginBtn">登录</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {
			const token=uni.getStorageSync('token');
			 const user = uni.getStorageSync('user');
			 const shopCode=uni.getStorageSync('shopCode')
			 if(token&&!shopCode){
				uni.navigateTo({
					url: '../selectArea/selectArea'
				});
			 }
			 if(token&&shopCode){
				uni.navigateTo({
					url: '../main/main'
				}); 
			 }
		}
	}
</script>

<style>
	.content {
		text-align: center;
	}
	.logo {
		width: 100%;
		height: 1120upx;
	}
	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
	.regBtns{
		display: flex;
		justify-content: space-between;
		padding:10px;
	}
	.regBtns navigator{
		width:200upx;
		border:1px solid #3AA7F8;
		
		border-radius:5px;
		font-size: 24upx;
		height: 30px;
		line-height: 30px;
	}
	.loginBtn{
		color: #FFFFFF;
		background: #3AA7F8;
	}	
	.regBtn{
		color:#3AA7F8;
	}
</style>
