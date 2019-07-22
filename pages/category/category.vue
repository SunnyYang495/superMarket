<template>
	<view class="flexBox categoryView">
		<view class="categoryList">
			<view class="category" v-for="(item,index) in categoryList" :key="index" @tap="getSubCate(index)" >
				<text :class="[{cateClicked:item.isClicked}]">{{item.Category_name}}</text>
			</view>
		</view>
		<view class="subCategorys flexBox">
			<view class="subCate" v-for="(subitem,subIndex) in subCategoryList" :key="subIndex" @tap="gotoGoodsList(subIndex)">
				<view class="cateImg"><img :src="subitem.cover" alt=""></view>
				<view class="cateName">{{subitem.Category_name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data(){
		return {
			categoryList:[],
			subCategoryList:[]
		}
	},
	methods:{
		getSubCate:function(index){
			//判断当前分类是不是选中状态
			if(this.categoryList[index].isClicked){
				return;
			}
			this.categoryList.forEach(item=>{
				item.isClicked=false;
			})
			this.categoryList[index].isClicked=true;
			let shopCode=uni.getStorageSync("shopCode");
			let postData={
				pId:this.categoryList[index].Category_id,
				shopCode:shopCode	
			};
			this.common.commonGet({
				url:this.commonConfig.controllerPath+'/Category/GetTwoCategoryList',
				data:postData,
				success:res=>{
					res.data.data.forEach(item=>{
						item.cover=this.commonConfig.categoryPic+item.Cover_img;
					});
					this.subCategoryList=res.data.data;
				}
			})
		},
		gotoGoodsList:function(index){
			uni.navigateTo({
				url:'../goods/goods?CategoryId='+this.subCategoryList[index].Category_id
			})
		}
	},
	mounted:function(){
		//获取一级分类
		let shopCode=uni.getStorageSync("shopCode");
		let postData={
			shopCode:shopCode
		}
		let that=this;
		this.common.commonGet({
			url:this.commonConfig.controllerPath+"/Category/GetOneCategoryList",
			data:postData,
			success:function(res){
				if(res.data.state=="success"){
					res.data.data.forEach((item)=>{
						item.isClicked=false;
					})
					that.categoryList=res.data.data;
				}
			}
		});
	}
}
</script>

<style>
	.categoryView{
		height: 100%;
		align-items: flex-start;
	}
	.categoryList{
		width:30%;
		background:#eee;
		height: 100%;
	}
	.category{
		height: 66upx;
		line-height: 66upx;
		width:98%;
		margin:2px 0;
		background: #fff;
		text-align: center;
	}
	.cateClicked{
		color:#3AA7F8;
	}
	.subCategorys{
		width:70%;
	}
	.subCate{
		width:33%;
		box-sizing: border-box;
		padding:5px;
		text-align: center;
	}	
	.cateImg{
		width:100%;
		text-align: center;
		height: 106upx;
		overflow: hidden;
	
	}
	.cateImg img{
		width:70%;
		height: 106upx;
	}
	.cateName{
		font-size: 28upx;
		color: #ABABAB;
		text-align: center;
	}
</style>
