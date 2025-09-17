<template>
	<view class="content">
		<Home v-if="StoreTabbar.activeIndex === 0"></Home>
		<Mall v-if="StoreTabbar.activeIndex === 1"></Mall>
		<Warehouse v-if="StoreTabbar.activeIndex === 2"></Warehouse>
		<Profile v-if="StoreTabbar.activeIndex === 3"></Profile>
	</view>
	<CustomTabBar />
</template>

<script setup>
import Home from '@/pages/Home/index.vue';
import Mall from '@/pages/Mall/index.vue';
import Profile from '@/pages/Profile/index.vue';
import Warehouse from '@/pages/Warehouse/index.vue';
import CustomTabBar from '@/components/custom-tab-bar';

import { useTabbarStore } from '@/stores/tabbar';
import { computed } from 'vue';
const StoreTabbar = useTabbarStore();
</script>

<style lang="scss" scoped></style>
