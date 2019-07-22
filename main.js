import Vue from 'vue'
import App from './App'
import common from './common/common.js'
import config from './common/config.js'
import './common/iconfont/iconfont.css'
import store from './store'  

Vue.prototype.$store = store  
Vue.prototype.common=common
Vue.prototype.commonConfig=config
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
