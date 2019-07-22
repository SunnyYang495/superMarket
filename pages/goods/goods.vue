<template>
	<view>
		<goodsList :goodsList="dataList" :isSortDesc="isDesc" :isSortByCount="sortMode" :isLoad="needLoad" v-on:pOrderByCount="orderByCount" v-on:pOrderByPrice="orderByPrice" v-on:pLoadMoreGoods="loadMoreGoods"></goodsList>
	</view>
</template>

<script>
	import goodsList from "../../components/goodsList/goodsList.vue"
	export default{
		data(){
			return {
				dataList:[],
				isDesc:true,
				sortMode:1,//0为价格排序，1为销量排序
				CategoryId:'',
				totalPage:'',
				currentPage:1,
				needLoad:false,  //是否加载更多
				pageSize:6,
				currentPost:'',
				isSearch:false  //是否从搜索进入
			}
		},
		methods:{
			getDataList:function(){
				let sidx='';
				let sord=''
				let queryJson={};
				if(this.sortMode==1){
					sidx="Sale_count";
				}else{
					sidx="Goods_price";
				}
				if(this.isDesc){
					let sord="desc";
				}else{
					let sord="asc"
				}
				let page={
					"page":this.currentPage,
					"rows":this.pageSize,
					"sidx":sidx,
					"sord":sord,
					"total":"0"
				};
				if(this.isSearch){
					queryJson={
						"Goods_name":this.key,
						"Shop_code":uni.getStorageSync("shopCode")
					};
				}else{
					queryJson={
						"Category_id":this.CategoryId,
						"Shop_code":uni.getStorageSync("shopCode")
					};
				}
				let postData={
					"pagin":page,
					"queryJson":queryJson
				}
				//this.currentPost=postData;
				this.common.commonPost({
					url:this.commonConfig.controllerPath+"/GoodsInfo/FindGoodsList",
					data:postData,
					success:res=>{
						res.data.data.rows.forEach(item=>{
							item.cover=this.commonConfig.goodsPic+item.Cover_img;
							this.dataList.push(item);
						});
						this.totalPage=res.data.data.total;
						if(this.totalPage==this.currentPage||this.totalPage==0){
							this.needLoad=false;
						}else{
							this.needLoad=true;
						}
					}
				});
			},
			orderByCount:function(){
				if(this.sortMode==1){
					return;
				}
				this.dataList=[];
				this.sortMode=1;
				this.currentPage=1;
				
				this.getDataList();
			},
			orderByPrice:function(){
				if(this.sortMode==1){
					this.sortMode=0;
				}else{
					this.isDesc=!this.isDesc;
				}
				this.currentPage=1;
				this.dataList=[];
				
				this.getDataList();
			},
			loadMoreGoods:function(){
				this.currentPage++;
				this.getDataList();
			}
		},
		onLoad(options){
			if(options.CategoryId){
				this.CategoryId=options.CategoryId;
			}else{
				this.key=options.key;
				this.isSearch=true;
			}
			
			this.getDataList();
		},
		components:{
			goodsList
		}
	}
</script>

<style>
</style>
