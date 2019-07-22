<template>
	<view class="reDiv">
		<view class="subTitle">
			<text>使用手机号注册</text>
		</view>
		<view class="reForm">
			<view class="inputView flexBox">
				<input type="text" value="" placeholder="手机号" v-model="mobile" class="mobile">
				
				<button class="verify commBtn" @tap="sendVerify" :disabled="codeDisable">{{codeBtn}}</button>
			</view>
			<view class="inputView">
				<input type="text" value="" placeholder="请输入验证码" v-model="code">
			</view>
			<view class="inputView">
				<input type="text" value="" placeholder="请输入6-12位字母或数字密码" v-model="pass">
			</view>
			<view class="inputView">
				<input type="text" value="" placeholder="请再次输入密码" v-model="confirmPass">
			</view>
			<view class="tapBtn">
				<button @tap="register" class="commBtn">注册</button>
			</view>
		</view>
	</view>
	
</template>

<script>
	export default{
		data(){
			return{
				mobile:'',
				code:'',
				pass:'',
				confirmPass:'',
				codeBtn:"获取验证码",
				codeDisable:false
			}
		},
		methods:{
			register:function(){
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
				if(this.pass==""){
					uni.showToast({
						title: '请输入新密码',
						duration: 2000,
						icon:"none"
					});
					return;
				}
				if(this.pass.length<6){
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
				if(this.confirmPass!=this.pass){
					uni.showToast({
						title: '密码和确认密码不一致',
						duration: 2000,
						icon:"none"
					});
					return;
				}
				let postData={
					phone:this.mobile,
					password:this.pass
				}
				let verifyData={
					phone:this.mobile,
					code:this.code
				}
				let _this=this;
				_this.common.commonRequest({
					url: _this.commonConfig.agencyController+'/agency/checkVerificationCode.do?phone='+this.mobile+'&code='+this.code,
					data: verifyData,
					method:"POST"
				}).then(data=>{
					uni.hideLoading();
					if(data[1]&&data[1]!==null){
						if(data[1].data.status.succeed=="S0001"){
							return _this.common.commonRequest({
									url: _this.commonConfig.controllerPath+'/UserInfo/AddUserInfo',
									data: postData,
									method:"POST",
									header : {'content-type':'application/json'},
								})
						}else{
							uni.showModal({
								title: '提示',
								content: data[1].data.status.desc,
							})
							return;
						}
					}
				}).then(data=>{
					uni.hideLoading();
					if(data[1]&&data[1]!==null){
						if(data[1].data.state=="success"){
							uni.showModal({
								title: '注册成功',
								content: '注册成功，是否直接登录',
								success: (res) => {
									//注册后直接登录
									if (res.confirm) {
										let postData={
											phone:this.mobile,
											password:this.pass
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
													
													uni.setStorageSync('user', userData.UserInfo.Phone);
													uni.setStorageSync('token', userData.Token);
													uni.navigateTo({
														url: '../selectArea/selectArea'
													});	
													
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
									}else{
										uni.navigateTo({
											url: '../login/login'
										});
									}
								}
							});
						}else{
							_this.common.errorBox(data[1].data.message);
						}
					}
					
				})
			},
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
				let that=this;
				this.common.commonRequest({
					url:this.commonConfig.agencyController+"/agency/sendVerificationCode.do?phone="+this.mobile,
					data: JSON.stringify(postData),
					method:"POST"
					//header : {'content-type':'application/json'}
				}).then(data=>{
					uni.hideLoading();
					if(data[1]!==null){
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
							title: data[1].data.status.desc,
							duration: 2000,
							icon:"none"
						});
						// uni.showModal({
						// 	title: '提示',
						// 	content: data[1].data.status.desc,
						// 	showCancel:false
						// });
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
