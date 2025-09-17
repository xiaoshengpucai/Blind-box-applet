<template>
  <view class="profile-page">
    <!-- Header background -->
    <view class="header-bg"></view>

    <!-- Scrollable Content -->
    <scroll-view scroll-y class="scroll-container">
      <view class="content">
        <!-- User Info -->
        <view class="user-info">
          <image class="avatar" src="https://example.com/avatar.jpg" />
          <view class="user-details">
            <text class="username">深田咏美</text>
            <view class="user-id">
              <text class="id-label">ID</text>
              <text class="id-value">64080310</text>
            </view>
          </view>
          <view class="header-right">
            <view class="icon-group">
              <view class="icon">...</view>
              <view class="icon">-</view>
              <view class="icon">O</view>
            </view>
          </view>
        </view>

        <!-- Stats -->
        <view class="stats">
          <view class="stat-item">
            <text class="stat-value">11</text>
            <text class="stat-label">物品</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">0.6</text>
            <text class="stat-label">余额</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">245</text>
            <text class="stat-label">潮点</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">0</text>
            <text class="stat-label">潮盒</text>
          </view>
        </view>

        <!-- Wallet -->
        <view class="wallet-banner">
          <text class="wallet-title">我的钱包</text>
          <text class="wallet-link">去查看 ></text>
        </view>

        <!-- Sections -->
        <view class="section">
          <text class="section-title">常用功能</text>
          <view class="icon-grid">
            <view class="icon-item" v-for="item in commonFunctions" :key="item.label">
              <image :src="item.icon" class="icon-image" />
              <text class="icon-label">{{ item.label }}</text>
            </view>
          </view>
        </view>

        <view class="section">
          <text class="section-title">我的服务</text>
          <view class="icon-grid">
            <view class="icon-item" v-for="item in myServices" :key="item.label">
              <image :src="item.icon" class="icon-image" />
              <text class="icon-label">{{ item.label }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const commonFunctions = ref([
  { icon: '/static/icon/exchange.svg', label: '潮物兑换' },
  { icon: '/static/icon/red-packet.svg', label: '口令红包' },
  { icon: '/static/icon/items.svg', label: '我的物品' },
  { icon: '/static/icon/orders.svg', label: '我的订单' },
]);

const myServices = ref([
  { icon: '/static/icon/support.svg', label: '专属客服' },
  { icon: '/static/icon/address.svg', label: '地址管理' },
  { icon: '/static/icon/settings.svg', label: '设置' },
  { icon: '/static/icon/download.svg', label: 'APP下载' },
  { icon: '/static/icon/details.svg', label: '潮点明细' },
  { icon: '/static/icon/gift-record.svg', label: '赠送记录' },
]);
</script>

<style lang="scss" scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  background-color: #f7f7f7;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 400rpx;
  background: linear-gradient(180deg, #89d8f8 0%, #c4eefd 100%);
  z-index: 0;
}

.scroll-container {
  flex: 1;
  overflow-y: auto;
  z-index: 1;
  padding-top: var(--status-bar-height);
  box-sizing: border-box;
}

.content {
  padding: 0 30rpx 40rpx;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 40rpx 0;

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    border: 4rpx solid #fff;
  }

  .user-details {
    margin-left: 20rpx;
    flex: 1;
  }

  .username {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
  }

  .user-id {
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 20rpx;
    padding: 4rpx 12rpx;
    margin-top: 10rpx;
    width: fit-content;

    .id-label {
      background-color: #ffd700;
      color: #333;
      font-weight: bold;
      border-radius: 8rpx;
      padding: 2rpx 8rpx;
      font-size: 20rpx;
    }

    .id-value {
      color: #fff;
      margin-left: 8rpx;
      font-size: 24rpx;
    }
  }
}
  .header-right {
    .icon-group {
      display: flex;
      align-items: center;
      border: 1px solid #333;
      border-radius: 30rpx;
      padding: 5rpx 10rpx;
      background-color: rgba(255,255,255,0.5);
      .icon {
        margin: 0 5rpx;
        font-size: 24rpx;
        color: #333;
      }
    }
}
.stats {
  display: flex;
  justify-content: space-around;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx 0;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stat-value {
    font-size: 36rpx;
    font-weight: bold;
  }

  .stat-label {
    font-size: 24rpx;
    color: #999;
    margin-top: 8rpx;
  }
}

.wallet-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  color: #fff;
  padding: 20rpx 30rpx;
  border-radius: 16rpx;
  margin-top: 30rpx;

  .wallet-title {
    font-size: 30rpx;
    font-weight: 500;
  }

  .wallet-link {
    font-size: 28rpx;
    color: #ccc;
  }
}

.section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-top: 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

  .section-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
  }

  .icon-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30rpx;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .icon-image {
    width: 80rpx;
    height: 80rpx;
  }

  .icon-label {
    font-size: 24rpx;
    color: #666;
    margin-top: 10rpx;
  }
}
</style>