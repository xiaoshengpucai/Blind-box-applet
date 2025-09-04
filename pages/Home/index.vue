<template>
	<!-- 首页主容器 -->
	<view class="home-container" @click="handlePageClick">
		<!-- 状态栏区域 -->
		<status-bar @statusBarHeight="handleStatusBarHeight" @touchmove.stop.prevent="() => { }">
			<view class="header-nav-bar">
				<!-- 筛选按钮 -->
				<FilterDropdown :currentSort="currentSortType" :options="sortOptions" :visible="isFilterDropdownVisible"
					@toggle="handleFilterToggle" @select="handleSortSelection"
					@update:visible="isFilterDropdownVisible = $event" />
				<!-- 搜索按钮 -->
				<view class="nav-button search-button">
					<up-icon name="search" color="#fff" size="22"></up-icon>
				</view>
				<!-- 通知按钮 -->
				<view class="nav-button notification-button">
					<up-icon name="bell" color="#fff" size="22"></up-icon>
				</view>
			</view>
		</status-bar>
		<!-- 背景装饰区域 -->
		<view class="background-decoration">
			<image class="background-image" :src="backgroundImage" mode="aspectFill"></image>
		</view>
		<!-- 导航图标区域 -->
		 <view class="navigation">
			<NavigationIcons :statusBarHeight="statusBarHeight" :navigationList="navigationList"
			@navigation-click="handleNavigationClick" :isFixed="isNavigationFixed" :scrollThreshold="500"
			:containerHeight="220" />
		 </view>

		<!-- 滚动蒙层 -->
		<view class="frosted-transition" v-if="scrollMask"></view>
		<!-- 主内容区域 -->
		<view class="main-content" :style="{ paddingTop: navigationHeight + 'px' }">
			<scroll-view scroll-y @scroll="handleContentScroll" :style="{ height: calculateScrollViewHeight() + 'px' }">
				<!-- 轮播图区域 -->
				<view class="carousel-section">
					<!-- 使用原始数据 -->
					<Swiper :slide="carouselData" :switchModeL="carouselConfig.switchMode"
						:circular="carouselConfig.circular" :showIndicators="carouselConfig.showIndicators"
						:autoplay="carouselConfig.autoplay" :interval="carouselConfig.interval"
						:isshowcontrols="carouselConfig.isshowcontrols" :duration="carouselConfig.duration"
						@change="handleSwiperChange" />
				</view>
				<!-- 福利卡片区域 -->
				<view class="welfare-section">
					<WelfareCards :cards="welfareCardList" @card-click="handleWelfareCardClick" />
				</view>
				<!-- 商品列表组件 -->
				<TrendyTabVue :productList="productList"></TrendyTabVue>
			</scroll-view>
		</view>
	</view>
</template>

<script setup>
// 组件导入
import StatusBar from '@/components/status-bar';
import Swiper from './componets/swiper';
import TrendyTabVue from './componets/trendy-tab';
import FilterDropdown from '@/components/business/FilterDropdown.vue';
import WelfareCards from '@/components/business/WelfareCards.vue';
import NavigationIcons from '@/components/business/NavigationIcons.vue';
import throttle from '@/src/hooks/throttle.js'

import {
	onMounted,
	getCurrentInstance,
	ref,
	computed
} from 'vue';

// 接口数据处理
import { useLayoutList } from '@/src/composables/useLayoutList.js';
const { fetchInfinteClassList } = useLayoutList();
// ==================== 常量定义 ====================

const BACKGROUND_IMAGE_URL = 'https://pica.zhimg.com/100/v2-211f3f93123fafec7b424efa838fe542_r.jpg';

const THROTTLE_DELAY = {
	PAGE_CLICK: 300, // 降低页面点击节流延迟，提升响应性
	FILTER_TOGGLE: 300,
	SCROLL: 200
};

const SORT_TYPES = {
	NEW: 'new',
	PRICE_DESC: 'priceDesc',
	PRICE_ASC: 'priceAsc'
};

const sortOptions = ref([{
	key: 'new',
	label: '最新发布'
},
{
	key: 'priceDesc',
	label: '价格从高到低'
},
{
	key: 'priceAsc',
	label: '价格从低到高'
}
]);

// ==================== 响应式数据 ====================

const backgroundImage = BACKGROUND_IMAGE_URL;

// 页面全局点击事件处理 - 优化节流延迟并增加注释
const handlePageClick = throttle(() => {
	// 如果筛选下拉框未显示，直接返回，避免不必要的操作
	if (!isFilterDropdownVisible.value) return;

	// 隐藏筛选下拉框
	hideFilterDropdown();
}, THROTTLE_DELAY.PAGE_CLICK);

// ==================== 状态栏相关 ====================

const statusBarHeight = ref(0);

/**
 * 处理状态栏高度变化
 * @param {number} height - 状态栏高度
 */
const handleStatusBarHeight = (height) => {
	console.log(height, 'height----------------')
	statusBarHeight.value = height;
};

// ==================== 筛选下拉框相关 ====================

const isFilterDropdownVisible = ref(false);
const currentSortType = ref('');

/**
 * 显示筛选下拉框
 */
const showFilterDropdown = () => {
	isFilterDropdownVisible.value = true;
};

/**
 * 隐藏筛选下拉框
 */
const hideFilterDropdown = () => {
	isFilterDropdownVisible.value = false;
};

/**
 * 切换筛选下拉框显示状态 - 优化节流处理
 */
const handleFilterToggle = throttle(() => {
	if (isFilterDropdownVisible.value) {
		hideFilterDropdown();
	} else {
		showFilterDropdown();
	}
}, THROTTLE_DELAY.FILTER_TOGGLE);

// ==================== 商品数据管理 ====================

// 商品列表响应式数据
const productList = ref([]);

/**
 * 商品排序算法优化 - 提供多种排序方式
 */
const sortProducts = {
	/**
	 * 按创建时间排序（最新）
	 * @param {Array} products - 商品列表
	 * @returns {Array} 排序后的商品列表
	 */
	[SORT_TYPES.NEW]: (products) => {
		return [...products].sort((a, b) => b.createTime - a.createTime);
	},

	/**
	 * 按价格降序排序（高到低）
	 * @param {Array} products - 商品列表
	 * @returns {Array} 排序后的商品列表
	 */
	[SORT_TYPES.PRICE_DESC]: (products) => {
		return [...products].sort((a, b) => b.price - a.price);
	},

	/**
	 * 按价格升序排序（低到高）
	 * @param {Array} products - 商品列表
	 * @returns {Array} 排序后的商品列表
	 */
	[SORT_TYPES.PRICE_ASC]: (products) => {
		return [...products].sort((a, b) => a.price - b.price);
	}
};

/**
 * 处理排序选择 - 重构后的逻辑更清晰
 * @param {Event} event - 点击事件
 */
const handleSortSelection = (payload) => {
	const sortType = payload.sortType;
	// 如果点击的是当前已选中的排序类型，直接返回
	if (currentSortType.value === sortType) return;

	// 更新当前排序类型
	currentSortType.value = sortType;

	// 根据排序类型对商品进行排序
	if (sortProducts[sortType]) {
		productList.value = sortProducts[sortType](productList.value);
		// console.log(`商品已按${getSortTypeName(sortType)}排序`);
	}
};

// ==================== 导航数据配置 ====================

/**
 * 导航菜单列表 - 使用更规范的数据结构
 */
const navigationList = [{
	id: 1,
	text: '无限',
	path: 'infinite',
	src: '../../static/nav-img/图层 4.png'
},
{
	id: 2,
	text: '热门',
	path: 'hot',
	src: '../../static/nav-img/图层 5.png'
},
{
	id: 3,
	text: '盒中盒',
	path: 'box',
	src: '../../static/nav-img/图层 6.png'
},
{
	id: 4,
	text: '闯关',
	path: 'pass',
	src: '../../static/nav-img/图层 7.png'
},
{
	id: 5,
	text: '一番赏',
	path: 'reward',
	src: '../../static/nav-img/图层 8.png'
}
];

/**
 * 轮播图数据 - 重构为更清晰的结构
 */
const carouselData = ref([{
	id: 1,
	title: '轮播图1',
	imageUrl: 'https://tse4-mm.cn.bing.net/th/id/OIP-C.QmHur5XIHx_hAyq12RQJ_wHaEH?cb=iwc2&rs=1&pid=ImgDetMain',
	linkUrl: '#',
	sortOrder: 1,
	isActive: true
},
{
	id: 2,
	title: '轮播图2',
	imageUrl: 'https://tse1-mm.cn.bing.net/th/id/OIP-C.xGTInVTOkiPa4bx7tQWxzwHaEn?cb=iwc2&rs=1&pid=ImgDetMain',
	linkUrl: '#',
	sortOrder: 2,
	isActive: true
},
{
	id: 3,
	title: '轮播图3',
	imageUrl: 'https://img1.baidu.com/it/u=3640869952,3948102950&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500',
	linkUrl: '#',
	sortOrder: 3,
	isActive: true
},
{
	id: 4,
	title: '轮播图4',
	imageUrl: 'https://img2.baidu.com/it/u=2269872540,2964800185&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500',
	linkUrl: '#',
	sortOrder: 4,
	isActive: true
}
]);

/**
 * 计算属性 - 确保数据正确传递
 */
const carouselSlides = computed(() => {
	const slides = carouselData.value;
	console.log('carouselSlides computed:', {
		slides,
		length: slides?.length,
		isArray: Array.isArray(slides),
		stringified: JSON.stringify(slides)
	});
	return slides;
});
console.log('carouselSlides computed:', carouselSlides.value);

/**
 * 轮播图配置参数 - 集中管理配置项
 */
const carouselConfig = {
	switchMode: 'slide', // 切换模式: fade | slide
	showIndicators: false, // 是否显示指示点
	autoplay: true, // 是否自动播放
	interval: 4000, // 自动播放间隔时间(ms)
	duration: 600, // 切换动画持续时间(ms)
	circular: true, // 是否启用循环播放
	isshowcontrols: false // 是否显示控制按钮
};

// ==================== 福利卡片数据配置 ====================

/**
 * 福利卡片列表 - 重构为数据驱动的方式
 */
const welfareCardList = [{
	id: 'diy',
	title: 'DIV赏',
	buttonText: '查看详情',
	buttonColor: '#6fa6f5',
	backgroundClass: 'welfare-bg-diy',
	contentClass: 'welfare-content welfare-content-diy',
	titleClass: 'welfare-title welfare-title-diy'
},
{
	id: 'exclusive',
	title: '专属福利',
	buttonText: '领取福利',
	buttonColor: '#e9918a',
	backgroundClass: 'welfare-bg-exclusive',
	contentClass: 'welfare-content welfare-content-exclusive',
	titleClass: 'welfare-title welfare-title-exclusive'
},
{
	id: 'roll',
	title: 'ROLL房',
	buttonText: '参与活动',
	buttonColor: '#a295d9',
	backgroundClass: 'welfare-bg-roll',
	contentClass: 'welfare-content welfare-content-roll',
	titleClass: 'welfare-title welfare-title-roll'
}
];

// ==================== 页面布局和滚动相关 ====================

const componentInstance = ref(null);
const navigationHeight = ref(0);
const isNavigationFixed = ref(false);
const SCROLL_THRESHOLD = 500; // 导航固定的滚动阈值

// 修正：确保isScrollMask在scrollTop变化时能及时更新
const scrollTop = ref(0);

const scrollMask = computed(() => {
	return scrollTop.value >= 150;
});

// 在handleContentScroll中同步更新scrollTop和isScrollMask
const handleContentScroll = throttle((event) => {
	scrollTop.value = event.detail.scrollTop;
	isNavigationFixed.value = scrollTop.value > SCROLL_THRESHOLD;
}, THROTTLE_DELAY.SCROLL);

/**
 * 计算滚动视图高度 - 优化计算逻辑
 * @returns {number} 滚动视图高度
 */
const calculateScrollViewHeight = () => {
	const windowInfo = uni.getWindowInfo();
	return windowInfo.windowHeight - navigationHeight.value - statusBarHeight.value;
};

/**
 * 处理导航点击事件 - 重构为更清晰的函数名
 * @param {string} navigationPath - 导航路径
 */
const handleNavigationClick = (navigationPath) => {
	console.log(`导航点击: ${navigationPath.text}`);
	// TODO: 实现具体的导航跳转逻辑
};

/**
 * 处理福利卡片点击事件
 * @param {Object} welfareItem - 福利卡片数据
 */
const handleWelfareCardClick = (welfareItem) => {
	console.log(`福利卡片点击于: ${new Date().toLocaleTimeString()}`, welfareItem.title);
	// TODO: 实现具体的福利卡片点击逻辑
};

/**
 * 处理轮播图变化事件
 * @param {Object} event - 轮播图事件对象
 */
const handleSwiperChange = (event) => {
	// console.log('Swiper changed:', event);
	// console.log('Current index:', event.current);
	// console.log('Previous index:', event.previous);
	// console.log('Slide:', event.slide);
};

/**
 * 获取无限列表类别
 */
const getInfinteClassList = async () => {
	try {
		const result = await fetchInfinteClassList({ page: 1, limit: 10 });
		// 获取返回的数据
		// 这里可以将数据赋值给响应式变量或进行其他处理
		productList.value = [...result]; // 同时更新 productList
	} catch (error) {
		console.error('获取无限列表数据失败:', error);
	}
}

// ==================== 生命周期函数 ====================

/**
 * 组件挂载完成后的初始化操作
 */
onMounted(() => {
	initializeComponent();
	// 获取无限列表类别
	getInfinteClassList()
});

/**
 * 初始化组件 - 重构为独立函数，提高可读性
 */
const initializeComponent = () => {
	// 获取组件实例
	componentInstance.value = getCurrentInstance()?.proxy;

	// 延迟获取导航栏高度，确保DOM渲染完成
	setTimeout(() => {
		calculateNavigationHeight();
	}, 100);
};

/**
 * 计算导航栏高度 - 优化查询逻辑
 */
const calculateNavigationHeight = () => {
	if (!componentInstance.value) {
		console.warn('组件实例未准备就绪');
		return;
	}

	const query = uni.createSelectorQuery().in(componentInstance.value);
	query
		.selectAll('.navigation')
		.boundingClientRect((data) => {
			if (data && data.length > 0) {
				console.log(data[0],"data[0]");
				const result = data[0]
				navigationHeight.value = result.height
				console.log('导航栏高度:', navigationHeight.value);
			} else {
				console.warn('未找到导航栏元素');
			}
		})
		.exec();
};
</script>


<style lang="scss" scoped>
// ==================== 页面主体样式 ====================
.main-content {
	height: 100%;
	box-sizing: border-box;
}

// ==================== 头部导航栏样式 ====================
.header-nav-bar {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	position: relative;
	z-index: 10;
}

// 导航按钮通用样式 - 使用BEM命名规范
.nav-button {
	width: 50rpx;
	height: 50rpx;
	padding: 10rpx;
	border-radius: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-right: 20rpx;
	background-color: #1f1f1f;
	transition: all 0.3s ease; // 添加过渡动画

	&:active {
		transform: scale(0.95); // 点击反馈
	}
}

// 筛选按钮特殊样式
.filter-button {
	width: 100rpx;
	padding: 10rpx 0rpx;

	.filter-text {
		color: #fff;
		display: inline-block;
		font-size: 18rpx;
		margin: 0;
		padding: 0;
		margin-top: 5rpx;
		transition: color 0.3s ease; // 文字颜色过渡
	}
}

// ==================== 筛选下拉框样式 ====================
.filter-dropdown {
	position: absolute;
	right: 180rpx;
	top: 70rpx;
	width: 140rpx;
	border-radius: 10rpx;
	margin-top: 1rpx;
	background-color: rgba(0, 0, 0, 0.7);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	transform-origin: top;
	transform: rotateX(-90deg);
	transition: all 0.5s ease-in-out;
	z-index: 100; // 提升层级，确保下拉框处于最顶层
	backdrop-filter: blur(10rpx); // 添加背景模糊效果
}

.filter-option {
	font-size: 20rpx;
	padding: 10rpx;
	height: 50rpx;
	line-height: 50rpx;
	text-align: center;
	color: #fff;
	width: 100%;
	cursor: pointer;
	transition: all 0.2s ease;

	&:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}

	&.active {
		color: #bd9731;
		font-weight: bold;
	}
}

// 特殊分隔线样式
.filter-option-price-desc {
	border-bottom: 2rpx solid #927e7c;
	border-top: 2rpx solid #927e7c;
}

// ==================== 背景装饰区域样式 ====================
.background-decoration {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 400rpx;
	background: linear-gradient(to right, rgba(242, 95, 74, 0.8), rgba(252, 132, 116, 0.6));
	overflow: hidden;
	box-sizing: border-box;
	z-index: -1; // 确保背景在最底层
}

.background-image {
	position: absolute;
	box-sizing: border-box;
	left: -100rpx;
	width: 100%;
	height: 100%;
	mask-image: linear-gradient(to right,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 1) 60%,
			rgba(0, 0, 0, 0.8) 80%,
			rgba(0, 0, 0, 0) 100%);
	-webkit-mask-image: linear-gradient(to right,
			rgba(0, 0, 0, 1) 0%,
			rgba(0, 0, 0, 1) 60%,
			rgba(0, 0, 0, 0.8) 80%,
			rgba(0, 0, 0, 0) 100%);
}

//  ==================== 导航图标区域样式 ====================
.navigation{
	width: 100%;
	height: 220rpx;
	display: flex;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 10;
}

.frosted-transition {
	position: absolute;
	top: 320rpx;
	left: 0;
	width: 100%;
	height: 60rpx;
	transition: all 0.5s ease;
	background: linear-gradient(to bottom,
			rgba(255, 255, 255, 0.1) 0%,
			rgba(255, 255, 255, 0.7) 30%,
			rgba(255, 255, 255, 0.3) 70%,
			rgba(255, 255, 255, 0) 100%);
	backdrop-filter: blur(5rpx);
	-webkit-backdrop-filter: blur(5rpx);
	z-index: 1;
}

/* 兼容性增强：确保在不同浏览器中都能正确显示 */
@supports not (backdrop-filter: blur(20rpx)) {
	.frosted-transition {
		background: linear-gradient(to bottom,
				rgba(255, 255, 255, 0.1) 0%,
				rgba(255, 255, 255, 0.7) 30%,
				rgba(255, 255, 255, 0.3) 70%,
				rgba(255, 255, 255, 0) 100%);
	}
}

/* #ifdef MP-WEIXIN */
.frosted-transition {
	top: 380rpx;
	background: linear-gradient(to bottom,
			rgba(255, 255, 255, 0.1) 0%,
			rgba(255, 255, 255, 0.7) 30%,
			rgba(255, 255, 255, 0.3) 70%,
			rgba(255, 255, 255, 0) 100%);
	backdrop-filter: blur(5rpx);
	-webkit-backdrop-filter: blur(5rpx);
	z-index: 99;
}

// #endif

// ==================== 主内容区域样式 ====================

// .main-content 样式已在上面的模板结构中定义

.carousel-section {
	max-width: 750rpx;
	height: 330rpx;
	margin: 0 auto; // 居中显示
}

// ==================== 动画定义 ====================

/**
	 * 浮动动画 - 为导航图标添加生动效果
	 */
@keyframes float {

	0%,
	100% {
		transform: translateY(0);
	}

	50% {
		transform: translateY(-5px);
	}
}

// 浮动动画应用类
.animate-float {
	animation: float 3s ease-in-out infinite;
	will-change: transform; // 优化动画性能
}

// ==================== 响应式设计支持 ====================

/**
	 * 小屏幕适配
	 */
@media screen and (max-width: 750rpx) {
	.welfare-section {
		flex-direction: column;
		height: auto;
		gap: 20rpx;
	}
}

/**
	 * 超大屏幕适配
	 */
@media screen and (min-width: 1200rpx) {
	.home-container {
		max-width: 1200rpx;
		margin: 0 auto;
	}
}
</style>
