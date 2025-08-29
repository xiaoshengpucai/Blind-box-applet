import App from './App'
import uviewPlus from 'uview-plus'
import { createPinia } from 'pinia'
// import './src/mock/mock.js'

// #ifndef VUE3
import Vue from 'vue'
// import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
	...App
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	const pinia = createPinia()
	app.use(pinia)
	app.use(uviewPlus)
	return {
		app
	}
}
// #endif