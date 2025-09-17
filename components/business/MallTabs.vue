<template>
  <view class="mall-tabs">
    <view class="tabs-container">
      <view
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab-item"
        :class="{ active: activeIndex === index }"
        @click="handleTabClick(index)"
      >
        {{ tab.title }}
      </view>
    </view>
    <view class="underline" :style="underlineStyle"></view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, getCurrentInstance } from 'vue';

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
    default: () => []
  },
  initialTab: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['tab-change']);

const activeIndex = ref(props.initialTab);
const tabWidths = ref([]);
const instance = getCurrentInstance();


const handleTabClick = (index) => {
  if (activeIndex.value !== index) {
    activeIndex.value = index;
    emit('tab-change', index);
  }
};

const underlineStyle = computed(() => {
  if (tabWidths.value.length === 0 || !tabWidths.value[activeIndex.value]) {
    return {};
  }
  const activeTab = tabWidths.value[activeIndex.value];
  if (!activeTab) return {};

  const offset = activeTab.offset;
  const width = activeTab.width;
  
  return {
    transform: `translateX(${offset}px)`,
    width: `${width}px`
  };
});

onMounted(() => {
  nextTick(() => {
    const query = uni.createSelectorQuery().in(instance);
    query.select('.tabs-container').boundingClientRect();
    query.selectAll('.tab-item').boundingClientRect();
    
    query.exec((data) => {
        const containerRect = data[0];
        const itemRects = data[1];
        
        if (containerRect && itemRects && itemRects.length) {
            tabWidths.value = itemRects.map(item => ({
                width: item.width,
                offset: item.left - containerRect.left
            }));
        }
    });
  });
});

</script>

<style lang="scss" scoped>
.mall-tabs {
  position: relative;
  background-color: #ffffff;
  .tabs-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 0 40rpx;
    height: 80rpx;
  }

  .tab-item {
    padding: 0 20rpx;
    margin-right: 20rpx;
    font-size: 32rpx;
    color: #666;
    cursor: pointer;
    transition: color 0.3s ease;

    &.active {
      color: #333;
      font-weight: bold;
      font-size: 36rpx;
    }
  }

  .underline {
    position: absolute;
    bottom: 20rpx;
    left: 0;
    height: 8rpx;
    background-color: #f2c202;
    border-radius: 4rpx;
    transition: transform 0.3s ease, width 0.3s ease;
  }
}
</style>
