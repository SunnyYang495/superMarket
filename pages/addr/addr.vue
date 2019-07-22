<template>
	<view>
		<view class="addrList" v-for="(item,index) in addrList" :key="index">
			<view class="villageName">
				{{item.value}}
			</view>
			<view class="addr" v-for="(sonItem,i) in item.SonData" :key="i">
				<view @tap="selectAddr(sonItem)">
					<view class="receiverInfo">
						<text class="receiver">{{sonItem.Recipient}}</text>
						<text>{{sonItem.Phone}}</text>
					</view>
					<view class="address">{{sonItem.Province_name+sonItem.City_name+sonItem.County_name+sonItem.Village_name+sonItem.Address}}</view>
				</view>
				<view class="flexBox addrOption">
					<view class="addrOp">
						<span class="iconfont icon-success_fill" :class="[{defaultAddr:sonItem.Is_default}]"></span>
						<text>默认地址</text>
					</view>
					<view class="addrOp" @tap="editAddr(sonItem)">
						<span class="iconfont icon-editor"></span>
						<text>编辑</text>
					</view>
					<view class="addrOp" @tap="deleteAddr(sonItem)">
						<span class="iconfont icon-trash"></span>
						<text>删除</text>
					</view>
				</view>
			</view>
		</view>
		<view class="addNew"><button type="primary" @tap="addAddr">添加新地址</button></view>
		<view class="mask" v-show="maskShow">
			<view class="addrForm" v-show="addFormShow">
				<view class="formTitle" v-show="!operation">地址修改:</view>
				<view class="formTitle" v-show="operation">添加新地址:</view>
				<view class="flexBox inputGroup">
					<view class="inputTitle">收货人姓名:</view>
					<view class="inputV"><input class="uni-input" placeholder="姓名" v-model="addrInfo.Recipient" /></view>
				</view>
				<view class="flexBox inputGroup">
					<view class="inputTitle">所在区域:</view>
					<view class="inputV"><input class="uni-input" placeholder="选择区域" @tap="changeArea" v-model="addrInfo.areaInfo" /></view>
				</view>
				<view class="flexBox inputGroup">
					<view class="inputTitle">详细地址:</view>
					<view class="inputV"><input class="uni-input" placeholder="详细信息" v-model="addrInfo.Address" /></view>
				</view>
				<view class="flexBox inputGroup">
					<view class="inputTitle">手机号码:</view>
					<view class="inputV"><input class="uni-input" placeholder="手机号码" v-model="addrInfo.Phone" /></view>
				</view>
				<view class="flexBox inputGroup">
					<view class="">是否设置为默认:</view>
					<view>
						<checkbox-group>
							<label>
								<checkbox value="" color="#3AA7F8" style="transform:scale(0.7)" :checked="defaultAddr" @tap="changeDefault"/>
							</label>
						</checkbox-group>
					</view>
				</view>
				<view class="flexBox inputGroup">
					<view class=""><button type="primary" size="mini" @tap="confirmOperate">确认</button></view>
					<view><button size="mini" @tap="cancelOperate">取消</button></view>
				</view>
			</view>
			<view class="confirmBox" v-show="!addFormShow">
				<view>
					<view class="hintTitle">温馨提示</view>
					<view class="hintMsg">您即将删除收货地址</view>
					<view class="flexBox operate">
						<view class="operateBtn cancelDel" @tap="cancelDel">取消</view>
						<view class="operateBtn" @tap="confirmDel">删除</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				addrList:[],
				addrInfo:{},
				operation:1,//1是add，0是编辑
				maskShow:false,
				defaultAddr:false,
				addFormShow:true,
				delItem:{},
				isFromSettle:false
			}
		},
		methods:{
			getAddrList:function(){
				let token=uni.getStorageSync("token");
				let userId=uni.getStorageSync("userId");
				this.common.commonPost({
					url:this.commonConfig.controllerPath+"/UserAddress/GetAddList",
					data:{
						"userId": userId,
						"token": token
					},
					success:res=>{
						if(res.data.state="success"){
							this.addrList=res.data.data;
						}
					}
				});
			},
			addAddr:function(){
				this.operation=1;
				this.addFormShow=true;
				this.maskShow=true;
				this.addrInfo={};
				this.$store.commit("changeAddAddr",true);
			},
			editAddr:function(sonItem){
				this.operation=0;
				this.addFormShow=true;
				this.maskShow=true;
				this.addrInfo=JSON.parse(JSON.stringify(sonItem));
				this.defaultAddr=this.addrInfo.Is_default;
				this.addrInfo.areaInfo=this.addrInfo.Province_name+this.addrInfo.City_name+this.addrInfo.County_name+this.addrInfo.Village_name;
				this.$store.commit("changeAddAddr",false);
			},
			changeDefault:function(){
				this.defaultAddr=!this.defaultAddr;
			},
			changeArea:function(){
				this.$store.commit("changeAddressInfo",this.addrInfo);
				uni.navigateTo({
					url:"../selectArea/selectArea?fromAddr=1"
				})
			},
			confirmOperate:function(){
				let token=uni.getStorageSync("token");
				let userId=uni.getStorageSync("userId");
				this.addrInfo.Is_default=this.defaultAddr;
				if(this.operation){
					this.addrInfo.user_id=userId;
					this.common.commonPost({
						url:this.commonConfig.controllerPath+"/UserAddress/AddUserAddress",
						data:{
							token:token,
							add:this.addrInfo
						},
						success:res=>{
							if(res.data.state=="success"){
								this.maskShow=false;
								this.getAddrList();
								this.common.errorBox("新增收货地址成功");
							}
						}
					});
				}else{
					this.common.commonPost({
						url:this.commonConfig.controllerPath+"/UserAddress/UpdateUserAddress",
						data:{
							token:token,
							add:this.addrInfo
						},
						success:res=>{
							if(res.data.state=="success"){
								this.maskShow=false;
								this.getAddrList();
								this.common.errorBox("收货地址修改成功");
							}
						}
					});
				}
			},
			cancelOperate:function(){
				this.maskShow=false;
			},
			deleteAddr:function(item){
				this.maskShow=true;
				this.addFormShow=false;
				this.delItem=item;
				
			},
			cancelDel:function(){
				this.maskShow=false;
			},
			confirmDel:function(){
				let token=uni.getStorageSync("token");
				let postData={
					"aId": this.delItem.Id,
					"token": token
				};
				this.common.commonPost({
					url:this.commonConfig.controllerPath+"/UserAddress/DelUserAddress",
					data:postData,
					success:res=>{
						if(res.data.state=="success"){
							this.maskShow=false;
							this.getAddrList();
							this.common.errorBox("删除地址成功");
						}
					}
				});
			},
			selectAddr:function(item){
				if(!this.$store.state.isFromSettle){
					return;
				}
				this.$store.commit("changeSelectAddr",item);
				this.$store.commit("changeIsFromSettle",false);
				uni.navigateTo({
					url:"../settle/settle?fromAddr=1"
				})
			}
		},
		onLoad: function(options) {
			// if(this){
			// 	this.isFromSettle=true;
			// }
			if(options.showForm){
				if(this.$store.state.isAddAddr){
					this.operation=1;
				}else{
					this.operation=0;
				}
				this.addrInfo=this.$store.state.addressInfo
				this.addrInfo=this.$store.state.addressInfo;
				this.addrInfo.Province=this.$store.state.addrProvince.Areaid;
				this.addrInfo.Province_name=this.$store.state.addrProvince.Areaname;
				this.addrInfo.City=this.$store.state.addrCity.Areaid;
				this.addrInfo.City_name=this.$store.state.addrCity.Areaname;
				this.addrInfo.County=this.$store.state.addrArea.Areaid;
				this.addrInfo.County_name=this.$store.state.addrArea.Areaname;
				this.addrInfo.Village=this.$store.state.addrVillage.Id;
				this.addrInfo.Village_name=this.$store.state.addrVillage.Village_name;
				this.addrInfo.areaInfo=this.addrInfo.Province_name+this.addrInfo.City_name+this.addrInfo.County_name+this.addrInfo.Village_name;
				this.maskShow=true;
			}
			this.getAddrList();
		}
	}
</script>

<style>
	.villageName{
		padding:0 10px;
		height: 80upx;
		line-height: 80upx;
		background:#EEEEEE;
	}
	.addr{
		padding:10px;
	}
	.receiverInfo{
		height: 70upx;
		line-height: 70upx;
	}
	.address{
		color:#888888;
	}
	.addrOption{
		padding:0 10px;
		height: 70upx;
		line-height: 70upx;
		border-bottom:1px solid #EEEEEE ;
		font-size: 28upx;
		color: #888888;
	}
	.addrOp span{
		font-size: 40upx;
		vertical-align: middle;
	}
	.defaultAddr{
		color:#3AA7F8;
	}
	.mask{
		width:100%;
		height: 100%;
		position: fixed;
		left: 0;
		top:0;
		background:rgba(0,0,0,0.5);
	}
	.addrForm{
		width:90%;
		height: 600upx;
		margin: 100upx auto;
		background: #fff;
		padding:10px;
	}
	.formTitle{
		height: 80upx;
		line-height: 80upx;
		font-weight: bold;
	}
	.inputGroup{
		margin:10px 0;
	}
	.inputTitle{
		width:30%;
	}
	.inputV{
		width:70%;
	}
	.inputV input{
		border:1px solid #DADADA;
		padding:0 5px;
		font-size: 28upx;
	}
	.addNew{
		padding:0 10px;
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
