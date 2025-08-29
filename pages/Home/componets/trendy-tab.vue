<template>
	<ProductList
		:products="productList"
		:title="listTitle"
		:layout="listLayout"
		:columns="columns"
		:gap="gap"
		:card-layout="cardLayout"
		:card-size="cardSize"
		:image-config="imageConfig"
		:show-header="showHeader"
		:show-count="showCount"
		:show-rating="showRating"
		:show-description="showDescription"
		:show-extra-info="showExtraInfo"
		:show-actions="showActions"
		:card-actions="cardActions"
		:show-load-more="showLoadMore"
		:show-skeleton="showSkeleton"
		:skeleton-count="skeletonCount"
		:enable-lazy-load="enableLazyLoad"
		:price-prefix="pricePrefix"
		:max-tags="maxTags"
		:empty-text="emptyText"
		:custom-style="listCustomStyle"
		@product-click="handleProductClick"
		@image-load="handleImageLoad"
		@image-error="handleImageError"
		@action-click="handleActionClick"
		@load-more="handleLoadMore"
		@retry="handleRetry"
	/>
</template>

<script setup>
	import { ref, computed, watch, onMounted } from 'vue';
	import ProductList from '@/components/shared/ProductList.vue';
	import api from '@/src/api/product.js';

	// ==================== Props定义 ====================
	const props = defineProps({
		// 商品列表数据（兼容原有的 CarListToChild）
		productList: {
			type: Array,
			default: () => []
		},
		
		// 兼容原有的 props
		CarListToChild: {
			type: Array,
			default: () => []
		},
		
		// 列表配置
		listTitle: {
			type: String,
			default: ''
		},
		
		// 是否显示加载更多
		enableLoadMore: {
			type: Boolean,
			default: false
		},
		
		// 是否自动加载
		autoLoad: {
			type: Boolean,
			default: false
		}
	});

	// ==================== Emits定义 ====================
	const emit = defineEmits(['product-click', 'load-more', 'image-load', 'image-error']);

	// ==================== 状态管理 ====================
	const localProductList = ref([]);
	const loading = ref(false);
	const error = ref(null);

	// ==================== 配置项 ====================
	const listLayout = 'grid';
	const columns = 2;
	const gap = '20rpx';
	const cardLayout = 'vertical';
	const cardSize = 'medium';
	const showHeader = false;
	const showCount = false;
	const showRating = false;
	const showDescription = false;
	const showExtraInfo = false;
	const showActions = false;
	const showLoadMore = props.enableLoadMore;
	const showSkeleton = false;
	const skeletonCount = 6;
	const enableLazyLoad = true;
	const pricePrefix = '¥';
	const maxTags = 3;
	const emptyText = '暂无商品';

	// 图片配置
	const imageConfig = {
		width: '100%',
		height: '360rpx',
		borderRadius: '10rpx'
	};

	// 操作按钮配置
	const cardActions = [];

	// 自定义样式
	const listCustomStyle = {
		backgroundColor: '#eee',
		paddingBottom: '300rpx'
	};

	// ==================== 计算属性 ====================
	/**
	 * 实际显示的商品列表
	 */
	const productList = computed(() => {
		// 优先使用新的 productList，兼容旧的 CarListToChild
		return props.productList.length > 0 
			? props.productList 
			: (props.CarListToChild.length > 0 
				? props.CarListToChild 
				: localProductList.value);
	});

	// ==================== 方法 ====================
	/**
	 * 处理商品点击
	 * @param {Object} product - 商品数据
	 */
	const handleProductClick = (product) => {
		console.log('商品点击:', product);
		
		// 兼容原有的导航逻辑
		const productId = product.id || product.uid;
		if (productId) {
			uni.navigateTo({
				url: `/pages/Home/detail?id=${productId}`
			});
		}
		
		emit('product-click', product);
	};

	/**
	 * 处理图片加载成功
	 * @param {Object} product - 商品数据
	 */
	const handleImageLoad = (product) => {
		emit('image-load', product);
	};

	/**
	 * 处理图片加载失败
	 * @param {Object} product - 商品数据
	 */
	const handleImageError = (product) => {
		console.warn('商品图片加载失败:', product);
		emit('image-error', product);
	};

	/**
	 * 处理操作按钮点击
	 * @param {Object} payload - 操作数据
	 */
	const handleActionClick = (payload) => {
		console.log('操作按钮点击:', payload);
		// 可以根据不同的操作类型执行不同的逻辑
	};

	/**
	 * 处理加载更多
	 * @param {Object} pagination - 分页信息
	 */
	const handleLoadMore = (pagination) => {
		console.log('加载更多:', pagination);
		emit('load-more', pagination);
		
		if (props.autoLoad) {
			loadMoreProducts(pagination);
		}
	};

	/**
	 * 处理重试
	 */
	const handleRetry = () => {
		console.log('重试加载');
		loadProducts();
	};

	/**
	 * 获取壁纸列表（兼容原有API）
	 * @param {Object} params - 查询参数
	 */
	const getWallpaperList = async (params = {}) => {
		try {
			loading.value = true;
			const defaultParams = {
				classid: '65237031189f860b7613acf4',
				pageNum: 1,
				pageSize: 10,
				...params
			};
			
			const result = await api.getWallpaperList(defaultParams);
			
			if (result && Array.isArray(result.data)) {
				localProductList.value = result.data.map(item => ({
					...item,
					// 统一字段映射
					id: item.id || item._id,
					title: item.title || item.Title || item.name,
					price: item.price || 0,
					imageUrl: item.smallPicurl || item.imageUrl || item.url,
					// 添加默认的促销标签
					promotionLabel: '惊喜连连',
					// 添加默认标签
					tags: ['热门', '推荐', '精选'].slice(0, Math.floor(Math.random() * 3) + 1)
				}));
			}
		} catch (err) {
			error.value = err;
			console.error('获取商品列表失败:', err);
		} finally {
			loading.value = false;
		}
	};

	/**
	 * 加载商品列表
	 */
	const loadProducts = () => {
		if (props.autoLoad) {
			getWallpaperList();
		}
	};

	/**
	 * 加载更多商品
	 * @param {Object} pagination - 分页信息
	 */
	const loadMoreProducts = async (pagination) => {
		try {
			loading.value = true;
			const result = await api.getWallpaperList({
				classid: '65237031189f860b7613acf4',
				pageNum: pagination.page,
				pageSize: pagination.pageSize
			});
			
			if (result && Array.isArray(result.data)) {
				const newProducts = result.data.map(item => ({
					...item,
					id: item.id || item._id,
					title: item.title || item.Title || item.name,
					price: item.price || 0,
					imageUrl: item.smallPicurl || item.imageUrl || item.url,
					promotionLabel: '惊喜连连',
					tags: ['热门', '推荐', '精选'].slice(0, Math.floor(Math.random() * 3) + 1)
				}));
				
				localProductList.value.push(...newProducts);
			}
		} catch (err) {
			error.value = err;
			console.error('加载更多商品失败:', err);
		} finally {
			loading.value = false;
		}
	};

	// ==================== 监听器 ====================
	/**
	 * 监听 CarListToChild 变化（兼容原有逻辑）
	 */
	watch(() => props.CarListToChild, (newList) => {
		if (newList && newList.length > 0) {
			// 将原有数据格式转换为新格式
			localProductList.value = newList.map(item => ({
				...item,
				id: item.id || `${Date.now()}_${Math.random()}`,
				title: item.Title || item.title,
				imageUrl: item.smallPicurl || item.imageUrl,
				promotionLabel: '惊喜连连',
				tags: ['热门', '推荐', '精选'].slice(0, Math.floor(Math.random() * 3) + 1)
			}));
		}
	}, { immediate: true });

	// ==================== 生命周期 ====================
	onMounted(() => {
		loadProducts();
	});

	// ==================== 暴露方法 ====================
	defineExpose({
		loadProducts,
		getWallpaperList,
		productList: localProductList
	});
</script>

<style lang="scss" scoped>
	/*
	 * 商品列表组件包装器样式
	 * 原有的复杂样式已迁移到 ProductList 和 ProductCard 组件中
	 */
	
	/* 如果需要对包装器进行额外的样式调整，可以在这里添加 */
</style>