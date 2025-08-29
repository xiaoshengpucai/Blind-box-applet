<template>
	<view class="mall">
		<view class="swiper-container">
			<view class="swiper-wrapper" 
				:style="{
					transform: `translateX(${-currentIndex * 100}%)`,
					transition: transitionStyle
				}"
				@transitionend="handleTransitionEnd">
				<view class="swiper-slide" v-for="(item, index) in swiperList" :key="index">
					<image class="slide-image" :src="item.url" mode="aspectFill"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup>
import { nextTick, ref } from 'vue'

// 原始轮播数据
const originalImages = [
	{ url: 'https://img1.baidu.com/it/u=4250025404,3394384390&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1082' },
	{ url: 'https://img2.baidu.com/it/u=33930452,3866960736&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=722' },
	{ url: 'https://img2.baidu.com/it/u=481074814,730334518&fm=253&fmt=auto&app=120&f=PNG?w=500&h=656' }
]

// 处理轮播列表 - 添加首尾复制项
const swiperList = ref([
	originalImages[originalImages.length - 1],  // 最后一张的复制放在前面
	...originalImages,                         // 原始图片
	originalImages[0]                          // 第一张的复制放在后面
])

// 当前显示索引 (从1开始，指向第一张真实图片)
const currentIndex = ref(1)
// 过渡样式
const transitionStyle = ref('transform 0.5s ease-out')
// 轮播项总数
const totalSlides = swiperList.value.length
// 真实图片数量
const realImageCount = originalImages.length

// 处理过渡结束事件 - 关键的无缝切换逻辑
const handleTransitionEnd =() => {
	// 当滑动到最后一个复制项(原始第一张的复制)
	if (currentIndex.value === totalSlides - 1) {
		// 关闭过渡，瞬间切换到真实的第一张
		transitionStyle.value = 'none'
		currentIndex.value = 1
		// 强制DOM更新后重新启用过渡效果
		// 使用setTimeout确保在下一帧执行
		setTimeout(() => {
			transitionStyle.value = 'transform 0.5s ease-out'
		}, 0)
		// 使用nextTick确保在DOM更新后执行

	}
	// 当滑动到最前面的复制项(原始最后一张的复制)
	else if (currentIndex.value === 0) {
		// 关闭过渡，瞬间切换到真实的最后一张
		transitionStyle.value = 'none'
		currentIndex.value = realImageCount
		// 强制DOM更新后重新启用过渡效果
		setTimeout(() => {
			transitionStyle.value = 'transform 0.5s ease-out'
		}, 0)
	}
	
	// 继续自动播放
	setTimeout(() => {
		currentIndex.value++
	}, 2000)
}

// 初始化自动播放
setTimeout(() => {
	currentIndex.value++
}, 2000)

</script>

<style lang='scss' scoped>
.mall {
	width: 500rpx;
	height: 700rpx;
	border: 10rpx solid #000;
	margin: 50px auto;
	position: relative;
}

.swiper-container {
	width: 100%;
	height: 100%;
	overflow: hidden;  // 关键：隐藏超出容器的内容
	position: relative;
}

.swiper-wrapper {
	width: 100%;
	height: 100%;
	display: flex;     // 关键：让轮播项横向排列
}

.swiper-slide {
	width: 100%;       // 每个轮播项占满容器宽度
	height: 100%;
	flex-shrink: 0;    // 关键：防止轮播项被压缩
}

.slide-image {
	width: 100%;
	height: 100%;
	object-fit: cover; // 确保图片正确填充容器
}
</style>
