<template>
	<view class='container' :style='safeAreaStyle' @touchmove.stop.prevent="() => {}">
		<view class="tabbar-item" v-for="(item,index) in Store.tabList" :key='index'
			@click="switchTab(item.pagePath,index)" :class="{ 'active': Store.activeIndex === index }">
			<view class="item-container">
				<view class="icon-wrapper">
					<image :src='item.iconPath' class="icon"></image>
				</view>
				<view class="text-label">
					<text class="label">{{item.text}}</text>
				</view>
			</view>
		</view>
		<!-- 动态绑定边框位置（left+top） -->
		<view class="highline" :style="`left: ${lineLeft}px; top: ${lineTop}px`"></view>
	</view>
</template>

<script setup>
	import {
		useTabbarStore
	} from "@/stores/tabbar"
	import {
		ref,
		onMounted,
		getCurrentInstance,
		nextTick
	} from "vue";
	const itemRefs = ref([])
	const instanceRef = ref(null)
	const lineLeft = ref(0)
	const lineTop = ref(0)
	const Store = useTabbarStore()
	// 安全区域处理
	const safeAreaStyle = {
		paddingBottom: "env(safe-area-inset-bottom)"
	}

	const switchTab = (path, index) => {
		if (Store.activeIndex === index) return

		// 添加临时防抖处理
		if (Store.switchLock) return
		Store.switchLock = true

		setTimeout(() => {
			Store.switchLock = false
		}, 300)

		Store.setActiveIndex(index)
		nextTick(() => {
			getIconPosition()
		})
	}

	onMounted(() => {
		instanceRef.value = getCurrentInstance()?.proxy
		setTimeout(() => {
			getIconPosition()
		}, 300)

	})

	const getIconPosition = () => {
		if (!instanceRef.value) {
			console.warn('Component instance not ready')
			return
		}

		// 创建作用域查询
		const query = uni.createSelectorQuery().in(instanceRef.value)

		// 精确查询目标元素（添加唯一class）
		query.select(`.tabbar-item`)
			.boundingClientRect(rect => {
				if (!rect) {
					return
				}
				// 跨平台位置计算
				// const systemInfo = uni.getWindowInfo()
				const isMP = process.env.UNI_PLATFORM?.startsWith('mp')
				lineLeft.value = rect.right * (Store.activeIndex) + rect.width/2
				// 垂直位置计算
				lineTop.value = rect.height / 2

			})
			.exec()
	}
</script>

<style lang="scss" scoped>
	.container {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 160rpx;
		display: flex;
		align-items: center;
		background: #FFFFFF;
		backdrop-filter: blur(10px);
		box-shadow: 0px -1px 10px rgba(0, 0, 0, 0.1);
		-webkit-backdrop-filter: blur(10px);
		z-index: 999;
	}
	
	.tabbar-item {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
	}
	.icon-wrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		transform: translateY(-25rpx);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.icon {
		width: 80rpx;
		height: 80rpx;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: center bottom; 
		will-change: transform;
		// transform: scale(1.2);
		filter: drop-shadow(0 5rpx 5rpx rgba(255, 0, 0, 0.3));
	}
	.text-label{
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.label {
		font-size: 28rpx;
		font-weight: bold;
		color: #999;
		position: absolute;
		opacity: 1;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		will-change: transform, opacity;
		// bottom:0rpx;
	}

	.active {
		.icon-wrapper {
			transform: translateY(-50rpx);
		}

		.label {
			color: red;
		}

	}


	.highline {
		width: 100rpx;
		height: 100rpx;
		padding: 12rpx;
		position: fixed; // 改为固定定位
		transform: translate(-50%, -50%); // 中心对齐
		/* 透明边框 */
		border-radius: 50%;
		/* 假设圆形凸起，可根据需求调整 */
		box-shadow: 0 2rpx 2rpx rgba(0, 0, 0, 0.1);
		/* 模拟凸起阴影 */
		pointer-events: none;
		/* 不影响点击 */
		transition: all 0.3s ease;
		/* 过渡动画 */
		z-index: -1;
		-webkit-mask: radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.5) 51%);
		mask: radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.5) 51%);
		background: rgba(0, 0, 0, 0.5);
	}
</style>