<template>
	<view class="nav">
		<view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
		<view class="nav-bar" :style="{ height: navBarHeight + 'px' }">
			<view class="nav-bar-content" :style="{ paddingRight: navBarRight + 'px' }">
				<slot></slot>
			</view>
		</view>
	</view>
</template>

<script setup>
//获取顶部安全位置
const systemInfo = uni.getWindowInfo();
let statusBarHeight = systemInfo.statusBarHeight + 22;
let navBarHeight = statusBarHeight + 22;
let navBarRight = systemInfo.windowWidth - 330;
//#ifdef MP-WEIXIN
//获取胶囊位置
const menuButtonInfo = uni.getMenuButtonBoundingClientRect();
statusBarHeight = systemInfo.statusBarHeight;
navBarRight = systemInfo.windowWidth - menuButtonInfo.right + menuButtonInfo.width;
navBarHeight = menuButtonInfo.bottom - statusBarHeight + 4;
//#endif
//高度传递
const emit = defineEmits(['statusBarHeight']);
// const emit = defineEmits(['statusBarHeight','click-outside'])
emit('statusBarHeight', statusBarHeight + navBarHeight);
// 在status-bar组件内部（如果status-bar是自定义组件的话）
const handleClickOutside = () => {
	emits('click-outside');
};
</script>

<style lang="scss">
.nav {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 1;
}

.status-bar {
	width: 100%;
}

.nav-bar {
	position: relative;
	z-index: 1;
}
</style>
