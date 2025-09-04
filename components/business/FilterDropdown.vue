<template>
  <view class="filter-dropdown-container">
    <!-- 筛选按钮 -->
    <view class="nav-button filter-button" @click.stop="handleToggle">
      <up-icon name="list-dot" color="#fff" size="22"></up-icon>
      <text class="filter-text" :style="filterTextStyle">筛选</text>
    </view>

    <!-- 下拉菜单 -->
    <view class="filter-dropdown" :class="{ 'show': isVisible }" :style="filterDropdownStyle"
      @click="handleOptionSelect">
      <view v-for="option in sortOptions" :key="option.key" class="filter-option" :class="{
        'active': currentSortType === option.key,
        [`filter-option-${option.key}`]: true
      }" :data-type="option.key">
        {{ option.label }}
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useThrottle } from '@/src/composables/useThrottle';

// ==================== Props定义 ====================
const props = defineProps({
  // 当前排序类型
  currentSort: {
    type: String,
    default: ''
  },

  // 排序选项
  options: {
    type: Array,
    default: () => [
      { key: 'new', label: '最新发布' },
      { key: 'priceDesc', label: '价格从高到低' },
      { key: 'priceAsc', label: '价格从低到高' }
    ]
  },

  // 是否可见
  visible: {
    type: Boolean,
    default: false
  },

  // 下拉框样式配置
  dropdownConfig: {
    type: Object,
    default: () => ({
      position: 'absolute',
      right: '180rpx',
      top: '70rpx',
      width: '140rpx'
    })
  },

  // 节流延迟
  throttleDelay: {
    type: Number,
    default: 300
  }

});

// ==================== Emits定义 ====================
const emit = defineEmits(['toggle', 'select', 'update:visible']);

// ==================== 状态管理 ====================
const isVisible = ref(props.visible);
const currentSortType = ref(props.currentSort);

// ==================== 计算属性 ====================
/**
 * 筛选文字颜色样式
 */
const filterTextStyle = computed(() => ({
  color: currentSortType.value === '' ? '#fff' : (currentSortType.value === props.options[0].key ? '#fff' :
    '#bd9731')
}));
// /**
//  * 下拉框样式
//  */
// const dropdownStyle = computed(() => ({
//   ...props.dropdownConfig,
//   transform: isVisible.value ? 'rotateX(0deg)' : 'rotateX(-90deg)',
//   opacity: isVisible.value ? '1' : '0',
//   visibility: isVisible.value ? 'visible' : 'hidden'
// }));
/**
 * 筛选下拉框样式 - 使用computed优化性能
 */
const filterDropdownStyle = computed(() => ({
  transform: isVisible.value ? 'rotateX(0deg)' : 'rotateX(-90deg)',
  opacity: isVisible.value ? '1' : '0',
  visibility: isVisible.value ? 'visible' : 'hidden'
}));
/**
 * 排序选项
 */
const sortOptions = computed(() => props.options);

// ==================== 节流处理 ====================
const throttledToggle = useThrottle(() => {
  isVisible.value = !isVisible.value;
  emit('toggle', isVisible.value);
  emit('update:visible', isVisible.value);
}, props.throttleDelay);

// ==================== 方法 ====================
/**
 * 处理切换显示状态
 */
const handleToggle = () => {
  throttledToggle();
};

/**
 * 处理选项选择
 * @param {Event} event - 点击事件
 */
const handleOptionSelect = (event) => {
  console.log(event.target, 'event----------------')
  const sortType = event.target.dataset.type;

  if (!sortType || currentSortType.value === sortType) {
    return;
  }

  currentSortType.value = sortType;
  isVisible.value = false;

  emit('select', {
    sortType,
    option: sortOptions.value.find(opt => opt.key === sortType)
  });

  emit('update:visible', false);
};

/**
 * 显示下拉框
 */
const show = () => {
  isVisible.value = true;
  emit('update:visible', true);
};

/**
 * 隐藏下拉框
 */
const hide = () => {
  isVisible.value = false;
  emit('update:visible', false);
};

/**
 * 重置选择
 */
const reset = () => {
  currentSortType.value = '';
  hide();
};

// ==================== 监听器 ====================
watch(() => props.visible, (newVisible) => {
  isVisible.value = newVisible;
});

watch(() => props.currentSort, (newSort) => {
  currentSortType.value = newSort;
});

// ==================== 暴露方法 ====================
defineExpose({
  show,
  hide,
  reset,
  isVisible
});
</script>

<style lang="scss" scoped>
.filter-dropdown-container {
  position: relative;
  display: inline-block;
}

// 导航按钮通用样式 - 使用BEM命名规范
.nav-button {
  width: 50rpx;
  height: 50rpx;
  padding: 10rpx;
  border-radius: 20rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20rpx;
  background-color: #1f1f1f;
  transition: all 0.3s ease; // 添加过渡动画
  position: relative;

  &:active {
    transform: scale(0.95); // 点击反馈
  }
}

// 筛选按钮特殊样式
.filter-button {
  width: 100rpx;
  padding: 10rpx 5rpx;

  .filter-text {
    color: #fff;
    display: inline-block;
    font-size: 18rpx;
    margin: 0;
    padding: 0;
    margin-top: 5rpx;
    transition: color 0.3s ease; // 文字颜色过渡
  }
}

// ==================== 筛选下拉框样式 ====================
.filter-dropdown {
  position: absolute;
  right: 10rpx;
  top: 70rpx;
  width: 140rpx;
  border-radius: 10rpx;
  margin-top: 1rpx;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform-origin: top;
  transform: rotateX(-90deg);
  transition: all 0.5s ease-in-out;
  z-index: 100; // 提升层级，确保下拉框处于最顶层
  backdrop-filter: blur(10rpx); // 添加背景模糊效果
}

.filter-option {
  font-size: 20rpx;
  padding: 10rpx;
  height: 50rpx;
  line-height: 50rpx;
  text-align: center;
  color: #fff;
  width: 100%;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.active {
    color: #bd9731;
    font-weight: bold;
  }
}

// 特殊分隔线样式
.filter-option-price-desc {
  border-bottom: 2rpx solid #927e7c;
  border-top: 2rpx solid #927e7c;
}

// 响应式设计
@media screen and (max-width: 750rpx) {
  .filter-dropdown {
    right: 120rpx;
    width: 120rpx;
  }

  .filter-option {
    font-size: 18rpx;
    height: 45rpx;
    line-height: 45rpx;
  }
}
</style>
