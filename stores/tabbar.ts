import { defineStore } from 'pinia'
import { ref } from 'vue'
const tabList = ref([{
	pagePath: '/pages/index/index',
	text: '首页',
	iconPath: '/static/tabbar/aigei.png',
	selectedIconPath: '/static/tabbar/aigei.png'
},
{
	pagePath: '/pages/Mall/Mall',
	text: '商城',
	iconPath: '/static/tabbar/mall.png',
	selectedIconPath: '/static/tabbar/mall.png'
},
{
	pagePath: '/pages/Warehouse/Warehouse',
	text: '仓库',
	iconPath: '/static/tabbar/warehouse.png',
	selectedIconPath: '/static/tabbar/warehouse.png'
},
{
	pagePath: '/pages/Profile/Profile',
	text: '我的',
	iconPath: '/static/tabbar/mine.png',
	selectedIconPath: '/static/tabbar/mine.png'
}
])

export const useTabbarStore = defineStore('tabbar', () => {
	const switchLock = ref(false);
	const activeIndex = ref(0);
	activeIndex.value = uni.getStorageSync('TABBAR_INDEX');
	function setActiveIndex(index: number){
		activeIndex.value = index;
		uni.setStorageSync('TABBAR_INDEX', index);
	}
	return {
		switchLock,
		activeIndex,
		tabList,
		setActiveIndex
	}
})

export const CardListStore = defineStore('CarList',()=>{
	const cardList = ref([]);
	function setCardList(list: any){
		cardList.value = list;
	}
	return {
		cardList,
		setCardList
	}
});	