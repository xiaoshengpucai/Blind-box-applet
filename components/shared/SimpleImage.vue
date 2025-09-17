<template>
 <view class="simple-image-container" :style="containerStyle">
    <image
      class="simple-image"
      :lazy-load="true"
      :src="src"
      :mode="mode"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
    />
  </view>
</template>

<script setup>
import { computed } from 'vue';

// ==================== Props定义 ====================
const props = defineProps({
  // 图片地址
  src: {
    type: String,
    required: true
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
  }
});

// ==================== Emits定义 ====================
const emit = defineEmits(['load', 'error']);

// ==================== 计算属性 ====================
/**
 * 容器样式
 */
const containerStyle = computed(() => {
  const width = typeof props.width === 'number' ? `${props.width}rpx` : props.width;
  const height = typeof props.height === 'number' ? `${props.height}rpx` : props.height;
  const borderRadius = typeof props.borderRadius === 'number' ? `${props.borderRadius}rpx` : props.borderRadius;
  console.log('borderRadius', borderRadius);
  
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
  display: 'block'
}));

// ==================== 方法 ====================
/**
 * 处理图片加载成功
 */
const handleLoad = (e) => {
  emit('load', e);
};

/**
 * 处理图片加载失败
 */
const handleError = (e) => {
  console.warn('图片加载失败:', props.src);
  emit('error', e);
};
</script>

<style lang="scss" scoped>
.simple-image-container {
  display: inline-block;
}

.simple-image {
	display: block;
	width: 100%;
	height: 100%;
}
</style>
