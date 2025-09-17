<template>
  <view class="warehouse-card">
    <view class="warehouse-card__image-container">
      <image :src="item.image" class="warehouse-card__image" mode="aspectFill" />
      <view class="warehouse-card__quantity-badge">
        <view class="warehouse-card__quantity-text">
			<label>
				<checkbox :value="mycard" color="#f56c6c" style="transform:scale(0.7)" />
			</label>
		</view>
      </view>
    </view>
    <view class="warehouse-card__info">
      <text class="warehouse-card__title">{{ item.name }}</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.warehouse-card {
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

  &__image-container {
    width: 100%;
    padding-top: 100%; /* Square aspect ratio */
    position: relative;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__quantity-badge {
    position: absolute;
    top: 10rpx;
    right: 0rpx;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 20rpx;
    padding: 4rpx 12rpx;
  }

  &__quantity-text {
    font-size: 24rpx;
    font-weight: 500;
  }

  &__info {
    padding: 16rpx;
  }

  &__title {
    font-size: 28rpx;
    color: #333;
    text-align: center;
    
    /* Ellipsis for long text */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
