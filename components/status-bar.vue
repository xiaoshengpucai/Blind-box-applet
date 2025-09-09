<template>
	<view class="status-bar-container">
		<!-- 固定定位的导航栏 -->
		<view class="nav" @touchmove.stop.prevent="() => {}">
			<!-- 状态栏占位 -->
			<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
			<!-- 导航栏 -->
			<view class="nav-bar" :style="{ height: navBarHeight + 'px' }">
				<view class="nav-bar-content" :style="{ paddingLeft: navBarRight + 'rpx' }">
					<slot></slot>
				</view>
			</view>
		</view>
		
		<!-- 占位元素，防止内容被遮挡 -->
		<view class="status-bar-placeholder" :style="{ height: totalHeight + 'px' }"></view>
	</view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 响应式数据
const statusBarHeight = ref(0)
const navBarHeight = ref(0)
const totalHeight = ref(0)
const navBarRight = ref(0)

// 初始化状态栏高度
const initStatusBarHeight = () => {
	try {
		const systemInfo = uni.getWindowInfo()
		let statusHeight = systemInfo.statusBarHeight + 22
		let navHeight = statusHeight + 22
		let total = statusHeight + navHeight
		let rightPadding = systemInfo.windowWidth
		
		// #ifdef MP-WEIXIN
		try {
			// 获取胶囊位置
			const menuButtonInfo = uni.getMenuButtonBoundingClientRect()
			statusHeight = systemInfo.statusBarHeight
			navHeight = menuButtonInfo.bottom - statusHeight + 4
			total = statusHeight + navHeight
			rightPadding = menuButtonInfo.left - menuButtonInfo.width / 2
		} catch (error) {
			console.warn('获取胶囊位置失败，使用默认值:', error)
		}
		// #endif
		
		// 确保最小高度
		statusHeight = Math.max(statusHeight, 20)
		navHeight = Math.max(navHeight, 44)
		total = statusHeight + navHeight
		
		statusBarHeight.value = statusHeight
		navBarHeight.value = navHeight
		totalHeight.value = total
		navBarRight.value = rightPadding
		
		
		// 向父组件传递高度信息
		emit('statusBarHeight', total)
		
		console.log('状态栏高度初始化成功:', {
			statusBarHeight: statusHeight,
			navBarHeight: navHeight,
			totalHeight: total,
			navBarRight: rightPadding
		})
	} catch (error) {
		console.error('初始化状态栏高度失败:', error)
		// 使用默认值
		statusBarHeight.value = 44
		navBarHeight.value = 44
		totalHeight.value = 88
		navBarRight.value = 0
		emit('statusBarHeight', 88)
	}
}

// 定义事件
const emit = defineEmits(['statusBarHeight'])

// 暴露方法给父组件
defineExpose({
	initStatusBarHeight,
	getStatusBarHeight: () => totalHeight.value,
	updateHeight: (height) => {
		if (height && height > 0) {
			totalHeight.value = height
			emit('statusBarHeight', height)
		}
	}
})

// 组件挂载后初始化
onMounted(() => {
	// 延迟初始化，确保系统信息已准备就绪
	setTimeout(() => {
		initStatusBarHeight()
	}, 100)
})
</script>

<style lang="scss" scoped>
.status-bar-container {
	width: 100%;
	/* 主容器样式 */
}

.nav {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 999;
	background-color: transparent;
	/* 确保导航栏在最顶层 */
}

.status-bar {
	width: 100%;
	background-color: transparent;
	/* 状态栏占位，不显示内容 */
}

.nav-bar {
	position: relative;
	width: 100%;
	background-color: transparent;
	z-index: 999;
	/* 导航栏容器 */
}

.nav-bar-content {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	// justify-content: flex-end;
	/* 导航栏内容布局 */
}

/* 占位元素样式 - 关键：防止内容被遮挡 */
.status-bar-placeholder {
	width: 100%;
	background-color: transparent;
	/* 这个元素用于占位，防止页面内容被固定定位的导航栏遮挡 */
	/* 高度等于状态栏 + 导航栏的总高度 */
	box-sizing: border-box;
}

/* 响应式设计 */
@media screen and (max-width: 750rpx) {
	.nav {
		/* 小屏幕适配 */
	}
}

/* 确保在不同平台上都能正确显示 */
/* #ifdef MP-WEIXIN */
.nav {
	/* 微信小程序特殊处理 */
}
/* #endif */

/* #ifdef H5 */
.nav {
	/* H5平台特殊处理 */
}
/* #endif */
</style>
