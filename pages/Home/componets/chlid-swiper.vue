<template>
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
				<image style="width: 300rpx" :src="contentData.src" mode="widthFix"></image>
			</view>
		</view>
		<view class="nav-right">
			<view class="swiper-container">
				<view class="swiper-items" @click="changeIndex(item.listId)" v-for="(item, index) in initList"
					:key="item.keyPrefix" :style="{ transform: translateY, transition: transitionStyle }">
					<image class="swiper-image" :src="item.src" mode="widthFix"></image>
					<text class="swiper-label">
						{{item.title}}
					</text>
				</view>
			</view>
		</view>
	</view>
	<view class="footer">
		<view class="foot-title">
			{{contentData.title}}
		</view>
		<view class="foot-price">
			参考价：￥{{contentData.price}}
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		reactive,
		computed,
		onMounted
	} from 'vue';
	import {
		formatPrice
	} from '@/src/utils/format.js'
	const props = defineProps({
		datalist: {
			type: Array,
			default: () => []
		},
		isAnimating: {
			type: Boolean,
			default: false
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

	let {
		datalist,
		isAnimating,
		autoPlay,
		autoPlayInterval
	} = props;
	let autoPlayTimer = null;
	const currentIndex = ref(0);
	const transitionStyle = ref('transform 0.5s ease');
	const translateY = computed(() => {
		return `translateY(-${currentIndex.value * 100}%)`;
	});
	const contentData = ref({})
	contentData.value = datalist[0];
	const initList = computed(() => {
		datalist.forEach((item) => {
			item.price = formatPrice(item.price, {useThousand: true})
		})
		// 为无缝轮播复制首尾项
		return [
			// 复制最后一张放在开头
			...datalist.map(item => ({ ...item, keyPrefix: `prev-${item.listId}` })),
			// 原始轮播图
			...datalist.map(item => ({ ...item, keyPrefix: `original-${item.listId}` })),
			// 复制第一张放在结尾
			...datalist.map(item => ({ ...item, keyPrefix: `next-${item.listId}` }))
		];
	});
	//自动播放
	const startAutoPlay = () => {
		autoPlayTimer = setInterval(() => {
			prevSlide();
		}, autoPlayInterval);
	};

	const prevSlide = () => {
		if (isAnimating) return;
		isAnimating = true;
		transitionStyle.value = 'transform 0.5s ease';
		resetAutoPlay();
		currentIndex.value++;
		contentData.value = initList.value[currentIndex.value];
		if (currentIndex.value > datalist.length) {
			setTimeout(() => {
				transitionStyle.value = 'none';
				currentIndex.value = 1;
				isAnimating = false;
			}, 500);
		} else {
			isAnimating = false;
		}
	};

	onMounted(() => {
		startAutoPlay();
	});

	// 停止自动播放
	function stopAutoPlay() {
		if (autoPlayTimer) {
			clearInterval(autoPlayTimer);
			autoPlayTimer = null;
		}
	}

	// 重置自动播放计时器
	function resetAutoPlay() {
		stopAutoPlay();
		startAutoPlay();
	}

	function changeIndex(index) {
		stopAutoPlay()
		contentData.value = initList.value[index - 1]
		startAutoPlay()
	}
</script>

<style lang="scss" scoped>
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

				.swiper-items {
					width: 80rpx;
					height: 120rpx;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					.swiper-image {
						width: 100%;
						height: 100%;
						border-radius: 15rpx;
						border: 2px solid #A873D5;

						&::after {
							content: "";
							border: 2px solid #A873D5;
							border-radius: 15rpx;
							position: absolute;
							top: 1rpx;
							left: 2rpx;
							width: 100%;
							height: 80rpx;
							z-index: 99;
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