<template>
  <view class="uni-lazy-image-container" :style="containerStyle">
    <!-- 图片元素 -->
   <image
      class="uni-lazy-image"
      :class="imageClasses"
      :src="imageSrc"
      :mode="mode"
      :style="imageStyle"
      :lazy-load="enableLazyLoad"
      @load="handleLoad"
      @error="handleError"
    />
   
    <!-- 加载中状态 -->
    <view v-if="isLoading && showLoading" class="loading-overlay" :style="loadingStyle">
      <slot name="loading">
        <view class="loading-spinner"></view>
        <text v-if="loadingText" class="loading-text">{{ loadingText }}</text>
      </slot>
    </view>
    
    <!-- 错误状态 -->
    <view v-if="hasError && showError" class="error-overlay" :style="errorStyle" @click="handleRetry">
      <slot name="error" :retry="handleRetry">
        <view class="error-icon">❌</view>
        <text class="error-text">{{ errorText }}</text>
        <text v-if="enableRetry" class="retry-text">点击重试</text>
      </slot>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

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
    default: 'aspectFill'
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
  }
});

// ==================== Emits定义 ====================
const emit = defineEmits(['load', 'error', 'retry']);

// ==================== 状态管理 ====================
const isLoading = ref(false); // 初始不显示加载状态
const isLoaded = ref(false);
const hasError = ref(false);
const retryCount = ref(0);

// ==================== 计算属性 ====================
/**
 * 实际显示的图片地址
 */
const imageSrc = computed(() => {
  // 如果有错误且提供了错误图片，显示错误图片
  if (hasError.value && props.errorImage) {
    return props.errorImage;
  }
  
  // 如果正在加载且提供了占位图，显示占位图
  if (isLoading.value && props.placeholder && !props.enableLazyLoad) {
    return props.placeholder;
  }
  
  // 否则显示原图片地址（uni-app的lazy-load会自动处理）
  return props.src;
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
    position: 'relative',
    backgroundColor: '#f5f5f5'
  };
});

/**
 * 图片样式
 */
const imageStyle = computed(() => ({
  width: '100%',
  height: '100%',
  opacity: isLoaded.value ? 1 : (props.placeholder ? 1 : 0),
  transition: 'opacity 0.3s ease-in-out'
}));

/**
 * 图片类名
 */
const imageClasses = computed(() => [
  'uni-lazy-image',
  {
    'uni-lazy-image-loaded': isLoaded.value,
    'uni-lazy-image-loading': isLoading.value,
    'uni-lazy-image-error': hasError.value
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
  backgroundColor: 'rgba(245, 245, 245, 0.8)',
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
  backgroundColor: 'rgba(240, 240, 240, 0.9)',
  cursor: props.enableRetry ? 'pointer' : 'default',
  zIndex: 2
}));

// ==================== 方法 ====================
/**
 * 处理图片加载成功
 */
const handleLoad = () => {
  isLoading.value = false;
  isLoaded.value = true;
  hasError.value = false;
  retryCount.value = 0;
  emit('load');
};

/**
 * 处理图片加载失败
 */
const handleError = () => {
  isLoading.value = false;
  hasError.value = true;
  
  if (props.enableRetry && retryCount.value < props.maxRetries) {
    // 自动重试
    setTimeout(() => {
      retryCount.value++;
      isLoading.value = true;
      hasError.value = false;
    }, 1000 * retryCount.value);
  }
  
  emit('error');
};

/**
 * 手动重试
 */
const handleRetry = () => {
  if (!props.enableRetry || retryCount.value >= props.maxRetries) return;
  
  retryCount.value++;
  isLoading.value = true;
  hasError.value = false;
  
  emit('retry', retryCount.value);
};

/**
 * 重置状态
 */
const reset = () => {
  isLoading.value = true;
  isLoaded.value = false;
  hasError.value = false;
  retryCount.value = 0;
};

// ==================== 监听器 ====================
/**
 * 监听图片地址变化
 */
watch(() => props.src, (newSrc, oldSrc) => {
  if (newSrc !== oldSrc && newSrc) {
    reset();
  }
});

// ==================== 暴露方法 ====================
defineExpose({
  reset,
  retry: handleRetry,
  isLoading: () => isLoading.value,
  isLoaded: () => isLoaded.value,
  hasError: () => hasError.value
});
</script>

<style lang="scss" scoped>
.uni-lazy-image-container {
  display: inline-block;
  background-color: #f5f5f5;
}

.uni-lazy-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: inherit;
  
  &-loaded {
    animation: fadeIn 0.3s ease-in-out;
  }
}

.loading-overlay {
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

.error-overlay {
  .error-icon {
    font-size: 48rpx;
    margin-bottom: 10rpx;
  }
  
  .error-text {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 5rpx;
    text-align: center;
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
