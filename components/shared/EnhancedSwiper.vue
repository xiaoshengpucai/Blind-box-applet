<template>
	<view class="enhanced-swiper" :style="containerStyle">
		<!-- 轮播图标题区域 -->
		<view v-if="showTitle" class="swiper-header" :style="headerStyle">
			<view class="header-icon" v-if="headerIcon">
				<up-icon :name="headerIcon" color="#fff" size="22"></up-icon>
			</view>
			<view class="header-title">
				<text class="title-text">{{ title }}</text>
			</view>
		</view>

		<!-- 装饰图标 -->
		<view v-if="showDecorations" class="decoration-icons">
			<view v-for="(decoration, index) in decorations" :key="index" class="decoration-item"
				:style="decoration.style">
				<image :src="decoration.src" :style="decoration.imageStyle" mode="widthFix" />
			</view>
		</view>

		<!-- 轮播图主体 -->
		<view class="swiper-main" :class="{ 'is-transitioning': isTransitioning }" :style="swiperStyle" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
			@touchend="handleTouchEnd" @mousedown="handleMouseDown" @mousemove="handleMouseMove"
			@mouseup="handleMouseUp" @mouseleave="handleMouseLeave" @handleSlideClick="handleSlideClick">
			<!-- Slide模式 -->
			<view v-if="mode === 'slide'" class="swiper-wrapper" :style="{
				transform: dynamicTransform,
				transition: dynamicTransition
			}">
				<view v-for="(slide, index) in displaySlides" :key="`slide-${index}`" class="swiper-slide" @click="handleSlideClick(slide, index)">
					<SimpleImage :src="getSlideImage(slide)" width="100%" height="100%" :border-radius="slideRadius"
						@load="handleImageLoad(slide, index)" @error="handleImageError(slide, index)" />
				</view>
			</view>

			<!-- Fade模式 -->
			<view v-else-if="mode === 'fade'" class="swiper-wrapper-fade">
				<view v-for="(slide, index) in slides" :key="`fade-${index}`" class="swiper-slide-fade"
					:class="{ 
						'active': realIndex === index,
						'leaving': fadeLeavingIndex === index,
						'entering': fadeEnteringIndex === index
					}" @click="handleSlideClick(slide, index)">
					<SimpleImage :src="getSlideImage(slide)" width="100%" height="100%" :border-radius="slideRadius" />
				</view>
			</view>

			<!-- 控制按钮 -->
			<view v-if="showControls" class="swiper-controls">
				<button class="control-btn control-prev" :style="controlButtonStyle" @click.stop="handlePrevClick">
					<up-icon name="arrow-left" color="#fff" size="20"></up-icon>
				</button>
				<button class="control-btn control-next" :style="controlButtonStyle" @click.stop="handleNextClick">
					<up-icon name="arrow-right" color="#fff" size="20"></up-icon>
				</button>
			</view>

			<!-- 指示器 -->
			<view v-if="showIndicators" class="swiper-indicators" :style="indicatorStyle">
				<view v-for="(slide, index) in slides" :key="`indicator-${index}`" class="indicator-dot"
					:class="{ 'active': realIndex === index }" :style="dotStyle"
					@click.stop="() => goToRealIndex(index)">
					<!-- 调试信息 -->
					<text v-if="realIndex === index" class="debug-text"></text>
				</view>
			</view>
		</view>

		<!-- 底部装饰 -->
		<view v-if="showFloor" class="swiper-floor">
			<view v-for="dot in floorDots" :key="dot" class="floor-dot"></view>
		</view>
	</view>
</template>

<script setup>
import {
	ref,
	computed,
	watch,
	toRefs,
	onMounted
} from 'vue';
import {
	useSwiper
} from '@/src/composables/useSwiper';
import {
	useThrottle
} from '@/src/composables/useThrottle';
import SimpleImage from './SimpleImage.vue';

// ==================== Props定义 ====================
const props = defineProps({
	// 轮播图数据
	slides: {
		type: Array,
		required: true,
		default: () => []
	},

	// 轮播模式
	mode: {
		type: String,
		default: 'slide', // slide | fade
		validator: (value) => ['slide', 'fade'].includes(value)
	},

	// 自动播放
	autoplay: {
		type: Boolean,
		default: true
	},

	// 播放间隔
	interval: {
		type: Number,
		default: 3000
	},

	// 切换时长
	duration: {
		type: Number,
		default: 500
	},

	// 是否循环
	circular: {
		type: Boolean,
		default: true
	},

	// 容器尺寸
	width: {
		type: [String, Number],
		default: '100%'
	},

	height: {
		type: [String, Number],
		default: '400rpx'
	},

	// 轮播图圆角
	borderRadius: {
		type: [String, Number],
		default: '20rpx'
	},

	// 幻灯片圆角
	slideRadius: {
		type: [String, Number],
		default: '20rpx'
	},

	// 边框配置
	border: {
		type: Object,
		default: () => ({
			width: '15rpx',
			color: '#cd4438',
			style: 'solid'
		})
	},

	// 是否显示标题
	showTitle: {
		type: Boolean,
		default: false
	},

	// 标题配置
	title: {
		type: String,
		default: 'RECOMMENDED'
	},

	headerIcon: {
		type: String,
		default: 'gift-fill'
	},

	headerStyle: {
		type: Object,
		default: () => ({})
	},

	// 是否显示装饰图标
	showDecorations: {
		type: Boolean,
		default: false
	},

	decorations: {
		type: Array,
		default: () => []
	},

	// 是否显示控制按钮
	showControls: {
		type: Boolean,
		default: false
	},

	// 是否显示指示器
	showIndicators: {
		type: Boolean,
		default: true
	},

	// 指示器样式
	indicatorStyle: {
		type: Object,
		default: () => ({})
	},

	// 是否显示底部装饰
	showFloor: {
		type: Boolean,
		default: false
	},

	floorDots: {
		type: Number,
		default: 10
	},

	// 占位图
	placeholder: {
		type: String,
		default: ''
	},

	// 错误图
	errorImage: {
		type: String,
		default: ''
	},

	// 是否启用懒加载
	enableLazyLoad: {
		type: Boolean,
		default: true
	},

	// 图片字段映射
	imageField: {
		type: String,
		default: 'src' // src | imageUrl | url
	},

	// 自定义样式
	customStyle: {
		type: Object,
		default: () => ({})
	},
});

// ==================== Emits定义 ====================
const emit = defineEmits([
	'change',
	'click',
	'slide-click',
	'image-load',
	'image-error',
	'autoplay-start',
	'autoplay-stop'
]);
// ==================== 使用轮播图Hook ====================
 	const {
 		currentIndex,
 		realIndex,
 		displaySlides,
 		isTransitioning,
 		transitionStyle,
 		dynamicTransform,
 		dynamicTransition,
 		isDragging,
 		dragOffset,
 		fadeLeavingIndex,
 		fadeEnteringIndex,
 		next,
 		prev,
 		goToRealIndex,
 		resetTransitionState,
 		startAutoplay,
 		stopAutoplay,
 		resetAutoplay,
 		handleTouchStart,
 		handleTouchMove,
 		handleTouchEnd
 	} = useSwiper(props);
 	
 	const prevSlideImage = ref('');

 	// ==================== 节流处理 ====================
const throttledNext = useThrottle(next, 300);
const throttledPrev = useThrottle(prev, 300);
console.log('realIndex', realIndex.value);
// ==================== 计算属性 ====================
/**
 * 容器样式
 */
const containerStyle = computed(() => {
	const width = typeof props.width === 'number' ? `${props.width}rpx` : props.width;
	const height = typeof props.height === 'number' ? `${props.height}rpx` : props.height;

	return {
		width,
		height,
		position: 'relative',
		overflow: 'visible',
		...props.customStyle
	};
});

/**
 * 轮播图主体样式
 */
const swiperStyle = computed(() => {
	const borderRadius = typeof props.borderRadius === 'number' ?
		`${props.borderRadius}rpx` :
		props.borderRadius;

	return {
		'--prev-slide-image': `url(${prevSlideImage.value})`,
		width: '100%',
		height: '100%',
		position: 'relative',
		overflow: 'hidden',
		borderRadius,
		border: `${props.border.width} ${props.border.style} ${props.border.color}`,
		// backgroundColor: props.border.color
	};
});

/**
 * 控制按钮样式
 */
const controlButtonStyle = computed(() => ({
	width: '100rpx',
	height: '100%',
	backgroundColor: 'rgba(0, 0, 0, 0.4)',
	border: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	cursor: 'pointer',
	transition: 'all 0.3s ease'
}));

/**
 * 指示器点样式 - 已移至CSS中定义
 */
const dotStyle = computed(() => ({}));


// ==================== 方法 ====================
/**
 * 获取幻灯片图片
 * @param {Object} slide - 幻灯片数据
 * @returns {string} 图片地址
 */
const getSlideImage = (slide) => {
	if (!slide) return '';
	// 支持多种图片字段
	return slide[props.imageField] ||
		slide.src ||
		slide.imageUrl ||
		slide.url ||
		slide.image || '';
};


/**
 * 跳转到指定幻灯片
 * @param {number} index - 目标索引
 */
const goToSlide = (index) => {
	console.log('goToSlide called with index:', index, 'isTransitioning:', isTransitioning.value);

	// 如果正在过渡中，不执行跳转
	if (isTransitioning.value) {
		console.log('goToSlide blocked by transition');
		return;
	}

	goToRealIndex(index);
	emit('change', {
		current: index,
		slide: props.slides[index]
	});
};

/**
 * 处理幻灯片点击
 * @param {Object} slide - 幻灯片数据
 * @param {number} index - 索引
 */
const handleSlideClick = (slide, index) => {
	emit('slide-click', {
		slide,
		index: props.mode === 'slide' ? realIndex.value : index, // 使用真实索引
		realIndex: realIndex.value
	});
};

/**
 * 处理图片加载成功
 * @param {Object} slide - 幻灯片数据
 * @param {number} index - 索引
 */
const handleImageLoad = (slide, index) => {
	emit('image-load', {
		slide,
		index
	});
};

/**
 * 处理图片加载失败
 * @param {Object} slide - 幻灯片数据
 * @param {number} index - 索引
 */
const handleImageError = (slide, index) => {
	emit('image-error', {
		slide,
		index
	});
};

/**
 * 处理幻灯片切换
 * @param {number} newIndex - 新的索引
 * @param {number} oldIndex - 旧的索引
 */
const handleSlideChange = (newIndex, oldIndex) => {
	emit('change', {
		current: newIndex,
		previous: oldIndex,
		slide: props.slides[newIndex]
	});
};

/**
 * 处理上一张按钮点击
 */
const handlePrevClick = () => {
	const sliderindex =  
	// 直接调用prev方法，不使用节流
	throttledprev();
};

/**
 * 处理下一张按钮点击
 */
const handleNextClick = () => {
	// 直接调用next方法，不使用节流
	throttledNext();
};


/**
 * 鼠标事件处理（桌面端支持）
 */
const handleMouseDown = (e) => {
	handleTouchStart({
		touches: [{
			clientX: e.clientX
		}]
	});
};

const handleMouseMove = (e) => {
	handleTouchMove({
		touches: [{
			clientX: e.clientX
		}]
	});
};

const handleMouseUp = () => {
	handleTouchEnd();
};

const handleMouseLeave = () => {
	handleTouchEnd();
};


// ==================== 监听器 ====================
/**
 * 监听索引变化
 */
watch(realIndex, (newIndex, oldIndex) => {
	if (newIndex !== oldIndex) {
		prevSlideImage.value = getSlideImage(props.slides[oldIndex]);
		emit('change', {
			current: newIndex,
			previous: oldIndex,
			slide: props.slides[newIndex]
		});
	}
});

/**
 * 监听自动播放状态
 */
watch(() => props.autoplay, (autoplay) => {
	if (autoplay) {
		startAutoplay();
		emit('autoplay-start');
	} else {
		stopAutoplay();
		emit('autoplay-stop');
	}
});
</script>

<style lang="scss" scoped>
.enhanced-swiper {
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	z-index: 1;
}

// 头部标题区域
.swiper-header {
	display: flex;
	align-self: flex-start;
	align-items: center;
	width: 65%;
	height: 40rpx;
	background-color: #cd4438;
	margin-left: -15rpx;
	margin-bottom: -7px;
	border: 6px solid #cd4438;
	border-bottom: 0;
	border-radius: 30rpx 30rpx 0 0;
	z-index: 1;

	.header-icon {
		width: 40rpx;
		height: 40rpx;
		padding: 10rpx;
		position: relative;
		top: -5rpx;
		line-height: 40rpx;
	}

	.header-title {
		display: flex;
		line-height: 40rpx;
		padding: 0 20rpx;

		.title-text {
			color: #fff;
			font-size: 28rpx;
			font-weight: bold;
			font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
			font-style: italic;
		}
	}
}

// 装饰图标
.decoration-icons {
	position: absolute;
	top: -10rpx;
	right: 0;
	width: 30%;
	height: 180rpx;
	z-index: 50;
	overflow: visible;
	pointer-events: none;



	.decoration-item {
		position: absolute;

		&:nth-child(1) image {
			width: 60rpx;
			height: 60rpx;
			left: 10rpx;
			top: 30rpx;
			z-index: 1;
		}

		&:nth-child(2) image {
			width: 100rpx;
			height: 100rpx;
			left: 30rpx;
			top: 25rpx;
			z-index: 3;
		}

		&:nth-child(3) image {
			width: 70rpx;
			height: 70rpx;
			left: 10rpx;
			top: 20rpx;
			z-index: 2;
		}
	}
}

/* 微信小程序特定优化 */
/* #ifdef MP-WEIXIN */
.decoration-icons {
	/* 确保在小程序中的正确定位 */
	transform: translateZ(0);
	-webkit-transform: translateZ(0);

	.decoration-item {
		/* 小程序中绝对定位优化 */
		transform: translateZ(0);
		-webkit-transform: translateZ(0);

		image {
			/* 小程序中图片尺寸优化 */
			width: 60rpx !important;
			height: 60rpx !important;
			display: block;
			position: relative;
			top: 20rpx;


			&:nth-child(1) {
				width: 60rpx !important;
				height: 60rpx !important;
			}

			&:nth-child(2) {
				width: 100rpx !important;
				height: 100rpx !important;
				left: -40rpx;
			}

			&:nth-child(3) {
				width: 70rpx !important;
				height: 70rpx !important;
				left: -30rpx;
			}
		}
	}
}

/* #endif */

/* H5端特定优化 */
/* #ifdef H5 */
.decoration-icons {

	/* H5端的特殊处理 */
	.decoration-item {
		image {
			/* H5端图片尺寸优化 */
			object-fit: contain;
		}
	}
}

/* #endif */

// 轮播图主体
.swiper-main {
	position: relative;
	cursor: grab;

	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: var(--prev-slide-image);
		background-size: cover;
		background-position: center;
		opacity: 0.1;
		transition: opacity 1s ease-in-out;
		z-index: 1;
	}

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(255, 255, 255, 0.3);
		opacity: .1;
		transition: opacity 1s ease-in-out;
		z-index: 1;
	}

	&.is-transitioning::before,
	&.is-transitioning::after {
		opacity: 1;
	}

	&:active {
		cursor: grabbing;
	}
}

.swiper-wrapper {
	display: flex;
	width: 100%;
	height: 100%;
	will-change: transform; // 优化GPU加速
	position: relative;
	z-index: 3;

	.swiper-slide {
		flex-shrink: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		backface-visibility: hidden; // 防止闪烁
	}
}

.swiper-wrapper-fade {
	position: relative;
	width: 100%;
	height: 100%;

	.swiper-slide-fade {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		opacity: 0;
		z-index: 1;
		transition: opacity 1s ease;

		&.active {
			opacity: 1;
			z-index: 2;
		}
		
		&.leaving {
			opacity: 0;
			z-index: 2; // 离开时保持在顶层，直到动画结束
		}

		&.entering {
			opacity: 1;
			clip-path: circle(0% at 50% 50%);
			animation: fadecirle 1s ease-in-out forwards;
			z-index: 3; // 进入时在最顶层
		}
	}

	/* 中心展开的蒙版样式 - 从中心开始展开 */
	@keyframes fadecirle {
		0% {
			clip-path: circle(0% at 50% 50%);
		}

		100% {
			clip-path: circle(100% at 50% 50%);
		}
	}
}

// 控制按钮
.swiper-controls {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-evenly;
	align-items: center;
	pointer-events: none;
	z-index: 100; // 提高层级  

	.control-btn.control-prev {
		right: 120rpx;
	}

	.control-btn.control-next {
		left: 120rpx;
	}

	.control-btn {
		width: 60rpx;
		pointer-events: auto;
		z-index: 101; // 确保按钮在最上层
		position: relative; // 确保z-index生效


		&:disabled {
			opacity: 0.3;
			cursor: not-allowed;
		}

		&:hover:not(:disabled) {
			background-color: rgba(0, 0, 0, 0.7);
			transform: scale(1.1);
		}

		// 增加按钮的可点击区域
		&::before {
			content: '';
			position: absolute;
			top: -10rpx;
			left: -10rpx;
			right: -10rpx;
			bottom: -10rpx;
			z-index: -1;
		}
	}
}

// 指示器
.swiper-indicators {
	position: absolute;
	bottom: 20rpx;
	left: 50%;
	transform: translateX(-50%);
	display: flex;
	align-items: center;
	z-index: 10;

	.indicator-dot {
		width: 40rpx;
		height: 15rpx;
		border-radius: 25rpx;
		background-color: rgba(255, 255, 255, 0.3);
		margin: 0 10rpx;
		cursor: pointer;
		transition: all 0.3s ease;

		&.active {
			background-color: #cd4438 !important; // 使用 !important 确保优先级
			transform: scale(1.2);
			box-shadow: 0 0 10rpx rgba(205, 68, 56, 0.5); // 添加发光效果
		}

		&:hover {
			background-color: rgba(255, 255, 255, 0.6);
		}

		// 调试文本样式
		.debug-text {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			color: #fff;
			font-size: 20rpx;
			font-weight: bold;
			pointer-events: none;
		}
	}
}

// 底部装饰
.swiper-floor {
	position: absolute;
	bottom: 2rpx;
	right: 40rpx;
	display: flex;
	gap: 10rpx;
	z-index: 5;

	.floor-dot {
		width: 12rpx;
		height: 12rpx;
		background: rgba(255, 255, 255, 0.4);
		border-radius: 50%;
	}
}

// 动画定义
@keyframes fadeIn {
	from {
		opacity: 0;
	}

	to {
		opacity: 1;
	}
}

@keyframes roleAnimation {
	0% {
		transform: rotate(0deg);
	}

	50% {
		transform: rotate(10deg);
	}

	100% {
		transform: rotate(0deg);
	}
}

// 为装饰元素分配不同的动画延迟（确保小程序和H5端一致性）
.decoration-item:nth-child(1) {
	animation: roleAnimation 1.2s ease-in-out infinite;
	animation-delay: 0s;
}

.decoration-item:nth-child(2) {
	animation: roleAnimation 1.2s ease-in-out infinite;
	animation-delay: 0.15s;
}

.decoration-item:nth-child(3) {
	animation: roleAnimation 1.2s ease-in-out infinite;
	animation-delay: 0.3s;
}

/* 微信小程序动画优化 */
/* #ifdef MP-WEIXIN */
.decoration-item {
	/* 小程序中动画优化 */
	will-change: transform;
	-webkit-backface-visibility: hidden;
	backface-visibility: hidden;

	&:nth-child(1) {
		animation: roleAnimation 1.2s ease-in-out infinite;
		animation-delay: 0s;
	}

	&:nth-child(2) {
		animation: roleAnimation 1.2s ease-in-out infinite;
		animation-delay: 0.15s;
	}

	&:nth-child(3) {
		animation: roleAnimation 1.2s ease-in-out infinite;
		animation-delay: 0.3s;
	}
}

/* #endif */

/* H5端动画优化 */
/* #ifdef H5 */
.decoration-item {
	/* H5端动画优化 */
	will-change: transform;
	backface-visibility: hidden;
}

/* #endif */

// 响应式适配
@media screen and (max-width: 750rpx) {
	.swiper-header {
		width: 80%;
	}

	.decoration-icons {
		width: 40%;
	}

	.swiper-controls {
		padding: 0 10rpx;

		.control-btn {
			width: 50rpx;
			height: 50rpx;
			margin: 0 10rpx;
		}
	}
}

/* 微信小程序响应式优化 */
/* #ifdef MP-WEIXIN */
@media screen and (max-width: 750rpx) {
	.decoration-icons {
		width: 40%;

		.decoration-item {
			image {

				/* 小程序中小屏幕下的尺寸优化 */
				&:nth-child(1) {
					width: 50rpx !important;
					height: 50rpx !important;
				}

				&:nth-child(2) {
					width: 80rpx !important;
					height: 80rpx !important;
				}

				&:nth-child(3) {
					width: 60rpx !important;
					height: 60rpx !important;
				}
			}
		}
	}
}

/* #endif */

/* H5端响应式优化 */
/* #ifdef H5 */
@media screen and (max-width: 750rpx) {
	.decoration-icons {
		width: 40%;

		.decoration-item {
			image {
				/* H5端小屏幕下的尺寸优化 */
				object-fit: contain;
			}
		}
	}
}

/* #endif */


.fade-image-test {
	width: 100%;
	height: 100%;
	position: absolute;
	opacity: 0.3;
	transition: opacity 0.5s ease-in-out;

	&.leaving {
		opacity: 0.3;
	}

	&.entering {
		opacity: 1;
		animation: fadecirle 1s ease-in-out;
		z-index: 2;
	}
}

@keyframes fadecirle {
    0% {
        clip-path: circle(0% at 50% 50%);
    }
    100% {
        clip-path: circle(100% at 50% 50%);
    }
}
</style>