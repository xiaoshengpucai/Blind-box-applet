<template>
  <view class="product-list" :class="listClasses" :style="listStyle">
    <!-- 列表头部 -->
    <view v-if="showHeader" class="list-header">
      <slot name="header">
        <text class="header-title">{{ title }}</text>
        <text v-if="showCount" class="header-count">({{ totalCount }})</text>
      </slot>
    </view>
    
    <!-- 加载状态 -->
    <view v-if="loading && !productList.length" class="loading-container">
      <slot name="loading">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </slot>
    </view>
    
    <!-- 空状态 -->
    <view v-else-if="isEmpty && !loading" class="empty-container">
      <slot name="empty">
        <view class="empty-icon">📦</view>
        <text class="empty-text">{{ emptyText }}</text>
        <button v-if="showRetry" class="retry-button" @click="handleRetry">
          重新加载
        </button>
      </slot>
    </view>
    
    <!-- 商品列表 -->
    <view v-else class="product-grid" :style="gridStyle">
      <ProductCard
        v-for="(product, index) in displayProducts"
        :key="getProductKey(product, index)"
        :product="product"
        :layout="cardLayout"
        :size="cardSize"
        :image-config="imageConfig"
        :show-rating="showRating"
        :show-description="showDescription"
        :show-extra-info="showExtraInfo"
        :show-actions="showActions"
        :actions="cardActions"
        :price-prefix="pricePrefix"
        :max-tags="maxTags"
        :enable-lazy-load="enableLazyLoad"
        :custom-style="cardCustomStyle"
        :custom-class="cardCustomClass"
        @click="handleProductClick"
        @image-load="handleImageLoad"
        @image-error="handleImageError"
        @action-click="handleActionClick"
      />
    </view>
    
    <!-- 加载更多 -->
    <view v-if="showLoadMore" class="load-more-container">
      <view v-if="loadingMore" class="loading-more">
        <view class="loading-spinner small"></view>
        <text class="loading-text">加载更多...</text>
      </view>
      <button 
        v-else-if="hasMore" 
        class="load-more-button"
        @click="handleLoadMore"
      >
        加载更多
      </button>
      <text v-else class="no-more-text">没有更多了</text>
    </view>
    
    <!-- 骨架屏 -->
    <view v-if="showSkeleton" class="skeleton-container">
      <view 
        v-for="skeleton in skeletonCount"
        :key="skeleton"
        class="skeleton-item"
        :style="skeletonStyle"
      >
        <view class="skeleton-image"></view>
        <view class="skeleton-content">
          <view class="skeleton-price"></view>
          <view class="skeleton-title"></view>
          <view class="skeleton-description"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, watch, toRefs } from 'vue';
import { useProductList } from '@/src/composables/useProductList';
import ProductCard from './ProductCard.vue';

// ==================== Props定义 ====================
const props = defineProps({
  // 商品数据
  products: {
    type: Array,
    default: () => []
  },
  
  // 列表标题
  title: {
    type: String,
    default: ''
  },
  
  // 布局模式
  layout: {
    type: String,
    default: 'grid', // grid | list | waterfall
    validator: (value) => ['grid', 'list', 'waterfall'].includes(value)
  },
  
  // 列数（grid模式）
  columns: {
    type: Number,
    default: 2,
    validator: (value) => value > 0 && value <= 4
  },
  
  // 间距
  gap: {
    type: [String, Number],
    default: '20rpx'
  },
  
  // 卡片配置
  cardLayout: {
    type: String,
    default: 'vertical'
  },
  
  cardSize: {
    type: String,
    default: 'medium'
  },
  
  cardActions: {
    type: Array,
    default: () => []
  },
  
  cardCustomStyle: {
    type: Object,
    default: () => ({})
  },
  
  cardCustomClass: {
    type: String,
    default: ''
  },
  
  // 图片配置
  imageConfig: {
    type: Object,
    default: () => ({
      width: '100%',
      height: '360rpx',
      borderRadius: '10rpx'
    })
  },
  
  // 显示配置
  showHeader: {
    type: Boolean,
    default: false
  },
  
  showCount: {
    type: Boolean,
    default: false
  },
  
  showRating: {
    type: Boolean,
    default: false
  },
  
  showDescription: {
    type: Boolean,
    default: false
  },
  
  showExtraInfo: {
    type: Boolean,
    default: false
  },
  
  showActions: {
    type: Boolean,
    default: false
  },
  
  showLoadMore: {
    type: Boolean,
    default: true
  },
  
  showRetry: {
    type: Boolean,
    default: true
  },
  
  showSkeleton: {
    type: Boolean,
    default: false
  },
  
  // 分页配置
  pageSize: {
    type: Number,
    default: 20
  },
  
  // 懒加载配置
  enableLazyLoad: {
    type: Boolean,
    default: true
  },
  
  enableVirtualScroll: {
    type: Boolean,
    default: false
  },
  
  // 价格前缀
  pricePrefix: {
    type: String,
    default: '¥'
  },
  
  // 最大标签数
  maxTags: {
    type: Number,
    default: 3
  },
  
  // 空状态文案
  emptyText: {
    type: String,
    default: '暂无商品'
  },
  
  // 骨架屏数量
  skeletonCount: {
    type: Number,
    default: 6
  },
  
  // 自定义样式
  customStyle: {
    type: Object,
    default: () => ({})
  },
  
  // 自定义类名
  customClass: {
    type: String,
    default: ''
  }
});

// ==================== Emits定义 ====================
const emit = defineEmits([
  'product-click',
  'image-load',
  'image-error',
  'action-click',
  'load-more',
  'retry',
  'update:products'
]);

// ==================== 使用商品列表Hook ====================
const {
  productList,
  originalList,
  currentSortType,
  loading,
  error,
  totalCount,
  isEmpty,
  hasMore,
  currentPage,
  setProductList,
  loadMore,
  refresh
} = useProductList(props.products);

// 加载更多状态
const loadingMore = computed(() => loading.value && productList.value.length > 0);

// ==================== 计算属性 ====================
/**
 * 列表类名
 */
const listClasses = computed(() => [
  'product-list',
  `product-list-${props.layout}`,
  props.customClass
]);

/**
 * 列表样式
 */
const listStyle = computed(() => ({
  ...props.customStyle
}));

/**
 * 网格样式
 */
const gridStyle = computed(() => {
  const gap = typeof props.gap === 'number' ? `${props.gap}rpx` : props.gap;
  
  if (props.layout === 'grid') {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
      gap:`${gap} 10rpx`,
      padding: `0rpx ${gap}`
    };
  }
  
  if (props.layout === 'list') {
    return {
      display: 'flex',
      flexDirection: 'column',
      gap,
      padding: gap
    };
  }
  
  // waterfall layout
  return {
    display: 'flex',
    flexWrap: 'wrap',
    gap,
    padding: gap
  };
});

/**
 * 显示的商品列表
 */
const displayProducts = computed(() => {
  return productList.value;
});
console.log('displayProducts', displayProducts.value);
/**
 * 骨架屏样式
 */
const skeletonStyle = computed(() => {
  if (props.layout === 'grid') {
    return {
      width: `calc((100% - ${props.gap} * (${props.columns} - 1)) / ${props.columns})`
    };
  }
  return { width: '100%' };
});

// ==================== 方法 ====================
/**
 * 获取商品唯一键
 * @param {Object} product - 商品数据
 * @param {number} index - 索引
 * @returns {string} 唯一键
 */
const getProductKey = (product, index) => {
  return product.id || product.uid || `product-${index}`;
};

/**
 * 处理商品点击
 * @param {Object} product - 商品数据
 */
const handleProductClick = (product) => {
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
  emit('image-error', product);
};

/**
 * 处理操作按钮点击
 * @param {Object} payload - 操作数据
 */
const handleActionClick = (payload) => {
  emit('action-click', payload);
};

/**
 * 处理加载更多
 */
const handleLoadMore = () => {
  if (!hasMore.value || loadingMore.value) return;
  
  loadMore();
  emit('load-more', {
    page: currentPage.value,
    pageSize: props.pageSize
  });
};

/**
 * 处理重试
 */
const handleRetry = () => {
  refresh();
  emit('retry');
};

// ==================== 监听器 ====================
/**
 * 监听商品数据变化
 */
watch(() => props.products, (newProducts) => {
  setProductList(newProducts, true);
  emit('update:products', newProducts);
}, { deep: true, immediate: true });
</script>

<style lang="scss" scoped>
.product-list {
  width: 100%;
  background-color: #f5f5f5;
  
  &-grid {
    // Grid布局已在计算属性中定义
  }
  
  &-list {
    // List布局已在计算属性中定义
  }
  
  &-waterfall {
    // 瀑布流布局
    column-count: 2;
    column-gap: 20rpx;
    padding: 20rpx;
    
    ::v-deep .product-card {
      break-inside: avoid;
      margin-bottom: 20rpx;
    }
  }
}

// 列表头部
.list-header {
  display: flex;
  align-items: center;
  padding: 30rpx 20rpx 20rpx;
  background-color: #fff;
  
  .header-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }
  
  .header-count {
    font-size: 26rpx;
    color: #666;
    margin-left: 10rpx;
  }
}

// 加载状态
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 20rpx;
  
  .loading-spinner {
    width: 60rpx;
    height: 60rpx;
    border: 6rpx solid #e0e0e0;
    border-top: 6rpx solid #1890ff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20rpx;
    
    &.small {
      width: 40rpx;
      height: 40rpx;
      border-width: 4rpx;
    }
  }
  
  .loading-text {
    font-size: 28rpx;
    color: #666;
  }
}

// 空状态
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100rpx 20rpx;
  
  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 30rpx;
    opacity: 0.5;
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 30rpx;
  }
  
  .retry-button {
    // padding: 20rpx 40rpx;
    background-color: #1890ff;
    color: #fff;
    border: none;
    border-radius: 10rpx;
    font-size: 26rpx;
  }
}

// 加载更多
.load-more-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40rpx 20rpx;
  
  .loading-more {
    display: flex;
    align-items: center;
    gap: 15rpx;
  }
  
  .load-more-button {
    padding: 20rpx 40rpx;
    background-color: #f0f0f0;
    color: #333;
    border: none;
    border-radius: 50rpx;
    font-size: 26rpx;
    
    &:active {
      background-color: #e0e0e0;
    }
  }
  
  .no-more-text {
    font-size: 24rpx;
    color: #999;
  }
}

// 骨架屏
.skeleton-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 20rpx;
}

.skeleton-item {
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  
  .skeleton-image {
    width: 100%;
    height: 360rpx;
    background-color: #f0f0f0;
  }
  
  .skeleton-content {
    padding: 20rpx;
    
    .skeleton-price {
      width: 60%;
      height: 32rpx;
      background-color: #f0f0f0;
      border-radius: 4rpx;
      margin-bottom: 15rpx;
    }
    
    .skeleton-title {
      width: 80%;
      height: 26rpx;
      background-color: #f0f0f0;
      border-radius: 4rpx;
      margin-bottom: 10rpx;
    }
    
    .skeleton-description {
      width: 100%;
      height: 24rpx;
      background-color: #f0f0f0;
      border-radius: 4rpx;
    }
  }
}

// 动画定义
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes skeleton-loading {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

// 响应式适配
@media screen and (max-width: 750rpx) {
  .product-list {
    &-waterfall {
      column-count: 1;
    }
  }
  
  .skeleton-container {
    grid-template-columns: 1fr;
  }
}

@media screen and (min-width: 1200rpx) {
  .product-list {
    &-waterfall {
      column-count: 3;
    }
  }
}
</style>
