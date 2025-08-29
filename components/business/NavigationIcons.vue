<template>
  <view 
    class="navigation-container" 
    :style="navigationStyle"
    @touchmove.stop.prevent="() => {}"
  >
    <view 
      v-for="(navItem, index) in navigationList"
      :key="navItem.id"
      class="navigation-item"
      :class="navigationItemClasses(index)"
      :style="navigationItemStyle(index)"
      @click="handleNavigationClick(navItem)"
    >
      <image 
        class="navigation-icon"
        :src="navItem.src"
        :alt="navItem.text"
        mode="aspectFit"
        lazy-load
        @load="handleImageLoad(navItem, index)"
        @error="handleImageError(navItem, index)"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue';

// ==================== Props定义 ====================
const props = defineProps({
  // 导航列表数据
  navigationList: {
    type: Array,
    required: true,
    default: () => []
  },
  
  // 状态栏高度
  statusBarHeight: {
    type: Number,
    default: 0
  },
  
  // 是否固定在顶部
  isFixed: {
    type: Boolean,
    default: false
  },
  
  // 滚动阈值
  scrollThreshold: {
    type: Number,
    default: 500
  },
  
  // 容器高度
  containerHeight: {
    type: [String, Number],
    default: '220rpx'
  },
  
  // 图标尺寸
  iconSize: {
    type: Object,
    default: () => ({
      width: '140rpx',
      height: '140rpx'
    })
  },
  
  // 是否启用浮动动画
  enableFloatAnimation: {
    type: Boolean,
    default: true
  },
  
  // 动画延迟配置
  animationDelay: {
    type: Number,
    default: 0.2 // 每个图标的动画延迟间隔（秒）
  },
  
  // 自定义样式
  customStyle: {
    type: Object,
    default: () => ({})
  }
});

// ==================== Emits定义 ====================
const emit = defineEmits([
  'navigation-click',
  'image-load', 
  'image-error',
  'height-change'
]);

// ==================== 状态管理 ====================
const componentInstance = ref(null);
const navigationHeight = ref(0);
const isNavigationFixed = ref(false);

// ==================== 计算属性 ====================
/**
 * 导航容器样式
 */
const navigationStyle = computed(() => {
  const height = typeof props.containerHeight === 'number' 
    ? `${props.containerHeight}rpx` 
    : props.containerHeight;
    
  return {
    width: '100%',
    height,
    display: 'flex',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 10,
    marginTop: `${props.statusBarHeight}px`,
    ...props.customStyle
  };
});

/**
 * 导航项类名
 * @param {number} index - 索引
 * @returns {Array} 类名数组
 */
const navigationItemClasses = (index) => {
  const classes = [
    'navigation-item',
    `nav-item-${index}`
  ];
  
  if (props.enableFloatAnimation) {
    classes.push('animate-float');
  }
  
  return classes;
};

/**
 * 导航项样式
 * @param {number} index - 索引
 * @returns {Object} 样式对象
 */
const navigationItemStyle = (index) => {
  return {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    top: `${calculateNavigationItemTop(index)}px`,
    animationDelay: `${index * props.animationDelay}s`
  };
};

// ==================== 方法 ====================
/**
 * 计算导航图标位置
 * @param {number} index - 导航项索引
 * @returns {number} top位置值
 */
const calculateNavigationItemTop = (index) => {
  if (props.isFixed || isNavigationFixed.value) {
    return 20;
  } else {
    // 偶数索引和奇数索引的错位效果
    return index % 2 === 0 ? 30 : 10;
  }
};

/**
 * 处理导航点击
 * @param {Object} navItem - 导航项数据
 */
const handleNavigationClick = (navItem) => {
  emit('navigation-click', navItem);
};

/**
 * 处理图片加载成功
 * @param {Object} navItem - 导航项数据
 * @param {number} index - 索引
 */
const handleImageLoad = (navItem, index) => {
  emit('image-load', { navItem, index });
};

/**
 * 处理图片加载失败
 * @param {Object} navItem - 导航项数据
 * @param {number} index - 索引
 */
const handleImageError = (navItem, index) => {
  console.warn(`导航图标加载失败: ${navItem.text}`, navItem.src);
  emit('image-error', { navItem, index });
};

/**
 * 计算导航栏高度
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
        const newHeight = data[0].bottom;
        if (newHeight !== navigationHeight.value) {
          navigationHeight.value = newHeight;
          emit('height-change', newHeight);
        }
      }
    })
    .exec();
};

/**
 * 更新固定状态
 * @param {boolean} fixed - 是否固定
 */
const updateFixedState = (fixed) => {
  isNavigationFixed.value = fixed;
};

// ==================== 生命周期 ====================
onMounted(() => {
  componentInstance.value = getCurrentInstance()?.proxy;
  
  // 延迟计算高度，确保DOM渲染完成
  setTimeout(() => {
    calculateNavigationHeight();
  }, 100);
});

onUnmounted(() => {
  // 清理工作
});

// ==================== 暴露方法 ====================
defineExpose({
  updateFixedState,
  calculateNavigationHeight,
  navigationHeight: () => navigationHeight.value
});
</script>

<style lang="scss" scoped>
// ==================== 导航容器 ====================
.navigation-container {
  // 样式已在计算属性中定义
}

.navigation-item {
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
}

.navigation-icon {
  position: absolute;
  height: 140rpx;
  width: 140rpx;
  transition: all 0.3s ease;
  cursor: pointer;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);

  &:active {
    transform: scale(0.9);
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  }
}

// ==================== 浮动动画 ====================
/**
 * 浮动动画 - 为导航图标添加生动效果
 */
@keyframes float {
  0%, 100% {
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
  
  // 为不同的导航项添加不同的动画时长，增加自然感
  &.nav-item-0 {
    animation-duration: 3s;
  }
  
  &.nav-item-1 {
    animation-duration: 2.5s;
  }
  
  &.nav-item-2 {
    animation-duration: 3.5s;
  }
  
  &.nav-item-3 {
    animation-duration: 2.8s;
  }
  
  &.nav-item-4 {
    animation-duration: 3.2s;
  }
}

// ==================== 响应式设计 ====================
@media screen and (max-width: 750rpx) {
  .navigation-icon {
    width: 120rpx;
    height: 120rpx;
  }
}

@media screen and (min-width: 1200rpx) {
  .navigation-container {
    max-width: 1200rpx;
    margin: 0 auto;
  }
  
  .navigation-icon {
    width: 160rpx;
    height: 160rpx;
  }
}

// ==================== 性能优化 ====================
/**
 * 对于大量导航图标，可以考虑开启硬件加速
 */
.navigation-icon {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
}
</style>
