<template>
  <view class="virtual-scroll-container" :style="containerStyle">
    <!-- 滚动区域 -->
    <scroll-view
      ref="scrollViewRef"
      class="virtual-scroll-view"
      :style="scrollViewStyle"
      :scroll-y="scrollY"
      :scroll-x="scrollX"
      :scroll-top="scrollTop"
      :scroll-left="scrollLeft"
      :enable-flex="true"
      @scroll="handleScroll"
      @scrolltoupper="handleScrollToUpper"
      @scrolltolower="handleScrollToLower"
    >
      <!-- 虚拟占位 - 上方 -->
      <view 
        v-if="startOffset > 0"
        class="virtual-placeholder virtual-placeholder-top"
        :style="{ height: startOffset + 'px' }"
      ></view>
      
      <!-- 可见项目容器 -->
      <view class="virtual-items-container" :style="itemsContainerStyle">
        <!-- 渲染可见项目 -->
        <view
          v-for="(item, index) in visibleItems"
          :key="getItemKey(item, index)"
          class="virtual-item"
          :class="getItemClass(item, index)"
          :style="getItemStyle(item, index)"
          :data-index="startIndex + index"
          @click="handleItemClick(item, startIndex + index)"
        >
          <slot
            :item="item"
            :index="startIndex + index"
            :isVisible="true"
          >
            <!-- 默认渲染 -->
            <view class="default-item">
              {{ item.title || item.name || `Item ${startIndex + index}` }}
            </view>
          </slot>
        </view>
      </view>
      
      <!-- 虚拟占位 - 下方 -->
      <view 
        v-if="endOffset > 0"
        class="virtual-placeholder virtual-placeholder-bottom"
        :style="{ height: endOffset + 'px' }"
      ></view>
      
      <!-- 加载更多指示器 -->
      <view v-if="showLoadMore" class="load-more-indicator">
        <view v-if="loading" class="loading-spinner">
          <text>加载中...</text>
        </view>
        <view v-else-if="hasMore" class="load-more-button" @click="handleLoadMore">
          <text>加载更多</text>
        </view>
        <view v-else class="no-more-text">
          <text>没有更多了</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 回到顶部按钮 -->
    <view 
      v-if="showBackToTop && scrollTopValue > backToTopThreshold"
      class="back-to-top-button"
      :style="backToTopStyle"
      @click="scrollToTop"
    >
      <slot name="back-to-top">
        <text class="back-to-top-text">↑</text>
      </slot>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue';
import { useThrottle } from '@/src/composables/useThrottle';

// ==================== Props定义 ====================
const props = defineProps({
  // 数据列表
  items: {
    type: Array,
    required: true,
    default: () => []
  },
  
  // 每项高度（固定高度模式）
  itemHeight: {
    type: Number,
    default: 100
  },
  
  // 是否为动态高度
  dynamicHeight: {
    type: Boolean,
    default: false
  },
  
  // 预估高度（动态高度模式）
  estimatedItemHeight: {
    type: Number,
    default: 100
  },
  
  // 容器高度
  height: {
    type: [String, Number],
    default: '100vh'
  },
  
  // 容器宽度
  width: {
    type: [String, Number],
    default: '100%'
  },
  
  // 预渲染项目数量（上下各预渲染的数量）
  overscan: {
    type: Number,
    default: 5
  },
  
  // 滚动方向
  direction: {
    type: String,
    default: 'vertical', // vertical | horizontal
    validator: (value) => ['vertical', 'horizontal'].includes(value)
  },
  
  // 是否启用滚动
  scrollY: {
    type: Boolean,
    default: true
  },
  
  scrollX: {
    type: Boolean,
    default: false
  },
  
  // 滚动阈值（触发上拉下拉的距离）
  threshold: {
    type: Number,
    default: 50
  },
  
  // 是否显示加载更多
  showLoadMore: {
    type: Boolean,
    default: false
  },
  
  // 是否正在加载
  loading: {
    type: Boolean,
    default: false
  },
  
  // 是否还有更多数据
  hasMore: {
    type: Boolean,
    default: true
  },
  
  // 是否显示回到顶部按钮
  showBackToTop: {
    type: Boolean,
    default: true
  },
  
  // 回到顶部阈值
  backToTopThreshold: {
    type: Number,
    default: 500
  },
  
  // 项目唯一键字段
  itemKey: {
    type: String,
    default: 'id'
  },
  
  // 自定义样式
  customStyle: {
    type: Object,
    default: () => ({})
  }
});

// ==================== Emits定义 ====================
const emit = defineEmits([
  'scroll',
  'scroll-to-upper',
  'scroll-to-lower',
  'item-click',
  'load-more',
  'update:scrollTop'
]);

// ==================== 状态管理 ====================
const scrollViewRef = ref(null);
const scrollTopValue = ref(0);
const scrollLeft = ref(0);
const startIndex = ref(0);
const endIndex = ref(0);
const itemHeights = ref(new Map()); // 动态高度缓存

// ==================== 计算属性 ====================
/**
 * 容器样式
 */
const containerStyle = computed(() => {
  const height = typeof props.height === 'number' ? `${props.height}px` : props.height;
  const width = typeof props.width === 'number' ? `${props.width}px` : props.width;
  
  return {
    height,
    width,
    position: 'relative',
    ...props.customStyle
  };
});

/**
 * 滚动视图样式
 */
const scrollViewStyle = computed(() => ({
  height: '100%',
  width: '100%'
}));

/**
 * 可见区域高度
 */
const containerHeight = computed(() => {
  if (typeof props.height === 'number') {
    return props.height;
  }
  // 对于百分比或vh，这里简化处理
  return 600; // 默认值，实际使用中可通过DOM API获取
});

/**
 * 可见项目数量
 */
const visibleCount = computed(() => {
  const height = containerHeight.value;
  const itemHeight = props.dynamicHeight ? props.estimatedItemHeight : props.itemHeight;
  return Math.ceil(height / itemHeight) + props.overscan * 2;
});

/**
 * 开始渲染索引
 */
const computedStartIndex = computed(() => {
  const scrollTop = scrollTopValue.value;
  const itemHeight = props.dynamicHeight ? props.estimatedItemHeight : props.itemHeight;
  const index = Math.floor(scrollTop / itemHeight);
  return Math.max(0, index - props.overscan);
});

/**
 * 结束渲染索引
 */
const computedEndIndex = computed(() => {
  const start = computedStartIndex.value;
  const end = start + visibleCount.value;
  return Math.min(props.items.length - 1, end);
});

/**
 * 可见项目列表
 */
const visibleItems = computed(() => {
  const start = computedStartIndex.value;
  const end = computedEndIndex.value;
  return props.items.slice(start, end + 1);
});

/**
 * 上方偏移量
 */
const startOffset = computed(() => {
  if (props.dynamicHeight) {
    return calculateDynamicOffset(0, computedStartIndex.value);
  }
  return computedStartIndex.value * props.itemHeight;
});

/**
 * 下方偏移量
 */
const endOffset = computed(() => {
  const totalHeight = props.dynamicHeight 
    ? calculateDynamicOffset(0, props.items.length)
    : props.items.length * props.itemHeight;
  
  const visibleHeight = props.dynamicHeight
    ? calculateDynamicOffset(computedStartIndex.value, computedEndIndex.value + 1)
    : (computedEndIndex.value - computedStartIndex.value + 1) * props.itemHeight;
  
  return totalHeight - startOffset.value - visibleHeight;
});

/**
 * 项目容器样式
 */
const itemsContainerStyle = computed(() => ({
  position: 'relative'
}));

/**
 * 回到顶部按钮样式
 */
const backToTopStyle = computed(() => ({
  position: 'fixed',
  bottom: '100rpx',
  right: '30rpx',
  width: '80rpx',
  height: '80rpx',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  cursor: 'pointer'
}));

// ==================== 方法 ====================
/**
 * 计算动态偏移量
 * @param {number} start - 开始索引
 * @param {number} end - 结束索引
 * @returns {number} 偏移量
 */
const calculateDynamicOffset = (start, end) => {
  let offset = 0;
  for (let i = start; i < end; i++) {
    const height = itemHeights.value.get(i) || props.estimatedItemHeight;
    offset += height;
  }
  return offset;
};

/**
 * 获取项目唯一键
 * @param {Object} item - 项目数据
 * @param {number} index - 索引
 * @returns {string} 唯一键
 */
const getItemKey = (item, index) => {
  return item[props.itemKey] || `item-${startIndex.value + index}`;
};

/**
 * 获取项目类名
 * @param {Object} item - 项目数据
 * @param {number} index - 索引
 * @returns {Array} 类名数组
 */
const getItemClass = (item, index) => {
  return ['virtual-item', `virtual-item-${startIndex.value + index}`];
};

/**
 * 获取项目样式
 * @param {Object} item - 项目数据
 * @param {number} index - 索引
 * @returns {Object} 样式对象
 */
const getItemStyle = (item, index) => {
  const baseStyle = {
    position: 'relative',
    width: '100%'
  };
  
  if (!props.dynamicHeight) {
    baseStyle.height = `${props.itemHeight}px`;
  }
  
  return baseStyle;
};

/**
 * 更新项目高度（动态高度模式）
 * @param {number} index - 项目索引
 * @param {number} height - 高度
 */
const updateItemHeight = (index, height) => {
  if (props.dynamicHeight) {
    itemHeights.value.set(index, height);
  }
};

/**
 * 滚动事件处理（节流）
 */
const handleScroll = useThrottle((event) => {
  const { scrollTop, scrollLeft } = event.detail;
  scrollTopValue.value = scrollTop;
  scrollLeft.value = scrollLeft;
  
  // 更新索引
  startIndex.value = computedStartIndex.value;
  endIndex.value = computedEndIndex.value;
  
  emit('scroll', event);
  emit('update:scrollTop', scrollTop);
}, 16); // 60fps

/**
 * 滚动到顶部
 */
const handleScrollToUpper = () => {
  emit('scroll-to-upper');
};

/**
 * 滚动到底部
 */
const handleScrollToLower = () => {
  emit('scroll-to-lower');
  
  if (props.showLoadMore && props.hasMore && !props.loading) {
    emit('load-more');
  }
};

/**
 * 项目点击事件
 * @param {Object} item - 项目数据
 * @param {number} index - 索引
 */
const handleItemClick = (item, index) => {
  emit('item-click', { item, index });
};

/**
 * 加载更多
 */
const handleLoadMore = () => {
  if (props.hasMore && !props.loading) {
    emit('load-more');
  }
};

/**
 * 滚动到顶部
 */
const scrollToTop = () => {
  scrollTopValue.value = 0;
};

/**
 * 滚动到指定位置
 * @param {number} scrollTop - 滚动位置
 */
const scrollTo = (scrollTop) => {
  scrollTopValue.value = scrollTop;
};

/**
 * 滚动到指定项目
 * @param {number} index - 项目索引
 */
const scrollToItem = (index) => {
  if (index < 0 || index >= props.items.length) return;
  
  let offset = 0;
  if (props.dynamicHeight) {
    offset = calculateDynamicOffset(0, index);
  } else {
    offset = index * props.itemHeight;
  }
  
  scrollTo(offset);
};

// ==================== 监听器 ====================
/**
 * 监听items变化，重置状态
 */
watch(() => props.items, () => {
  if (props.dynamicHeight) {
    itemHeights.value.clear();
  }
  startIndex.value = 0;
  endIndex.value = Math.min(visibleCount.value - 1, props.items.length - 1);
}, { deep: true });

/**
 * 监听计算属性变化，更新索引
 */
watch([computedStartIndex, computedEndIndex], ([newStart, newEnd]) => {
  startIndex.value = newStart;
  endIndex.value = newEnd;
});

// ==================== 生命周期 ====================
onMounted(() => {
  // 初始化索引
  startIndex.value = computedStartIndex.value;
  endIndex.value = computedEndIndex.value;
});

onUnmounted(() => {
  // 清理工作
  if (props.dynamicHeight) {
    itemHeights.value.clear();
  }
});

// ==================== 暴露方法 ====================
defineExpose({
  scrollTo,
  scrollToItem,
  scrollToTop,
  updateItemHeight,
  scrollTopValue: () => scrollTopValue.value
});
</script>

<style lang="scss" scoped>
.virtual-scroll-container {
  position: relative;
  overflow: hidden;
}

.virtual-scroll-view {
  width: 100%;
  height: 100%;
}

.virtual-placeholder {
  width: 100%;
  
  &-top {
    background: transparent;
  }
  
  &-bottom {
    background: transparent;
  }
}

.virtual-items-container {
  position: relative;
}

.virtual-item {
  width: 100%;
  box-sizing: border-box;
}

.default-item {
  padding: 20rpx;
  border-bottom: 1rpx solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.load-more-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx 20rpx;
  
  .loading-spinner {
    color: #666;
    font-size: 26rpx;
  }
  
  .load-more-button {
    color: #1890ff;
    font-size: 26rpx;
    cursor: pointer;
    
    &:active {
      opacity: 0.7;
    }
  }
  
  .no-more-text {
    color: #999;
    font-size: 24rpx;
  }
}

.back-to-top-button {
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  
  &:active {
    transform: scale(0.9);
  }
  
  .back-to-top-text {
    font-size: 32rpx;
    font-weight: bold;
  }
}

// 性能优化
.virtual-item {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform;
}
</style>
