<template>
  <view class="mall-product-list">
    <MallCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @click="handleCardClick"
    />
  </view>
</template>

<script setup>
import MallCard from './MallCard.vue';

const props = defineProps({
  products: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['product-click']);

const handleCardClick = (product) => {
  emit('product-click', product);
};
</script>

<style lang="scss" scoped>
.mall-product-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 20rpx;
}
</style>
