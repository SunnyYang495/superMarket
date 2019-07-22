export default{
	commonGet:function(option){
		uni.showLoading({
			title: '加载中'
		});
		option.method='GET';
		option.complete=function(){
			uni.hideLoading();
		}
		uni.request(option);
	},
	commonPost:function(option){
		uni.showLoading({
			title: '加载中'
		});
		option.method='POST';
		option.header={'content-type':'application/json'}; 
		option.complete=function(){
			uni.hideLoading();
		}
		uni.request(option);
	},
    commonRequest:function(option){
		uni.showLoading({
			title: '加载中'
		});
		return uni.request(option);
	},
	errorBox:function(errMsg){
		uni.showModal({
			title: '提示',
			content: errMsg,
			showCancel:false
		});
	},
	formatDate:function(str){
		let createDate=new Date(parseInt(str+"000"));
		let year=createDate.getFullYear();
		let month=parseInt(createDate.getMonth())+1;
		month=month>9?month:"0"+month;
		let date=createDate.getDate();
		date=date>9?date:"0"+date;
		return year+"-"+month+"-"+date;
	}
}