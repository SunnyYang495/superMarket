import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
		currentAreaId:"",
		vId:"",
		settleList:[],
		settleAmount:0.00,
		orderInfo:{},
		addrProvince:{},
		addrCity:{},
		addrArea:{},
		addrVillage:{},
		isAddAddr:false,
		addressInfo:{},
		selectAddr:{},
		isFromSettle:false,
		settleGoods:[],
		cancelOrder:[],
		cartsNum:0
    },
    mutations: {
        changeAreaId(state,areaId){
			state.currentAreaId=areaId;
		},
		changeVid(state,vId){
			state.vId=vId;
		},
		changeSettle(state,cartList){
			state.settleList=[];
			if(cartList.length==0){
				return;
			}
			cartList.forEach(item=>{
				if(item.isSelected){
					state.settleList.push(item);
				}
			})
		},
		changeSettleAmount(state,amount){
			state.settleAmount=amount;
		},
		changeOrderInfo(state,order){
			state.orderInfo=order;
		},
		changeAddrProvince(state,province){
			state.addrProvince=province;
		},
		changeAddrCity(state,city){
			state.addrCity=city;
		},
		changeAddrArea(state,area){
			state.addrArea=area;
		},
		changeAddrVillage(state,village){
			state.addrVillage=village;
		},
		changeAddAddr(state,isAdd){
			state.isAddAddr=isAdd;
		},
		changeAddressInfo(state,addr){
			state.addressInfo=addr;
		},
		changeSelectAddr(state,addr){
			state.selectAddr=addr;
		},
		changeIsFromSettle(state,isSettle){
			state.isFromSettle=isSettle;
		},
		changeSettleGoods(state,goods){
			state.settleGoods=goods;
		},
		changeCancelOrder(state,order){
			state.cancelOrder=order;
		},
		changeCartsNum(state,num){
			state.cartsNum=num;
		}
    }
})

export default store