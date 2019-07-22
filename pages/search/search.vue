<template>
	<view class="search flexBox">
		<view class="searchInput flexBox">
			<view class="searchIcon"><span class="iconfont icon-search"></span></view>
			<view><input type="text" placeholder="搜索超市商品" v-model="key" /></view>
		</view>
		<view class="searchBtn">
			<!-- <input type="button" value="搜索"> -->
			<button type="primary" @tap="searchKey">搜索</button>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return {
				key:''
			}
		},
		methods:{
			searchKey:function(){
				if(this.key==""){
					this.common.errorBox("请输入搜索内容");
					return;
				}
				uni.navigateTo({
					url:"../../pages/goods/goods?key="+this.key
				})
			}
		}
	}
</script>

<style>
	.search{
		height: 80upx;
		line-height: 60upx;
		background:#DADADA;
		padding:10px 10px 0;
	}
	.searchInput{
		background: #fff;
		width:70%;
		justify-content: flex-start;
	}
	.searchIcon span{
		font-size: 40upx;
		color:#8F8F94;
	}
	.searchBtn{
		width:30%;
		padding-left: 10px;
		box-sizing: border-box;
	}
		
	.searchBtn button{
		background: #3AA7F8;
		color:#fff;
		border-radius: 5px;
		text-align: center;
		height: 60upx;
		line-height: 60upx;
	}
</style>
