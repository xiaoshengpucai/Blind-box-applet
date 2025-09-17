<template>
  <view class="box-cabinet-page">
    <!-- Header -->
    <view class="header">
      <text class="arrow-left"></text>
      <text class="header-title">盒柜</text>
      <view class="header-right"></view>
    </view>

    <!-- Tabs -->
    <view class="tabs">
      <view v-for="tab in tabs" :key="tab.key" :class="['tab-item', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key">{{ tab.label }}</view>
    </view>
    <view class="main">
      <!-- Item Grid -->
      <scroll-view scroll-y="true" class="item-grid-container">
        <view v-if="filteredItems.length > 0" class="item-grid">
          <WarehouseCard v-for="item in filteredItems" :key="item.id" :item="item" />
        </view>
        <view v-else class="empty-state">
          <svg class="empty-icon" width="100" height="100" viewBox="0 0 100 100" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 0C22.386 0 0 22.386 0 50s22.386 50 50 50 50-22.386 50-50S77.614 0 50 0zm0 8.333c22.923 0 41.667 18.744 41.667 41.667S72.923 91.667 50 91.667 8.333 72.923 8.333 50 27.077 8.333 50 8.333z"
              fill="#E0E0E0" />
            <path
              d="M62.5 37.5h-25a4.167 4.167 0 00-4.167 4.167v16.666a4.167 4.167 0 004.167 4.167h25a4.167 4.167 0 004.167-4.167V41.667A4.167 4.167 0 0062.5 37.5z"
              fill="#BDBDBD" />
            <path
              d="M50 66.667c-4.6 0-8.333-3.733-8.333-8.334v-8.333c0-4.6 3.733-8.333 8.333-8.333s8.333 3.733 8.333 8.333v8.333c0 4.6-3.733 8.334-8.333 8.334zm0-20.833a4.167 4.167 0 0 0-4.167 4.166v8.334a4.167 4.167 0 0 0 8.334 0v-8.334a4.167 4.167 0 0 0-4.167-4.166z"
              fill="#F5F5F5" />
          </svg>
          <text class="empty-text">暂无物品</text>
        </view>
      </scroll-view>
    </view>
    <!-- Footer Actions -->
    <view class="footer-actions">
      <button class="action-button secondary">一键分解</button>
      <button class="action-button primary">全部提取</button>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import WarehouseCard from '@/components/business/WarehouseCard.vue';

const activeTab = ref('pending');

const tabs = ref([
  { key: 'pending', label: '待操作' },
  { key: 'preorder', label: '预售款' },
  { key: 'treasure', label: '宝箱' },
  { key: 'safe', label: '保险柜' },
]);

const allItems = ref([
	{
		name:"自由女神",
		category: "pending",
		id: 1,
		image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
	},
	{
		name:"自由女神",
		category: "pending",
		id: 2,
		image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
	}
]);

const filteredItems = computed(() => {
  if (activeTab.value === 'all') { // This logic can be expanded later
    return allItems.value;
  }
  // For now, other tabs will also show no items
  return allItems.value.filter(item => item.category === activeTab.value);
});
</script>

<style lang="scss" scoped>
.box-cabinet-page {
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;
  padding-top: var(--status-bar-height);
  height: calc(100vh - var(--tab-bar-height));
  padding-bottom: calc(50px + env(safe-area-inset-bottom));
  box-sizing: border-box;
  overflow: hidden; /* Prevent this container from scrolling */
}

.header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 20rpx 40rpx;
  height: 88rpx;
  background-color: #ffffff;
  flex-shrink: 0;

  .back-button {
    position: absolute;
    left: 40rpx;

    .arrow-left {
      // Simple CSS arrow
      border: solid black;
      border-width: 0 4rpx 4rpx 0;
      display: inline-block;
      padding: 6rpx;
      transform: rotate(135deg);
      -webkit-transform: rotate(135deg);
    }
  }

  .header-title {
    font-size: 36rpx;
    font-weight: bold;
  }
}

.tabs {
  display: flex;
  justify-content: space-around;
  padding: 20rpx;
  background-color: #ffffff;
  border-bottom: 1rpx solid #f0f0f0;
  flex-shrink: 0;

  .tab-item {
    padding: 10rpx 20rpx;
    font-size: 28rpx;
    color: #666;
    border-radius: 10rpx;
    transition: all 0.3s ease;

    &.active {
      background-color: #fff0b3;
      color: #333;
      font-weight: bold;
    }
  }
}
.main{
  flex: 1; /* Allow this element to grow and fill available space */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto; /* Allow scrolling within the main content area */
}
.item-grid-container {
  flex-grow: 1;
  box-sizing: border-box;
  padding: 20rpx;
  overflow-y: auto; /* Allow scrolling within the grid container */
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200rpx, 1fr));
  gap: 20rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #999;
  height: 100%;

  .empty-icon {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 20rpx;
  }

  .empty-text {
    font-size: 28rpx;
  }
}

.footer-actions {
  display: flex;
  padding: 20rpx 40rpx;
  gap: 20rpx;
  flex-shrink: 0;
  position: fixed;
  bottom: 190rpx;
  left: 0;
  right: 0;

  .action-button {
    text-align: center;
    font-size: 30rpx;
    border: none;
    outline: none;
    cursor: pointer;

    &.primary {
      background-color: #ffcc00;
      color: #333;
      font-weight: bold;
    }

    &.secondary {
      background-color: #f0f0f0;
      color: #666;
    }
  }
}
</style>