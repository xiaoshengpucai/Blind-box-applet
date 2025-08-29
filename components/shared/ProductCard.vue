<template>
  <view 
    class="product-card" 
    :class="cardClasses"
    :style="cardStyle"
    @click="handleCardClick"
  >
    <!-- 商品图片 -->
    <view class="product-image-container">
      <UniLazyImage
        :src="product.imageUrl || product.smallPicurl"
        :placeholder="defaultImages.placeholder"
        :error-image="defaultImages.error"
        :width="imageWidth"
        :height="imageHeight"
        :border-radius="imageBorderRadius"
        :enable-lazy-load="enableLazyLoad"
        @load="handleImageLoad"
        @error="handleImageError"
      />
      
      <!-- 商品标签 -->
      <view v-if="product.tags && product.tags.length" class="product-tags">
        <text 
          v-for="tag in displayTags" 
          :key="tag"
          class="tag-item"
          :style="tagStyle"
        >
          {{ tag }}
        </text>
      </view>
      
      <!-- 促销标签 -->
      <view v-if="product.promotionLabel" class="promotion-label" :style="promotionLabelStyle">
        {{ product.promotionLabel }}
        <view class="promotion-corner"></view>
      </view>
      
      <!-- 评分星级 -->
      <view v-if="showRating && product.rating" class="rating-container">
        <view class="rating-stars">
          <text 
            v-for="star in 5" 
            :key="star"
            class="star"
            :class="{ 'star-filled': star <= Math.floor(product.rating) }"
          >
            ★
          </text>
        </view>
      </view>
    </view>
    
    <!-- 商品信息 -->
    <view class="product-info">
      <!-- 商品价格 -->
      <view class="price-container">
        <text class="current-price" :style="priceStyle">
          {{ formatPrice(product.price) }}
        </text>
        <text v-if="product.originalPrice && product.originalPrice > product.price" 
              class="original-price">
          {{ formatPrice(product.originalPrice) }}
        </text>
      </view>
      
      <!-- 商品标题 -->
      <view class="product-title" :style="titleStyle">
        {{ product.title || product.Title }}
      </view>
      
      <!-- 商品描述 -->
      <view v-if="showDescription && product.description" class="product-description">
        {{ product.description }}
      </view>
      
      <!-- 额外信息 -->
      <view v-if="showExtraInfo" class="extra-info">
        <text v-if="product.soldCount" class="sold-count">
          已售 {{ product.soldCount }}
        </text>
        <text v-if="product.shopName" class="shop-name">
          {{ product.shopName }}
        </text>
      </view>
    </view>
    
    <!-- 操作按钮 -->
    <view v-if="showActions" class="action-buttons">
      <button 
        v-for="action in actions"
        :key="action.key"
        class="action-button"
        :class="action.class"
        :style="action.style"
        @click.stop="handleActionClick(action)"
      >
        {{ action.text }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';
import UniLazyImage from './UniLazyImage.vue';

// ==================== Props定义 ====================
const props = defineProps({
  // 商品数据
  product: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && (value.id || value.title || value.Title);
    }
  },
  
  // 卡片布局模式
  layout: {
    type: String,
    default: 'vertical', // vertical | horizontal | grid
    validator: (value) => ['vertical', 'horizontal', 'grid'].includes(value)
  },
  
  // 卡片尺寸
  size: {
    type: String,
    default: 'medium', // small | medium | large
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  
  // 图片尺寸配置
  imageConfig: {
    type: Object,
    default: () => ({
      width: '100%',
      height: '360rpx',
      borderRadius: '10rpx'
    })
  },
  
  // 是否显示评分
  showRating: {
    type: Boolean,
    default: false
  },
  
  // 是否显示描述
  showDescription: {
    type: Boolean,
    default: false
  },
  
  // 是否显示额外信息
  showExtraInfo: {
    type: Boolean,
    default: false
  },
  
  // 是否显示操作按钮
  showActions: {
    type: Boolean,
    default: false
  },
  
  // 操作按钮配置
  actions: {
    type: Array,
    default: () => []
  },
  
  // 价格前缀
  pricePrefix: {
    type: String,
    default: '¥'
  },
  
  // 最大显示标签数
  maxTags: {
    type: Number,
    default: 3
  },
  
  // 是否启用懒加载
  enableLazyLoad: {
    type: Boolean,
    default: true
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
const emit = defineEmits(['click', 'image-load', 'image-error', 'action-click']);

// ==================== 常量定义 ====================
const defaultImages = {
  placeholder: 'https://img1.baidu.com/it/u=2244894265,3017695745&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1082',
  error: 'https://img2.baidu.com/it/u=1455518479,3144936783&fm=253&fmt=auto&app=120&f=PNG?w=500&h=1065'
};

// 尺寸配置
const sizeConfigs = {
  small: {
    cardWidth: '300rpx',
    cardHeight: 'auto',
    imageHeight: '300rpx',
    fontSize: '24rpx',
    priceSize: '28rpx'
  },
  medium: {
    cardWidth: '350rpx',
    cardHeight: 'auto',
    imageHeight: '360rpx',
    fontSize: '26rpx',
    priceSize: '32rpx'
  },
  large: {
    cardWidth: '400rpx',
    cardHeight: 'auto',
    imageHeight: '400rpx',
    fontSize: '28rpx',
    priceSize: '36rpx'
  }
};

// ==================== 计算属性 ====================
/**
 * 卡片类名
 */
const cardClasses = computed(() => [
  'product-card',
  `product-card-${props.layout}`,
  `product-card-${props.size}`,
  props.customClass
]);

/**
 * 卡片样式
 */
const cardStyle = computed(() => {
  const config = sizeConfigs[props.size];
  return {
    width: config.cardWidth,
    height: config.cardHeight,
    ...props.customStyle
  };
});

/**
 * 图片宽度
 */
const imageWidth = computed(() => {
  return props.imageConfig.width || '100%';
});

/**
 * 图片高度
 */
const imageHeight = computed(() => {
  return props.imageConfig.height || sizeConfigs[props.size].imageHeight;
});

/**
 * 图片圆角
 */
const imageBorderRadius = computed(() => {
  return props.imageConfig.borderRadius || '10rpx';
});

/**
 * 显示的标签
 */
const displayTags = computed(() => {
  if (!props.product.tags) return [];
  return props.product.tags.slice(0, props.maxTags);
});

/**
 * 价格样式
 */
const priceStyle = computed(() => ({
  fontSize: sizeConfigs[props.size].priceSize,
  fontWeight: 'bold',
  color: '#e7717b'
}));

/**
 * 标题样式
 */
const titleStyle = computed(() => ({
  fontSize: sizeConfigs[props.size].fontSize,
  lineHeight: '1.4',
  color: '#333'
}));

/**
 * 标签样式
 */
const tagStyle = computed(() => ({
  fontSize: '20rpx',
  backgroundColor: '#f7bf6c',
  color: '#333',
  padding: '4rpx 8rpx',
  borderRadius: '4rpx'
}));

/**
 * 促销标签样式
 */
const promotionLabelStyle = computed(() => ({
  backgroundColor: '#d33b2e',
  color: '#fff',
  fontSize: '22rpx',
  fontWeight: 'bold'
}));

// ==================== 方法 ====================
/**
 * 格式化价格
 * @param {number|string} price - 价格
 * @returns {string} 格式化后的价格
 */
const formatPrice = (price) => {
  if (price === undefined || price === null) return '';
  
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return price;
  
  return `${props.pricePrefix}${numPrice.toFixed(2)}`;
};

/**
 * 处理卡片点击
 */
const handleCardClick = () => {
  emit('click', props.product);
};

/**
 * 处理图片加载成功
 */
const handleImageLoad = () => {
  emit('image-load', props.product);
};

/**
 * 处理图片加载失败
 */
const handleImageError = () => {
  emit('image-error', props.product);
};

/**
 * 处理操作按钮点击
 * @param {Object} action - 操作配置
 */
const handleActionClick = (action) => {
  emit('action-click', {
    action,
    product: props.product
  });
};
</script>

<style lang="scss" scoped>
.product-card {
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:active {
    transform: scale(0.98);
    box-shadow: 0 1rpx 5rpx rgba(0, 0, 0, 0.1);
  }
  
  // 垂直布局
  &-vertical {
    display: flex;
    flex-direction: column;
  }
  
  // 水平布局
  &-horizontal {
    display: flex;
    flex-direction: row;
    
    .product-image-container {
      flex-shrink: 0;
      width: 200rpx;
    }
    
    .product-info {
      flex: 1;
      padding-left: 20rpx;
    }
  }
  
  // 网格布局
  &-grid {
    display: inline-block;
    margin: 10rpx;
  }
}

.product-image-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.product-tags {
  position: absolute;
  bottom: 10rpx;
  right: 10rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 5rpx;
  z-index: 2;
  
  .tag-item {
    padding: 4rpx 8rpx;
    border-radius: 4rpx;
    font-size: 20rpx;
    line-height: 1;
  }
}

.promotion-label {
  position: absolute;
  top: 0;
  left: 0;
  padding: 10rpx 30rpx 10rpx 20rpx;
  z-index: 3;
  border-radius: 0 0 15rpx 0;
  
  .promotion-corner {
    position: absolute;
    top: 100%;
    left: 0;
    width: 0;
    height: 0;
    border-left: 15rpx solid transparent;
    border-top: 15rpx solid rgba(211, 59, 46, 0.7);
  }
}

.rating-container {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  
  .rating-stars {
    .star {
      color: #ddd;
      font-size: 24rpx;
      
      &-filled {
        color: #ffa500;
      }
    }
  }
}

.product-info {
  padding: 20rpx;
  flex: 1;
}

.price-container {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
  
  .current-price {
    color: #e7717b;
    font-weight: bold;
    margin-right: 10rpx;
  }
  
  .original-price {
    color: #999;
    font-size: 24rpx;
    text-decoration: line-through;
  }
}

.product-title {
  font-weight: 500;
  line-height: 1.4;
  margin-bottom: 10rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.product-description {
  font-size: 24rpx;
  color: #666;
  line-height: 1.4;
  margin-bottom: 10rpx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

.extra-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 22rpx;
  color: #999;
  margin-top: 10rpx;
  
  .sold-count {
    // 样式
  }
  
  .shop-name {
    // 样式
  }
}

.action-buttons {
  padding: 0 20rpx 20rpx;
  display: flex;
  gap: 10rpx;
  
  .action-button {
    flex: 1;
    height: 60rpx;
    border: none;
    border-radius: 30rpx;
    font-size: 24rpx;
    background-color: #f0f0f0;
    color: #333;
    
    &.primary {
      background-color: #1890ff;
      color: #fff;
    }
    
    &.danger {
      background-color: #ff4d4f;
      color: #fff;
    }
    
    &.success {
      background-color: #52c41a;
      color: #fff;
    }
  }
}

// 响应式适配
@media screen and (max-width: 750rpx) {
  .product-card {
    &-horizontal {
      flex-direction: column;
      
      .product-image-container {
        width: 100%;
      }
      
      .product-info {
        padding-left: 20rpx;
      }
    }
  }
}
</style>
