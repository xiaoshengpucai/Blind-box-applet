<template>
	<!-- 使用增强版轮播图组件 -->
	<EnhancedSwiper
		:slides="slide"
		:mode="switchModeL"
		:autoplay="autoplay"
		:interval="interval"
		:duration="duration"
		:circular="circular"
		:width="swiperWidth"
		:height="swiperHeight"
		:border-radius="borderRadius"
		:slide-radius="slideRadius"
		:border="borderConfig"
		:show-title="true"
		:title="title"
		:header-icon="headerIcon"
		:show-decorations="true"
		:decorations="decorationIcons"
		:show-controls="true"
		:show-indicators="circular"
		:show-floor="true"
		:floor-dots="10"
		:image-field="imageField"
		:custom-style="customSwiperStyle"
		@change="handleChange"
		@image-load="handleImageLoad"
		@image-error="handleImageError"
	/>
</template>

<script setup>
	import { computed, watch } from 'vue';
	import EnhancedSwiper from '@/components/shared/EnhancedSwiper.vue';

	// ==================== Props定义 ====================
	const props = defineProps({
		slide: {
			type: Array,
			required: true
			// 暂时移除验证器进行调试
		},
		autoplay: {
			type: Boolean,
			default: true
		},
		interval: {
			type: Number,
			default: 3000
		},
		duration: {
			type: Number,
			default: 500
		},
		switchModeL: {
			type: String,
			default: 'slide' // 改为slide模式以显示向左切换效果
		},
		circular: {
			type: Boolean,
			default: true
		},
		indicatorDots: {
			type: Boolean,
			default: true
		}
	});

	// ==================== Emits定义 ====================
	const emit = defineEmits(['change', 'click', 'image-load', 'image-error']);

	// ==================== 配置常量 ====================
	const swiperWidth = '90%';
	const swiperHeight = '350rpx';
	const borderRadius = '0 20rpx 20rpx 20rpx';
	const slideRadius = '20rpx';
	const title = 'RECOMMENDED';
	const headerIcon = 'gift-fill';
	const imageField = 'imageUrl'; // 图片字段名，匹配轮播图数据结构
	
	const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuWKoOi9veS4rS4uLjwvdGV4dD48L3N2Zz4=';
	const errorImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIyNCIgZmlsbD0iI2NjYyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuKdjDwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjY1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+5Zu+54mH5Yqg6L295aSx6LSlPC90ZXh0Pjwvc3ZnPg==';
	
	// 边框配置
	const borderConfig = {
		width: '15rpx',
		color: '#cd4438',
		style: 'solid'
	};
	
	// 装饰图标配置
	const decorationIcons = [
		{
			src: '/static/icon/ice.svg',
			style: {
				position: 'absolute',
				left: '10rpx',
				top: '-20rpx',
				zIndex: 1
			},
			imageStyle: {
				width: '60rpx',
				animation: 'roleAnimation 2s linear infinite'
			}
		},
		{
			src: '/static/icon/aircraft.svg',
			style: {
				position: 'absolute',
				left: '40rpx',
				top: '-20rpx',
				zIndex: 3
			},
			imageStyle: {
				width: '80rpx',
				animation: 'fly 3s linear infinite'
			}
		},
		{
			src: '/static/icon/gost.svg',
			style: {
				position: 'absolute',
				left: '130rpx',
				top: '-10rpx',
				zIndex: 2
			},
			imageStyle: {
				width: '70rpx',
				animation: 'roleAnimation 1.5s linear infinite'
			}
		}
	];
	
	// 自定义轮播图样式
	const customSwiperStyle = computed(() => ({
		marginLeft: '40rpx',
		marginRight: '24rpx'
	}));

	// ==================== 事件处理方法 ====================
	/**
	 * 处理轮播图切换事件
	 * @param {Object} data - 切换数据
	 */
	const handleChange = (data) => {
		// console.log('Swiper change event:', data);
		emit('change', data);
	};

	/**
	 * 处理幻灯片点击事件
	 * @param {Object} data - 点击数据
	 */
	// const handleSlideClick = (data) => {
	// 	console.log(data,'handleSlideClick');
	// 	emit('click', data);
	// };

	/**
	 * 处理图片加载成功事件
	 * @param {Object} data - 加载数据
	 */
	const handleImageLoad = (data) => {
		emit('image-load', data);
	};

	/**
	 * 处理图片加载失败事件
	 * @param {Object} data - 错误数据
	 */
	const handleImageError = (data) => {
		console.warn('轮播图图片加载失败:', data);
		emit('image-error', data);
	};

	// ==================== 调试信息 ====================
	/**
	 * 输出调试信息
	 */
	// console.log('轮播图组件初始化:', {
	// 	slideData: props.slide,
	// 	slideCount: props.slide?.length,
	// 	imageField: imageField,
	// 	firstImageUrl: props.slide?.[0]?.[imageField] || props.slide?.[0]?.imageUrl,
	// 	rawSlideData: JSON.stringify(props.slide),
	// 	propsType: typeof props.slide,
	// 	isArray: Array.isArray(props.slide),
	// 	config: {
	// 		switchModeL: props.switchModeL,
	// 		circular: props.circular,
	// 		autoplay: props.autoplay
	// 	}
	// });

	// 监听props变化
	watch(() => props.slide, (newSlide) => {
	}, { immediate: true, deep: true });
</script>

<style lang="scss" scoped>
	/* 
	 * 增强版轮播图组件包装器样式
	 * 原有的复杂样式已迁移到 EnhancedSwiper 组件中
	 */
	
	/* 如果需要对包装器进行额外的样式调整，可以在这里添加 */
</style>