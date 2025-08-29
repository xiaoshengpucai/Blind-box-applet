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
      <view 
        v-for="(decoration, index) in decorations"
        :key="index"
        class="decoration-item"
        :style="decoration.style"
      >
        <image 
          :src="decoration.src" 
          :style="decoration.imageStyle"
          mode="widthFix"
        />
      </view>
    </view>
    
    <!-- 轮播图主体 -->
    <view 
      class="swiper-main"
      :style="swiperStyle"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseLeave"
    >
      <!-- Slide模式 -->
      <view 
        v-if="mode === 'slide'"
        class="swiper-wrapper"
        :style="{
          transform: dynamicTransform,
          transition: dynamicTransition
        }"
      >
        <view 
          v-for="(slide, index) in displaySlides"
          :key="`slide-${index}`"
          class="swiper-slide"
        >
          <SimpleImage
            :src="getSlideImage(slide)"
            width="100%"
            height="100%"
            :border-radius="slideRadius"
            @load="handleImageLoad(slide, index)"
            @error="handleImageError(slide, index)"
          />
        </view>
      </view>
      
      <!-- Fade模式 -->
      <view v-else-if="mode === 'fade'" class="swiper-wrapper-fade">
        <view 
          v-for="(slide, index) in slides"
          :key="`fade-${index}`"
          class="swiper-slide-fade"
          :class="{ 'active': realIndex === index }"
          :style="{
            opacity: realIndex === index ? 1 : 0,
            transition: `opacity ${duration}ms ease`,
            zIndex: realIndex === index ? 2 : 1
          }"
        >
          <SimpleImage
            :src="getSlideImage(slide)"
            width="100%"
            height="100%"
            :border-radius="slideRadius"
          />
        </view>
      </view>
      
              <!-- 控制按钮 -->
        <view v-if="showControls" class="swiper-controls">
          <button 
            class="control-btn control-prev"
            :style="controlButtonStyle"
            @click.stop="handlePrevClick"
          >
            <up-icon name="arrow-left" color="#fff" size="20"></up-icon>
          </button>
         <button 
            class="control-btn control-next"
            :style="controlButtonStyle"
            @click.stop="handleNextClick"
          >
            <up-icon name="arrow-right" color="#fff" size="20"></up-icon>
          </button>
        </view>
      
      <!-- 指示器 -->
      <view v-if="showIndicators" class="swiper-indicators" :style="indicatorStyle">
        <view 
          v-for="(slide, index) in slides"
          :key="`indicator-${index}`"
          class="indicator-dot"
          :class="{ 'active': realIndex === index }"
          :style="dotStyle"
          @click.stop="() => goToRealIndex(index)"
        ></view>
      </view>
    </view>
    
    <!-- 底部装饰 -->
    <view v-if="showFloor" class="swiper-floor">
      <view 
        v-for="dot in floorDots"
        :key="dot"
        class="floor-dot"
      ></view>
    </view>
  </view>
</template>

<script setup>
import { computed, watch, toRefs } from 'vue';
import { useSwiper } from '@/src/composables/useSwiper';
import { useThrottle } from '@/src/composables/useThrottle';
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
  }
});

// ==================== Emits定义 ====================
const emit = defineEmits([
  'change',
  'click', 
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
} = useSwiper({
  slides: toRefs(props).slides,
  autoplay: props.autoplay,
  interval: props.interval,
  duration: props.duration,
  circular: props.circular,
  switchMode: props.mode
});

// ==================== 节流处理 ====================
const throttledNext = useThrottle(next, 300);
const throttledPrev = useThrottle(prev, 300);

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
  const borderRadius = typeof props.borderRadius === 'number' 
    ? `${props.borderRadius}rpx` 
    : props.borderRadius;
    
  return {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius,
    border: `${props.border.width} ${props.border.style} ${props.border.color}`,
    backgroundColor: props.border.color
  };
});

/**
 * 控制按钮样式
 */
const controlButtonStyle = computed(() => ({
  width: '60rpx',
  height: '60rpx',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
}));

/**
 * 指示器点样式
 */
const dotStyle = computed(() => ({
  width: '40rpx',
  height: '15rpx',
  borderRadius: '25rpx',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  margin: '0 10rpx',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
}));

/**
 * 是否可以向前
 */
// const canGoPrev = computed(() => {
//   const result = props.circular || realIndex.value > 0;
//   console.log('canGoPrev计算', {
//     circular: props.circular,
//     realIndex: realIndex.value,
//     result,
//     slidesLength: props.slides?.length || 0
//   });
//   return result;
// });

/**
 * 是否可以向后
 */
// const canGoNext = computed(() => {
//   return props.circular || realIndex.value < props.slides.length - 1;
// });

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
// const handleSlideClick = (slide, index) => {
//   console.log('-------handleSlideClick', { slide, index, realIndex: realIndex.value });
//   emit('click', {
//     slide,
//     index: props.mode === 'slide' ? realIndex.value : index, // 使用真实索引
//     realIndex: realIndex.value
//   });
// };

/**
 * 处理图片加载成功
 * @param {Object} slide - 幻灯片数据
 * @param {number} index - 索引
 */
const handleImageLoad = (slide, index) => {
  emit('image-load', { slide, index });
};

/**
 * 处理图片加载失败
 * @param {Object} slide - 幻灯片数据
 * @param {number} index - 索引
 */
const handleImageError = (slide, index) => {
  emit('image-error', { slide, index });
};

/**
 * 处理上一张按钮点击
 */
const handlePrevClick = () => {
  console.log("------prev button clicked, isTransitioning:", isTransitioning.value);
  // 直接调用prev方法，不使用节流
  prev();
};

/**
 * 处理下一张按钮点击
 */
const handleNextClick = () => {
  console.log("------next button clicked, isTransitioning:", isTransitioning.value);
  // 直接调用next方法，不使用节流
  next();
};

/**
 * 调试方法：手动重置状态
 */
const debugResetState = () => {
  console.log('Debug: manually resetting transition state');
  resetTransitionState();
};

/**
 * 鼠标事件处理（桌面端支持）
 */
const handleMouseDown = (e) => {
  handleTouchStart({
    touches: [{ clientX: e.clientX }]
  });
};

const handleMouseMove = (e) => {
  handleTouchMove({
    touches: [{ clientX: e.clientX }]
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
}

// 头部标题区域
.swiper-header {
  display: flex;
  align-self: flex-start;
  align-items: center;
  width: 65%;
  height: 40rpx;
  background-color: #cd4438;
  margin-left: 24rpx;
  margin-bottom: -7px;
  border: 6px solid #cd4438;
  border-bottom: 0;
  border-radius: 30rpx 30rpx 0 0;
  z-index: 10;
  
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
  z-index: 50; // 降低装饰图标的层级
  overflow: visible;
  pointer-events: none; // 确保装饰图标不会阻止点击
  
  .decoration-item {
    position: absolute;
    
    &:nth-child(1) image {
      width: 60rpx;
      left: 10rpx;
      top: 30rpx;
      z-index: 1;
      animation: roleAnimation 2s linear infinite;
    }
    
    &:nth-child(2) image {
      width: 100rpx;
      left: 40rpx;
      top: 25rpx;
      z-index: 3;
      animation: fly 3s linear infinite;
    }
    
    &:nth-child(3) image {
      width: 70rpx;
      left: 130rpx;
      top: 20rpx;
      z-index: 2;
      animation: roleAnimation 1.5s linear infinite;
    }
  }
}

// 轮播图主体
.swiper-main {
  position: relative;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
}

.swiper-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  will-change: transform; // 优化GPU加速
  
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
    
    &.active {
      animation: fadeIn 0.5s ease-in-out;
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
  justify-content: space-between;
  align-items: center;
  padding: 0 10rpx;
  pointer-events: none;
  z-index: 100; // 提高层级
  
  .control-btn {
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
    &.active {
      background-color: #cd4438;
      transform: scale(1.2);
    }
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.6);
    }
  }
}

// 底部装饰
.swiper-floor {
  position: absolute;
  bottom: -20rpx;
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
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fly {
  0% { transform: scale(-1, 1) translateX(0) translateY(0); }
  50% { transform: scale(-1, 1) translateX(-20%) translateY(-20rpx); }
  100% { transform: scale(-1, 1) translateX(0); }
}

@keyframes roleAnimation {
  0% { transform: rotate(0); }
  50% { transform: rotate(-20deg); }
  100% { transform: rotate(0); }
}

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
    }
  }
}
</style>
