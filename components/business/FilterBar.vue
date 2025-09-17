<template>
  <view class="filter-bar">
    <view
      v-for="filter in filters"
      :key="filter.key"
      class="filter-item"
      :class="{ active: activeFilter === filter.key }"
      @click="handleFilterClick(filter.key)"
    >
      <text>{{ filter.label }}</text>
      <view v-if="filter.sortable" class="sort-icons">
        <view class="icon arrow-up" :class="{ active: sortOrder === 'asc' && activeFilter === filter.key }"></view>
        <view class="icon arrow-down" :class="{ active: sortOrder === 'desc' && activeFilter === filter.key }"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  initialFilter: {
    type: String,
    default: 'comprehensive'
  }
});

const emit = defineEmits(['filter-change']);

const activeFilter = ref(props.initialFilter);
const sortOrder = ref('desc'); // 'asc' or 'desc'

const filters = ref([
  { key: 'comprehensive', label: '综合', sortable: false },
  { key: 'time', label: '时间', sortable: true },
  { key: 'price', label: '价格', sortable: true }
]);

const handleFilterClick = (key) => {
  if (activeFilter.value === key) {
    // If the same sortable filter is clicked again, toggle sort order
    const filter = filters.value.find(f => f.key === key);
    if (filter.sortable) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    }
  } else {
    activeFilter.value = key;
    sortOrder.value = 'desc'; // Default to desc for new filter
  }
  
  emit('filter-change', { filter: activeFilter.value, sortOrder: sortOrder.value });
};
</script>

<style lang="scss" scoped>
.filter-bar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20rpx 40rpx;
  height: 60rpx;
  background-color: #f5f5f5;
}

.filter-item {
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #333;
  cursor: pointer;
  margin-right: 40rpx;
  padding: 10rpx 20rpx;
  border-radius: 30rpx;
  background-color: #fff;
  border: 1px solid #eee;

  &.active {
    background-color: #e0f7ff;
    border-color: #a0e9ff;
    font-weight: bold;
  }

  .sort-icons {
    display: flex;
    flex-direction: column;
    margin-left: 8rpx;

    .icon {
      width: 0;
      height: 0;
      border-left: 8rpx solid transparent;
      border-right: 8rpx solid transparent;

      &.arrow-up {
        border-bottom: 8rpx solid #999;
        margin-bottom: 4rpx;
        &.active {
          border-bottom-color: #333;
        }
      }

      &.arrow-down {
        border-top: 8rpx solid #999;
        &.active {
          border-top-color: #333;
        }
      }
    }
  }
}
</style>
