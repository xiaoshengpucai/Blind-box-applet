<template>
  <view class="mall-card" @click="handleClick">
    <view class="mall-card__image-container">
      <image :src="product.img || product.image_url" class="mall-card__image" mode="aspectFill" />
    </view>
    <view class="mall-card__info">
      <text class="mall-card__title">{{ product.Title || product.category }}</text>
      <text class="mall-card__price">¥{{ product.price }}</text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['click']);

const handleClick = () => {
  emit('click', props.product);
};
</script>

<style lang="scss" scoped>
.mall-card {
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;

  &__image-container {
    width: 100%;
    padding-top: 100%; /* Creates a square aspect ratio for the container */
    position: relative;
    overflow: hidden;
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &__info {
    padding: 16rpx;
    min-height: 120rpx; /* Set a min-height to ensure consistent card height */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__title {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    line-height: 1.4;
    
    /* Ellipsis for long text */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__price {
    margin-top: 8rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #e54d42;
  }
}
</style>
