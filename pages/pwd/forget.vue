<template>
	<view class="reDiv">
		<view class="reForm">
			<view class="inputView flexBox">
				<input type="text" value="" placeholder="手机号" v-model="mobile" class="mobile">
				
				<button class="verify commBtn" @tap="sendVerify":disabled="codeDisable">{{codeBtn}}</button>
			</view>
			<view class="inputView">
				<input type="text" value="" placeholder="请输入验证码" v-model="code">
			</view>
			<view class="inputView">
				<input type="text" value="" placeholder="请输入新密码" v-model="newPass">
			</view>
			<view class="inputView">
				<input type="text" value="" placeholder="请再次输入密码" v-model="confirmPass">
			</view>
			<view class="tapBtn">
				<button @tap="forgetPass" class="commBtn">完成</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				mobile:"",
				code:"",
				newPass:"",
				confirmPass:"",
				codeBtn:"获取验证码",
				codeDisable:false
			}
		},
		methods:{
			sendVerify:function(){
				if(this.mobile==""){
					uni.showToast({
						title: '请输入手机号码',
						duration: 2000,
						icon:"none"
					});
					return;
				}
				let postData={
					phone:this.mobile
				}
				this.common.commonPost({
					url:this.commonConfig.agencyController+"/agency/sendVerificationCode.do?phone="+this.mobile,
					data: JSON.stringify(postData),
					success:res=>{
						if(res.data.status.succeed=="S0001"){
							this.codeDisable=true;
							let timer=null;
							let seconds=60;
							clearInterval(timer);
							timer=setInterval(()=>{
								seconds--;
								if(seconds==0){
									this.codeDisable=false;
									this.codeBtn="获取验证码";
									clearInterval(timer);
								}else{
									
									this.codeBtn=seconds+"s后重发";
								}
								
							},1000);
							uni.showToast({
								title: res.data.status.desc,
								duration: 2000,
								icon:"none"
							});
						}else{
							this.common.errorBox("发送失败，请稍后重试");
						}
					}
				})
			},
			forgetPass:function(){
				if(this.mobile==""){
					uni.showToast({
						title: '请输入手机号码',
						duration: 2000,
						icon:"none"
					});
					return;
				}
				if(this.code==""){
					uni.showToast({
						title: '请输入验证码',
						duration: 2000,
						icon:"none"
					});
					return;
				}
				if(this.newPass==""){
					uni.showToast({
						title: '请输入新密码',
						duration: 2000,
						icon:"none"
					});
					return;
				}
				if(this.newPass.length<6){
					uni.showToast({
						title: '密码不能小于6位',
						duration: 2000,
						icon:"none"
					});
					return;
				}
				if(this.confirmPass==""){
					uni.showToast({
						title: '请输入确认密码',
						duration: 2000,
						icon:"none"
					});
					return;
				}
				if(this.confirmPass!=this.newPass){
					uni.showToast({
						title: '密码和确认密码不一致',
						duration: 2000,
						icon:"none"
					});
					return;
				}
				let verifyData={
					phone:this.mobile,
					code:this.code
				}
				this.common.commonPost({
					url: this.commonConfig.agencyController+'/agency/checkVerificationCode.do?phone='+this.mobile+'&code='+this.code,
					data: verifyData,
					success:res=>{
						
						if(res.data.status.succeed=="S0001"){
							let postData={
								"phone": this.mobile,
								"password": this.newPass
							}
							this.common.commonPost({
								url:this.commonConfig.controllerPath+"/UserInfo/SetPassword",
								data:postData,
								success:res=>{
									if(res.data.state=="success"){
										this.common.errorBox("密码修改成功");
										uni.navigateTo({
											url:"../login/login"
										});
									}
								}
							})
						}else{
							this.common.errorBox("验证码错误");
						}
					}
				})
				
			}
		}
	}
</script>

<style>
	.reDiv{
		margin-top:10px;
		padding:0 10px;
	}
	.subTitle{
		height: 1px;
		background:#8F8F94;
		position:relative;
		
	}
	.subTitle text{
		width:120px;
		height: 25px;
		position:absolute;
		left:50%;
		top: -12px;
		margin-left:-60px;
		text-align:center;
		line-height: 25px;
		color:#8F8F94;
		font-size:28upx;
		background:#fff;
	}
	.verify{
		height: 38px;
	}
</style>
