<template>
	<!-- 首页主容器 -->
	<view class="home-container" @click="handlePageClick">
		<!-- 状态栏区域 -->
		<status-bar @statusBarHeight="handleStatusBarHeight" @touchmove.stop.prevent="() => { }">
			<view class="header-nav-bar">
				<!-- 筛选按钮 -->
				<view class="nav-button filter-button" @click.stop="handleFilterToggle">
					<up-icon name="list-dot" color="#fff" size="22"></up-icon>
					<text class="filter-text" :style="filterTextStyle">筛选</text>
				</view>
				<!-- 搜索按钮 -->
				<view class="nav-button search-button">
					<up-icon name="search" color="#fff" size="22"></up-icon>
				</view>
				<!-- 通知按钮 -->
				<view class="nav-button notification-button">
					<up-icon name="bell" color="#fff" size="22"></up-icon>
				</view>
				<!-- 筛选下拉菜单 -->
				<view class="filter-dropdown" @click="handleSortSelection" :style="filterDropdownStyle">
					<view class="filter-option filter-option-new" :class="{ 'active': currentSortType === 'new' }"
						data-type="new">
						最新发布
					</view>
					<view class="filter-option filter-option-price-desc"
						:class="{ 'active': currentSortType === 'priceDesc' }" data-type="priceDesc">
						价格从高到低
					</view>
					<view class="filter-option filter-option-price-asc"
						:class="{ 'active': currentSortType === 'priceAsc' }" data-type="priceAsc">
						价格从低到高
					</view>
				</view>
			</view>
		</status-bar>

		<!-- 背景装饰区域 -->
		<view class="background-decoration">
			<image class="background-image" :src="backgroundImage" mode="aspectFill"></image>
		</view>

		<!-- 导航图标区域 -->
		<view class="navigation-section" :style="{ marginTop: statusBarHeight + 'px' }"
			@touchmove.stop.prevent="() => { }">
			<view class="navigation-item" v-for="(navItem, index) in navigationList" :key="navItem.id"
				:class="['animate-float', `nav-item-${index}`]" :style="{
					top: calculateNavigationItemTop(index) + 'px',
					animationDelay: index * 0.2 + 's'
				}">
				<image class="navigation-icon" :style="{ top: calculateNavigationItemTop(index) + 'px' }"
					@click="handleNavigationClick(navItem.text)" :src="navItem.src" mode="aspectFit" lazy-load />
			</view>
		</view>
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
						:isshowcontrols="carouselConfig.isshowcontrols"
						:duration="carouselConfig.duration" @change="handleSwiperChange"/>
				</view>

				<!-- 福利卡片区域 -->
				<view class="welfare-section">
					<view class="welfare-card" v-for="welfareItem in welfareCardList" :key="welfareItem.id"
						@click="handleWelfareCardClick(welfareItem)">
						<view :class="welfareItem.backgroundClass"></view>
						<view :class="welfareItem.contentClass">
							<view :class="welfareItem.titleClass">{{ welfareItem.title }}</view>
							<view class="welfare-button">
								<text class="button-text" :style="{ color: welfareItem.buttonColor }">
									{{ welfareItem.buttonText }}
								</text>
								<up-icon class="button-icon" name="play-right-fill" size="10"
									:color="welfareItem.buttonColor"></up-icon>
							</view>
						</view>
					</view>
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
	import throttle from '../../src/hooks/throttle.js'
	import {
		onMounted,
		getCurrentInstance,
		ref,
		reactive,
		computed
	} from 'vue';

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
		statusBarHeight.value = height;
	};

	// ==================== 筛选下拉框相关 ====================
	const isFilterDropdownVisible = ref(false);
	const currentSortType = ref('');

	/**
	 * 筛选下拉框样式 - 使用computed优化性能
	 */
	const filterDropdownStyle = computed(() => ({
		transform: isFilterDropdownVisible.value ? 'rotateX(0deg)' : 'rotateX(-90deg)',
		opacity: isFilterDropdownVisible.value ? '1' : '0'
	}));

	/**
	 * 筛选文字颜色样式 - 根据当前排序状态动态变化
	 */
	const filterTextStyle = computed(() => ({
		color: currentSortType.value === '' ? '#fff' : (currentSortType.value === SORT_TYPES.NEW ? '#fff' :
			'#bd9731')
	}));

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

	/**
	 * 生成唯一ID的工具函数
	 * @returns {string} 唯一ID
	 */
	const generateUniqueId = () => {
		return `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
	};

	/**
	 * 初始商品数据 - 使用更规范的数据结构和命名
	 */
	const initialProductData = [{
			id: generateUniqueId(),
			title: '三丽鸥公仔系列',
			price: 6.10, // 使用数字类型，便于排序
			imageUrl: 'https://img1.baidu.com/it/u=1299369810,3742035215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1082',
			createTime: Date.now()
		},
		{
			id: generateUniqueId(),
			title: '全景运动相机',
			price: 2.00,
			imageUrl: 'https://img2.baidu.com/it/u=1455518479,3144936783&fm=253&fmt=auto&app=120&f=PNG?w=500&h=1065',
			createTime: Date.now() + 1
		},
		{
			id: generateUniqueId(),
			title: '富士拍拍',
			price: 28.90,
			imageUrl: 'https://img2.baidu.com/it/u=3360815703,3321978180&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1111',
			createTime: Date.now() + 2
		},
		{
			id: generateUniqueId(),
			title: 'UNiQUE ART雕像',
			price: 15.10,
			imageUrl: 'https://img0.baidu.com/it/u=3700946987,2207883969&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1114',
			createTime: Date.now() + 3
		},
		{
			id: generateUniqueId(),
			title: '少女乐队的呐喊',
			price: 12.00,
			imageUrl: 'https://img1.baidu.com/it/u=894955063,4138614589&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1083',
			createTime: Date.now() + 4
		},
		{
			id: generateUniqueId(),
			title: '阴阳师',
			price: 18.80,
			imageUrl: 'https://img0.baidu.com/it/u=3318815481,675612407&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889',
			createTime: Date.now() + 5
		},
		{
			id: generateUniqueId(),
			title: '胜利女生',
			price: 12.00,
			imageUrl: 'https://img1.baidu.com/it/u=1297405382,3279217087&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1426',
			createTime: Date.now() + 6
		},
		{
			id: generateUniqueId(),
			title: '崩坏：星穹铁道',
			price: 1.90,
			imageUrl: 'https://img2.baidu.com/it/u=3969315328,3300096298&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1091',
			createTime: Date.now() + 7
		},
		{
			id: generateUniqueId(),
			title: 'FuFu大家庭',
			price: 9.90,
			imageUrl: 'https://img0.baidu.com/it/u=1965100551,3593283040&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1081',
			createTime: Date.now() + 8
		},
		{
			id: generateUniqueId(),
			title: '赛博朋克',
			price: 8.80,
			imageUrl: 'https://img2.baidu.com/it/u=3570987437,1081851385&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1083',
			createTime: Date.now() + 9
		},
		{
			id: generateUniqueId(),
			title: '流星花园',
			price: 18.80,
			imageUrl: 'https://img2.baidu.com/it/u=3896495679,3732936033&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889',
			createTime: Date.now() + 10
		},
		{
			id: generateUniqueId(),
			title: '诡秘之主',
			price: 78.80,
			imageUrl: 'https://img0.baidu.com/it/u=1974539446,523763973&fm=253&fmt=auto?w=800&h=1745',
			createTime: Date.now() + 11
		}
	];

	// 商品列表响应式数据
	const productList = ref([...initialProductData]);

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
	const handleSortSelection = (event) => {
		const sortType = event.target.dataset.type;
		console.log(sortType, '排序类型----------------')
		// 如果点击的是当前已选中的排序类型，直接返回
		if (currentSortType.value === sortType) return;

		// 更新当前排序类型
		currentSortType.value = sortType;

		// 根据排序类型对商品进行排序
		if (sortProducts[sortType]) {
			productList.value = sortProducts[sortType](productList.value);
			console.log(`商品已按${getSortTypeName(sortType)}排序`);
		}

		// 排序后隐藏下拉框
		hideFilterDropdown();
	};

	/**
	 * 获取排序类型中文名称
	 * @param {string} sortType - 排序类型
	 * @returns {string} 中文名称
	 */
	const getSortTypeName = (sortType) => {
		const sortNames = {
			[SORT_TYPES.NEW]: '最新发布',
			[SORT_TYPES.PRICE_DESC]: '价格从高到低',
			[SORT_TYPES.PRICE_ASC]: '价格从低到高'
		};
		return sortNames[sortType] || '未知排序';
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

	// ==================== 轮播图数据配置 ====================
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
	const isScrollMask = ref(false); // 滚动蒙层位置
	/**
	 * 计算导航图标位置 - 优化算法逻辑
	 * @param {number} index - 导航项索引
	 * @returns {number} top位置值
	 */
	const calculateNavigationItemTop = (index) => {
		return isNavigationFixed.value ? 20 : (index % 2 === 0 ? 30 : 10);
	};

	/**
	 * 处理页面滚动事件 - 优化滚动性能
	 */

	// 修正：确保isScrollMask在scrollTop变化时能及时更新
	const scrollTop = ref(0);

	const scrollMask = computed(() => {
		return scrollTop.value >= 150;
	});

	// 在handleContentScroll中同步更新scrollTop和isScrollMask
	const handleContentScroll = throttle((event) => {
		scrollTop.value = event.detail.scrollTop;
		isNavigationFixed.value = scrollTop.value > SCROLL_THRESHOLD;
		isScrollMask.value = scrollTop.value >= 150;
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
		console.log(`导航点击: ${navigationPath}`);
		// TODO: 实现具体的导航跳转逻辑
	};

	/**
	 * 处理福利卡片点击事件
	 * @param {Object} welfareItem - 福利卡片数据
	 */
	const handleWelfareCardClick = (welfareItem) => {
		console.log(`福利卡片点击: ${welfareItem.title}`);
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


	// ==================== 生命周期函数 ====================
	/**
	 * 组件挂载完成后的初始化操作
	 */
	onMounted(() => {
		initializeComponent();
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
			.selectAll('.navigation-item')
			.boundingClientRect((data) => {
				if (data && data.length > 0) {
					navigationHeight.value = data[0].height;
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
	.navigation-section {
		width: 100%;
		height: 220rpx;
		display: flex;
		position: fixed;
		top: 0;
		left: 0;

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

	/* #endif */
	/* endif*/



	.navigation-item {
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.navigation-icon {
		position: absolute;
		height: 140rpx;
		width: 140rpx;
		transition: all 0.3s ease;
		cursor: pointer;

		&:active {
			transform: scale(0.9); // 点击反馈
		}
	}

	// ==================== 福利卡片区域样式 ====================
	.welfare-section {
		width: 100vw;
		height: 28vw;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		padding-top: 20rpx;
	}

	.welfare-card {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		position: relative;
		cursor: pointer;
		transition: transform 0.3s ease;

		&:active {
			transform: scale(0.95);
		}
	}

	// ==================== DIY卡片样式 ====================
	.welfare-bg-diy {
		width: 180rpx;
		height: 160rpx;
		border: 8rpx solid #b3d3ff;
		background-color: #67a3f7;
		transform: skewX(-15deg);
		border-radius: 15px;
		position: relative;
		left: 20rpx;

		// DIY卡片左侧阴影效果
		&::before {
			content: '';
			width: 180rpx;
			height: 160rpx;
			position: absolute;
			left: -35rpx;
			top: -8rpx;
			border-left: 8rpx solid #b3d3ff;
			border-top: 8rpx solid #b3d3ff;
			border-bottom: 8rpx solid #b3d3ff;
			background-color: #67a3f7;
			transform: skewX(15deg);
			border-radius: 30rpx 0 15rpx 30rpx;
			z-index: -2;
		}
	}

	// ==================== 专属福利卡片样式 ====================
	.welfare-bg-exclusive {
		width: 220rpx;
		height: 160rpx;
		background-color: #ed776f;
		transform: skewX(-15deg);
		border: 8rpx solid #ffb3ae;
		border-radius: 30rpx;
	}

	.welfare-content-exclusive {
		position: relative;
		padding: 0 18rpx;
	}

	// ==================== ROLL房卡片样式 ====================
	.welfare-bg-roll {
		width: 180rpx;
		height: 160rpx;
		border: 8rpx solid #9d8bee;
		background-color: #715dc9;
		transform: skewX(-15deg);
		border-radius: 15px;
		position: relative;
		left: -15rpx;

		// ROLL卡片右侧阴影效果
		&::before {
			content: '';
			position: absolute;
			width: 160rpx;
			height: 100%;
			right: -32rpx;
			top: -8rpx;
			border-right: 8rpx solid #9d8bee;
			border-top: 8rpx solid #9d8bee;
			border-bottom: 8rpx solid #9d8bee;
			background-color: #715dc9;
			border-radius: 0rpx 30rpx 30rpx 0rpx;
			transform: skewX(15deg);
			z-index: -1;
		}
	}

	// ==================== 福利卡片内容样式 ====================
	.welfare-content {
		position: absolute;
		left: -10rpx;
		top: 5rpx;
		width: 220rpx;
		height: 180rpx;
		border-radius: 15px;
		display: flex;
		transform: skewX(-15deg);
		flex-direction: column;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	// DIY卡片背景文字
	.welfare-content-diy::before {
		content: 'DIY';
		position: absolute;
		top: -20rpx;
		left: 50rpx;
		text-shadow: none;
		font-weight: bold;
		font-family: 'stkaiti';
		color: white;
		font-size: 60rpx;
		transform: scale(1.6);
		letter-spacing: 5rpx;
		text-transform: uppercase;
		opacity: 0.2;
	}

	// 专属福利卡片背景文字
	.welfare-content-exclusive::after {
		content: 'ZHUANSHU';
		position: absolute;
		top: -20rpx;
		left: 100rpx;
		text-shadow: none;
		font-weight: bold;
		font-family: 'stkaiti';
		color: white;
		font-size: 60rpx;
		transform: scale(1.4);
		letter-spacing: 5rpx;
		text-transform: uppercase;
		opacity: 0.3;
	}

	// ROLL房卡片背景文字
	.welfare-content-roll::before {
		content: 'Roll';
		position: absolute;
		top: -20rpx;
		left: 60rpx;
		text-shadow: none;
		font-weight: bold;
		font-family: 'stkaiti';
		color: white;
		font-size: 60rpx;
		transform: scale(1.6);
		letter-spacing: 5rpx;
		text-transform: uppercase;
		opacity: 0.2;
	}

	// ==================== 福利卡片标题样式 ====================
	.welfare-title {
		transform: scale(1.5);
		font-family: 'stkaiti';
		color: white;
		font-weight: bold;
		letter-spacing: 2rpx;
		padding: 5rpx 0;
	}

	// 各类卡片标题特殊阴影效果
	.welfare-title-diy {
		text-shadow:
			-1px -1px 0 #246bcf,
			1px -1px 0 #246bcf,
			-1px 1px 0 #246bcf,
			1px 1px 0 #246bcf;
	}

	.welfare-title-exclusive {
		text-shadow:
			-1px -1px 0 red,
			1px -1px 0 red,
			-1px 1px 0 red,
			1px 1px 0 red;
	}

	.welfare-title-roll {
		text-shadow:
			-1px -1px 0 #302756,
			1px -1px 0 #302756,
			-1px 1px 0 #302756,
			1px 1px 0 #302756;
	}

	// ==================== 福利卡片按钮样式 ====================
	.welfare-button {
		height: 40rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		background-color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
		padding: 0rpx 15rpx;
		font-weight: bold;
		letter-spacing: 2rpx;
		transform: skewX(15deg);
		transition: all 0.2s ease;
		cursor: pointer;

		&:active {
			transform: skewX(15deg) scale(0.95);
		}
	}

	.button-text {
		padding-right: 5rpx;
	}

	.button-icon {
		flex-shrink: 0;
	}

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

		.navigation-icon {
			width: 120rpx;
			height: 120rpx;
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