<template>
  <view class="lazy-image-container" :style="containerStyle">
    <!-- 图片元素 -->
    <image
      ref="imageRef"
      class="lazy-image"
      :class="imageClasses"
      :src="props.enableLazyLoad ? (loaded.value ? props.src : props.placeholder) : props.src"
      :mode="mode"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
      :lazy-load="enableLazyLoad"
    />
    
    <!-- 加载中状态 -->
    <view v-if="loading && showLoading" class="lazy-image-loading" :style="loadingStyle">
      <slot name="loading">
        <view class="loading-spinner"></view>
        <text v-if="loadingText" class="loading-text">{{ loadingText }}</text>
      </slot>
    </view>
    
    <!-- 错误状态 -->
    <view v-if="error && showError" class="lazy-image-error" :style="errorStyle" @click="handleRetry">
      <slot name="error" :retry="handleRetry">
        <view class="error-icon">❌</view>
        <text class="error-text">{{ errorText }}</text>
        <text v-if="enableRetry" class="retry-text">点击重试</text>
      </slot>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useLazyLoad } from '@/src/composables/useLazyLoad';

// ==================== Props定义 ====================
const props = defineProps({
  // 图片地址
  src: {
    type: String,
    required: true
  },
  
  // 占位图地址
  placeholder: {
    type: String,
    default: ''
  },
  
  // 错误图地址
  errorImage: {
    type: String,
    default: ''
  },
  
  // 图片模式
  mode: {
    type: String,
    default: 'aspectFill',
    validator: (value) => [
      'scaleToFill', 'aspectFit', 'aspectFill', 'widthFix', 'heightFix', 'top', 'bottom', 'center',
      'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'
    ].includes(value)
  },
  
  // 容器宽度
  width: {
    type: [String, Number],
    default: '100%'
  },
  
  // 容器高度
  height: {
    type: [String, Number],
    default: '200rpx'
  },
  
  // 圆角
  borderRadius: {
    type: [String, Number],
    default: '0'
  },
  
  // 是否启用懒加载
  enableLazyLoad: {
    type: Boolean,
    default: true
  },
  
  // 是否启用重试
  enableRetry: {
    type: Boolean,
    default: true
  },
  
  // 最大重试次数
  maxRetries: {
    type: Number,
    default: 3
  },
  
  // 是否显示加载状态
  showLoading: {
    type: Boolean,
    default: true
  },
  
  // 是否显示错误状态
  showError: {
    type: Boolean,
    default: true
  },
  
  // 加载文案
  loadingText: {
    type: String,
    default: ''
  },
  
  // 错误文案
  errorText: {
    type: String,
    default: '图片加载失败'
  },
  
  // 自定义类名
  customClass: {
    type: String,
    default: ''
  },
  
  // 观察器配置
  observerOptions: {
    type: Object,
    default: () => ({
      threshold: 0.1,
      rootMargin: '50px'
    })
  }
});

// ==================== Emits定义 ====================
const emit = defineEmits(['load', 'error', 'retry']);

// ==================== 引用和状态 ====================
const imageRef = ref(null);
console.log(props.src,'-=-=-=-=-=-=-=-=-=-=-=-=-=');
// 使用懒加载Hook
const {
  loading,
  loaded,
  error,
  currentSrc,
  retryCount,
  load,
  retry,
  reset,
  observe,
  unobserve
} = useLazyLoad({
  placeholder: props.placeholder,
  errorImage: props.errorImage,
  enableRetry: props.enableRetry,
  maxRetries: props.maxRetries,
  ...props.observerOptions
});

// ==================== 计算属性 ====================
/**
 * 显示的图片地址
 */
const displaySrc = computed(() => {
  if (error.value && props.errorImage) {
    return props.errorImage;
  }
  return currentSrc.value || props.placeholder;
});

/**
 * 容器样式
 */
const containerStyle = computed(() => {
  const width = typeof props.width === 'number' ? `${props.width}rpx` : props.width;
  const height = typeof props.height === 'number' ? `${props.height}rpx` : props.height;
  const borderRadius = typeof props.borderRadius === 'number' ? `${props.borderRadius}rpx` : props.borderRadius;
  
  return {
    width,
    height,
    borderRadius,
    overflow: 'hidden',
    position: 'relative'
  };
});

/**
 * 图片样式
 */
const imageStyle = computed(() => ({
  width: '100%',
  height: '100%',
  opacity: loaded.value ? 1 : 0,
  transition: 'opacity 0.3s ease-in-out'
}));

/**
 * 图片类名
 */
const imageClasses = computed(() => [
  'lazy-image',
  {
    'lazy-image-loaded': loaded.value,
    'lazy-image-loading': loading.value,
    'lazy-image-error': error.value
  },
  props.customClass
]);

/**
 * 加载状态样式
 */
const loadingStyle = computed(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f5f5f5',
  zIndex: 1
}));

/**
 * 错误状态样式
 */
const errorStyle = computed(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f0f0f0',
  cursor: props.enableRetry ? 'pointer' : 'default',
  zIndex: 2
}));

// ==================== 方法 ====================
/**
 * 处理图片加载成功
 */
const handleLoad = () => {
  loading.value = false;
  loaded.value = true;
  error.value = false;
  emit('load');
};

/**
 * 处理图片加载失败
 */
const handleError = () => {
  loading.value = false;
  error.value = true;
  
  if (props.enableRetry && retryCount.value < props.maxRetries) {
    retryCount.value++;
    setTimeout(() => {
      // 重试加载
      loading.value = true;
      error.value = false;
    }, 1000 * retryCount.value);
  }
  
  emit('error');
};

/**
 * 处理重试
 */
const handleRetry = () => {
  if (!props.enableRetry) return;
  
  retry(props.src);
  emit('retry', retryCount.value);
};

/**
 * 初始化懒加载
 */
const initLazyLoad = () => {
  if (!props.enableLazyLoad) {
    // 不启用懒加载，直接设置为已加载状态
    loaded.value = true;
    return;
  }
  
  // 对于uni-app，我们使用原生的lazy-load属性
  // 这里主要是设置初始状态
  loading.value = true;
  
  // 如果支持IntersectionObserver，尝试使用
  if (typeof window !== 'undefined' && window.IntersectionObserver) {
    nextTick(() => {
      try {
        if (imageRef.value) {
          observe(imageRef.value, props.src);
        } else {
          // 如果无法获取ref，使用uni-app原生懒加载
          setTimeout(() => {
            loaded.value = true;
            loading.value = false;
          }, 100);
        }
      } catch (error) {
        console.warn('LazyImage: IntersectionObserver初始化失败，使用原生懒加载');
        setTimeout(() => {
          loaded.value = true;
          loading.value = false;
        }, 100);
      }
    });
  } else {
    // 不支持IntersectionObserver，直接使用uni-app原生懒加载
    setTimeout(() => {
      loaded.value = true;
      loading.value = false;
    }, 100);
  }
};

// ==================== 监听器 ====================
/**
 * 监听图片地址变化
 */
watch(() => props.src, (newSrc, oldSrc) => {
  if (newSrc !== oldSrc) {
    reset();
    unobserve();
    
    if (newSrc) {
      initLazyLoad();
    }
  }
});

// ==================== 生命周期 ====================
onMounted(() => {
  if (props.src) {
    initLazyLoad();
  }
});

onUnmounted(() => {
  unobserve();
});
</script>

<style lang="scss" scoped>
.lazy-image-container {
  display: inline-block;
  background-color: #f5f5f5;
}

.lazy-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: inherit;
  
  &-loaded {
    animation: fadeIn 0.3s ease-in-out;
  }
}

.lazy-image-loading {
  .loading-spinner {
    width: 40rpx;
    height: 40rpx;
    border: 4rpx solid #e0e0e0;
    border-top: 4rpx solid #1890ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 10rpx;
  }
  
  .loading-text {
    font-size: 24rpx;
    color: #999;
  }
}

.lazy-image-error {
  .error-icon {
    font-size: 48rpx;
    margin-bottom: 10rpx;
  }
  
  .error-text {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 5rpx;
  }
  
  .retry-text {
    font-size: 22rpx;
    color: #1890ff;
    text-decoration: underline;
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

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
