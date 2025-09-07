<template>
  <view class="welfare-cards-container" :style="containerStyle">
    <view 
      v-for="card in welfareCards"
      :key="card.id"
      class="welfare-card"
      @click.stop="handleCardClick(card)"
    >
      <!-- 卡片背景 -->
      <view :class="card.backgroundClass"></view>
      
      <!-- 卡片内容 -->
      <view :class="card.contentClass">
        <view :class="card.titleClass">{{ card.title }}</view>
        <view class="welfare-button">
          <text class="button-text" :style="{ color: card.buttonColor }">
            {{ card.buttonText }}
          </text>
          <up-icon 
            class="button-icon" 
            name="play-right-fill" 
            size="10" 
            :color="card.buttonColor"
          ></up-icon>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue';

// ==================== Props定义 ====================
const props = defineProps({
  // 福利卡片数据
  cards: {
    type: Array,
    default: () => [{}]
  },
  
  // 容器样式配置
  containerConfig: {
    type: Object,
    default: () => ({
      width: '100vw',
      height: '28vw',
      padding: '20rpx 0 0 0'
    })
  },
  
  // 是否启用动画
  enableAnimation: {
    type: Boolean,
    default: true
  },
  
  // 自定义样式
  customStyle: {
    type: Object,
    default: () => ({})
  }
});

// ==================== Emits定义 ====================
const emit = defineEmits(['card-click']);

// ==================== 计算属性 ====================
/**
 * 福利卡片数据
 */
const welfareCards = computed(() => props.cards);
/**
 * 容器样式
 */
const containerStyle = computed(() => ({
  ...props.containerConfig,
  ...props.customStyle
}));

// ==================== 方法 ====================
/**
 * 处理卡片点击
 * @param {Object} card - 卡片数据
 */
const handleCardClick = (card) => {
  emit('card-click', card);
};

</script>

<style lang="scss" scoped>
// ==================== 福利卡片容器 ====================
.welfare-cards-container {
  width: 100vw;
  height: 28vw;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.welfare-card {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:active {
    transform: scale(0.95);
  }
}

// ==================== DIY卡片样式 ====================
.welfare-bg-diy {
  width: 180rpx;
  height: 160rpx;
  border: 8rpx solid #b3d3ff;
  background-color: #67a3f7;
  transform: skewX(-15deg);
  border-radius: 15px;
  position: relative;
  left: 20rpx;

  // DIY卡片左侧阴影效果
  &::before {
    content: '';
    width: 180rpx;
    height: 160rpx;
    position: absolute;
    left: -35rpx;
    top: -8rpx;
    border-left: 8rpx solid #b3d3ff;
    border-top: 8rpx solid #b3d3ff;
    border-bottom: 8rpx solid #b3d3ff;
    background-color: #67a3f7;
    transform: skewX(15deg);
    border-radius: 30rpx 0 15rpx 30rpx;
    z-index: -2;
  }
}

// ==================== 专属福利卡片样式 ====================
.welfare-bg-exclusive {
  width: 220rpx;
  height: 160rpx;
  background-color: #ed776f;
  transform: skewX(-15deg);
  border: 8rpx solid #ffb3ae;
  border-radius: 30rpx;
}

.welfare-content-exclusive {
  position: relative;
  padding: 0 18rpx;
}

// ==================== ROLL房卡片样式 ====================
.welfare-bg-roll {
  width: 180rpx;
  height: 160rpx;
  border: 8rpx solid #9d8bee;
  background-color: #715dc9;
  transform: skewX(-15deg);
  border-radius: 15px;
  position: relative;
  left: -20rpx;

  // ROLL卡片右侧阴影效果
  &::before {
    content: '';
    position: absolute;
    width: 160rpx;
    height: 100%;
    right: -32rpx;
    top: -7rpx;
    border-right: 8rpx solid #9d8bee;
    border-top: 8rpx solid #9d8bee;
    border-bottom: 8rpx solid #9d8bee;
    background-color: #715dc9;
    border-radius: 0rpx 30rpx 30rpx 0rpx;
    transform: skewX(15deg);
    z-index: -1;
  }
}

// ==================== 福利卡片内容样式 ====================
.welfare-content {
  position: absolute;
  left: -10rpx;
  top: 5rpx;
  width: 220rpx;
  height: 180rpx;
  border-radius: 15px;
  display: flex;
  transform: skewX(-15deg);
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

// DIY卡片背景文字
.welfare-content-diy::before {
  content: 'DIY';
  position: absolute;
  top: -20rpx;
  left: 50rpx;
  text-shadow: none;
  font-weight: bold;
  font-family: 'stkaiti';
  color: white;
  font-size: 60rpx;
  transform: scale(1.6);
  letter-spacing: 5rpx;
  text-transform: uppercase;
  opacity: 0.2;
}

// 专属福利卡片背景文字
.welfare-content-exclusive::after {
  content: 'ZHUANSHU';
  position: absolute;
  top: -20rpx;
  left: 100rpx;
  text-shadow: none;
  font-weight: bold;
  font-family: 'stkaiti';
  color: white;
  font-size: 60rpx;
  transform: scale(1.4);
  letter-spacing: 5rpx;
  text-transform: uppercase;
  opacity: 0.3;
}

// ROLL房卡片背景文字
.welfare-content-roll::before {
  content: 'Roll';
  position: absolute;
  top: -20rpx;
  left: 60rpx;
  text-shadow: none;
  font-weight: bold;
  font-family: 'stkaiti';
  color: white;
  font-size: 60rpx;
  transform: scale(1.6);
  letter-spacing: 5rpx;
  text-transform: uppercase;
  opacity: 0.2;
}

// ==================== 福利卡片标题样式 ====================
.welfare-title {
  transform: scale(1.5);
  font-family: 'stkaiti';
  color: white;
  font-weight: bold;
  letter-spacing: 2rpx;
  padding: 5rpx 0;
}

// 各类卡片标题特殊阴影效果
.welfare-title-diy {
  text-shadow: 
    -1px -1px 0 #246bcf, 
    1px -1px 0 #246bcf, 
    -1px 1px 0 #246bcf, 
    1px 1px 0 #246bcf;
}

.welfare-title-exclusive {
  text-shadow: 
    -1px -1px 0 red, 
    1px -1px 0 red, 
    -1px 1px 0 red, 
    1px 1px 0 red;
}

.welfare-title-roll {
  text-shadow: 
    -1px -1px 0 #302756, 
    1px -1px 0 #302756, 
    -1px 1px 0 #302756, 
    1px 1px 0 #302756;
}

// ==================== 福利卡片按钮样式 ====================
.welfare-button {
  height: 40rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10rpx;
  padding: 0rpx 15rpx;
  font-weight: bold;
  letter-spacing: 2rpx;
  transform: skewX(15deg);
  transition: all 0.2s ease;
  cursor: pointer;

  &:active {
    transform: skewX(15deg) scale(0.95);
  }
}

.button-text {
  padding-right: 5rpx;
}

.button-icon {
  flex-shrink: 0;
}

// ==================== 响应式设计 ====================
@media screen and (max-width: 750rpx) {
  .welfare-cards-container {
    flex-direction: column;
    height: auto;
    gap: 20rpx;
    // padding: 30rpx 0;
  }
  
  .welfare-card {
    width: 80%;
    max-width: 400rpx;
  }
  
  .welfare-bg-diy,
  .welfare-bg-exclusive,
  .welfare-bg-roll {
    width: 200rpx;
    height: 140rpx;
  }
  
  .welfare-content {
    width: 200rpx;
    height: 140rpx;
  }
}

@media screen and (min-width: 1200rpx) {
  .welfare-cards-container {
    max-width: 1200rpx;
    margin: 0 auto;
  }
}
</style>
