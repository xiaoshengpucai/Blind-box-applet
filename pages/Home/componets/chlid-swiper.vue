<template>
	<view class="chlid-swiper-container">
		<view class="navigation">
			<view class="nav-left">
				<view class="gplay">
					<up-icon name="order" size="20"></up-icon>
					<text class="gplay-text">玩法</text>
				</view>
				<view class="gplay">
					<up-icon name="bag" size="20"></up-icon>
					<text class="gplay-text">仓库</text>
				</view>
			</view>
			<view class="nav-center">
				<view class="nav_image">
					<image style="width: 300rpx" :src="contentData.image_url" mode="widthFix"></image>
				</view>
			</view>
			<view class="nav-right">
				<view class="swiper-container">
					<view class="swiper-wrapper" :style="wrapperStyle">
						<view class="swiper-items" @click="changeIndex(index)" v-for="(item, index) in initList"
							:key="index">
							<view class="swiper-image-wrapper">
								<image class="swiper-image" :class="{ 'loaded': imageLoadedState[item.id] }"
									:src="item.image_url" mode="aspectFill" @load="onImageLoad(item.id)"
									@error="onImageError(item.id)"></image>
							</view>
							<text class="swiper-label">
								{{ item.title }}
							</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="foot-title">
				{{ contentData.title }}
			</view>
			<view class="foot-price">
				参考价：￥{{ contentData.price }}
			</view>
		</view>
	</view>
</template>

<script setup>
import {
	ref,
	reactive,
	computed,
	onMounted,
	onBeforeUnmount,
	watch,
	nextTick
} from 'vue';
import {
	formatPrice
} from '@/src/utils/format.js'

const props = defineProps({
	datalist: {
		type: Array,
		default: () => []
	},
	autoPlay: {
		type: Boolean,
		default: true
	},
	autoPlayInterval: {
		type: Number,
		default: 3000
	}
});

const imageLoadedState = reactive({});
watch(() => props.datalist, (newDatalist) => {
	if (!newDatalist) return;
	newDatalist.forEach(item => {
		if (imageLoadedState[item.id] === undefined) {
			imageLoadedState[item.id] = false;
		}
	});
}, {
	deep: true,
	immediate: true
});

const onImageLoad = (id) => {
	imageLoadedState[id] = true;
};
const onImageError = (id) => {
	imageLoadedState[id] = true;
};

let autoPlayTimer = null;
const currentIndex = ref(0);
const isAnimating = ref(false);
const transitionEnabled = ref(true);

const initList = computed(() => {
	if (!props.datalist || props.datalist.length === 0) return [];
	return [...props.datalist, ...props.datalist, ...props.datalist];
});

watch(() => props.datalist, (newVal) => {
	if (newVal && newVal.length > 0) {
		transitionEnabled.value = false;
		currentIndex.value = newVal.length;
		nextTick(() => {
			transitionEnabled.value = true;
		});
	}
}, {
	immediate: true,
	deep: true
});

const contentData = computed(() => {
	if (!initList.value || initList.value.length === 0) return {};
	return initList.value[currentIndex.value];
});

const wrapperStyle = computed(() => {
	const itemHeight = 120; // rpx
	const containerHeight = 360; // rpx
	const offset = (containerHeight - itemHeight) / 2;
	const translateY = -currentIndex.value * itemHeight + offset;
	return {
		transform: `translateY(${translateY}rpx)`,
		transition: transitionEnabled.value ? 'transform 0.5s ease-in-out' : 'none',
	};
});

const prevSlide = () => {
	if (isAnimating.value || props.datalist.length <= 1) return;
	isAnimating.value = true;
	transitionEnabled.value = true;
	resetAutoPlay()
	currentIndex.value++;
	if (currentIndex.value >= props.datalist.length * 2) {
		setTimeout(() => {
			transitionEnabled.value = false;
			currentIndex.value = props.datalist.length;
			isAnimating.value = false
		}, 500)
	} else {
		isAnimating.value = false;
	}
};

const startAutoPlay = () => {
	if (!props.autoPlay || props.datalist.length <= 1) return;
	stopAutoPlay();
	autoPlayTimer = setInterval(prevSlide, props.autoPlayInterval);
};

const stopAutoPlay = () => {
	if (autoPlayTimer) {
		clearInterval(autoPlayTimer);
		autoPlayTimer = null;
	}
};

const resetAutoPlay = () => {
	stopAutoPlay();
	startAutoPlay();
};

const changeIndex = (clickedIndex) => {
	if (isAnimating.value||clickedIndex === currentIndex.value) return;
	const trueIndex = clickedIndex % props.datalist.length;
	const targetInMiddle = props.datalist.length + trueIndex;
	isAnimating.value = true;
	transitionEnabled.value = true;
	currentIndex.value = clickedIndex;
	resetAutoPlay();
	if (currentIndex.value !== targetInMiddle) {
		setTimeout(() => {
			transitionEnabled.value = false;
			currentIndex.value = targetInMiddle;
			isAnimating.value = false
		}, 500)
	} else {
		isAnimating.value = false;
	}

};

onMounted(() => {
	startAutoPlay();
});

onBeforeUnmount(() => {
	stopAutoPlay();
});

watch(() => props.autoPlay, (newVal) => {
	if (newVal) {
		startAutoPlay();
	} else {
		stopAutoPlay();
	}
});
</script>

<style lang="scss" scoped>
.chlid-swiper-container {
	height: 530rpx;
	display: flex;
	flex-direction: column;
}

.navigation {
	width: 100vw;
	height: 420rpx;
	display: flex;
	justify-content: space-around;
	align-items: center;

	.nav-left {
		width: 150rpx;
		height: 300rpx;

		.gplay {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 120rpx;
			height: 50rpx;
			border: 1px solid #ccc;
			border-radius: 10rpx;
			margin: 20rpx;
			background-color: #e3e4ffba;

			.gplay-text {
				font-size: 24rpx;
				color: #000;
				font-weight: bold;
				padding: 0 5rpx;
			}
		}
	}

	.nav-center {
		flex: 1;
		height: 360rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		animation: card 3s infinite ease-in-out;
	}

	@keyframes card {
		0% {
			transform: translateY(0);
		}

		50% {
			transform: translateY(-20rpx);
		}

		100% {
			transform: translateY(0);
		}
	}

	.nav-right {
		width: 150rpx;
		height: 355rpx;
		padding-left: 10rpx;
		overflow: hidden;

		.swiper-container {
			width: 100rpx;
			height: 360rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			overflow: hidden;

			.swiper-wrapper {
				transition: transform 0.5s ease-in-out;
			}

			.swiper-items {
				width: 80rpx;
				height: 120rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;

				.swiper-image-wrapper {
					width: 80rpx;
					height: 80rpx;
					border-radius: 15rpx;
					border: 2px solid #A873D5;
					overflow: hidden;
					position: relative;
					background-color: #f0f0f0;

					&::after {
						content: "";
						border: 2px solid #A873D5;
						border-radius: 15rpx;
						position: absolute;
						top: 0;
						left: 0;
						width: 100%;
						height: 100%;
						box-sizing: border-box;
						pointer-events: none;
					}
				}

				.swiper-image {
					width: 100%;
					height: 100%;
					opacity: 0;
					transition: opacity 0.4s ease-in-out;

					&.loaded {
						opacity: 1;
					}
				}

				.swiper-label {
					width: 100%;
					line-height: 31rpx;
					font-size: 14rpx;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
			}
		}
	}
}

.footer {
	width: 100vw;
	height: 110rpx;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.foot-title {
		font-size: 30rpx;
		font-weight: bold;
	}

	.foot-price {
		font-size: 24rpx;
		line-height: 60rpx;
	}
}
</style>