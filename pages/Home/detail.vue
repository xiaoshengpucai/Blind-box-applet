<template>
	<view class="Chlidren">
		<view class="bg"></view>
		<status-bar>
			<view class="back" @click="back">
				<up-icon name="arrow-left" size="15" bold></up-icon>
			</view>
		</status-bar>
		<view class="main" :style=" {paddingTop: statusBarHeight + 'px'}">
			<chlidSwiperVue :datalist="datalist" :isAnimating="isAnimating" :autoPlay="autoPlay"
				:autoPlayInterval="autoPlayInterval">
			</chlidSwiperVue>
			<view class="tab" :class="tabClassShow?'tab-position':''">
				<preview-vue :datalist="datalist" :level-list="levelList"></preview-vue>
			</view>
		</view>
		<view class="raffle">
			<view class="raffle-type" v-for="item,index in raffleList" :key="item.id"> 
				<view class="raffle-title">
					<view class="raffle-text">
						{{item.price}}
					</view>
				</view>
				<view class="raffle-price">
					￥{{item.price}}
				</view>
			</view>
		</view>
	</view>

</template>

<script setup>
	import {
		ref,
		computed,
		reactive,
		getCurrentInstance,
		onMounted
	} from 'vue';
	import StatusBar from '@/components/status-bar';
	import {
		onLoad,
		onShow,
		onHide,
		onReady,
		onUnload
	} from '@dcloudio/uni-app';
	import chlidSwiperVue from './componets/chlid-swiper.vue';
	import previewVue from './componets/preview.vue';
	import { getInfinteLListDetail } from '@/src/api/layout-list.js';
	// 状态栏高度，采用更符合规范的命名
	const statusBarHeight = ref(0);
	const handleGetBarHeight = (data) => {
		statusBarHeight.value = data;
	};

	const currentIndex = ref(0); // 当前索引
	const isAnimating = ref(false); // 动画状态标记
	const autoPlay = ref(true); // 是否自动播放
	const autoPlayInterval = ref(3000); // 自动播放间隔(毫秒)

	// const datalist = [{
	// 		listId: 1,
	// 		title: '少女乐队的呐喊',
	// 		price: '1100',
	// 		level: '传说',
	// 		chance: 0.5,
	// 		src: 'https://q0.itc.cn/q_70/images03/20240819/15e51341a9364d7b8c9f631b458fb8b5.jpeg'
	// 	},
	// 	{
	// 		listId: 2,
	// 		title: '炽焰x笙歌 原神 女仆浴室共鸣系列 雷电将军',
	// 		price: '2599',
	// 		level: '超神',
	// 		chance: 0.5,
	// 		src: 'https://img1.baidu.com/it/u=3937103606,3676897764&fm=253&fmt=auto&app=120&f=JPEG?w=502&h=500'
	// 	},
	// 	{
	// 		listId: 3,
	// 		title: '原神 可莉·火花骑士Ver.1/7静态手办',
	// 		price: '2599',
	// 		level: '传说',
	// 		chance: 1,
	// 		src: 'https://img1.baidu.com/it/u=1636141268,890026111&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
	// 	},
	// 	{
	// 		listId: 4,
	// 		title: '集美殿堂 进击的巨人 艾伦耶格尔vs女巨人',
	// 		price: '7158',
	// 		level: '传说',
	// 		chance: 1,
	// 		src: 'https://img2.baidu.com/it/u=1357007271,1071071103&fm=253&fmt=auto&app=120&f=JPEG?w=503&h=500'
	// 	},
	// 	{
	// 		listId: 5,
	// 		title: 'coolbear studio三周年 尼尔机械纪元2B 豪华版',
	// 		price: '4680',
	// 		level: '传说',
	// 		chance: 2,
	// 		src: 'https://img0.baidu.com/it/u=478380046,1227329794&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500'
	// 	}, {
	// 		listId: 6,
	// 		title: '魔法少女贴纸',
	// 		price: '10',
	// 		level: '普通',
	// 		chance: 25,
	// 		src: 'https://img2.baidu.com/it/u=188958811,1450173967&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
	// 	}, {
	// 		listId: 7,
	// 		title: '原神贴纸',
	// 		price: '5',
	// 		level: '普通',
	// 		chance: 70,
	// 		src: 'https://img0.baidu.com/it/u=2809378840,1099363868&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
	// 	}
	// ];


	const datalist = ref([]);

	const levelList = [{
			grade: "超神",
			probability: 1,
			sort: 1
		},
		{
			grade: "传说",
			probability: 4,
			sort: 2
		},
		{
			grade: "普通",
			probability: 95,
			sort: 3
		}
	]

	// // 计算属性 - 显示的轮播图列表（包含复制项）

	const calssid = ref(0);
	const category = ref('');
	// 无需导入 onLoad，直接使用
	const instanceRef = ref(null)
	const tabClassShow = ref(false)
	const handleScroll = (data) => {
		if (!data) return
		tabClassShow.value = data
		console.log(tabClassShow.value, data, "-----data-----");
	};
	handleScroll()

	onReady(async () => {
		console.log('页面初次渲染完成时触发');
		instanceRef.value = getCurrentInstance()?.proxy;
		const query = uni.createSelectorQuery().in(instanceRef.value);
	});
	onLoad(async (option) => {
		console.log(option, 'option');
		calssid.value = option.id;
		category.value = option.category;
		const result = await getInfinteLListDetail({category:category.value})
		datalist.value = result;
		console.log('datalist', datalist.value);
		//接收子组件传值
		const handleData = (data) => {
			console.log(data, 'data');
		};
	});
	onMounted(async () => {
		
	})
	const raffleList = [
		{
			id: 1,
			multiple:1,
			title: '买一张',
			price: '10'
		},
		{
			id: 2,
			multiple:3,
			title: '买三张',
			price: '30'
		},
		{
			id: 3,
			multiple:10,
			title: '买十张',
			price: '100'
		}
	]
	
	// 其他生命周期也一样，直接使用
	onShow(() => {
		console.log('页面显示时触发');
	});

	onHide(() => {
		console.log('页面隐藏时触发');
	});
	onUnload(() => {
		console.log("页面销毁");
	})
	const back = () => {
		let pages = getCurrentPages();
		let beforePage = pages[pages.length - 2]; // 获取上一个页面实例对象

		if (!beforePage) {
			uni.switchTab({
				url: '/pages/index/index'
			})
		}
		uni.navigateBack();
	};
</script>

<style lang="scss" scoped>
	body {
		background-color: hsl(0, 0%, 100%);
	}

	.bg {
		width: 100vw;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		z-index: -1;
		background: url('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201712%2F05%2F20171205051539_HUvhM.thumb.400_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1755698284&t=0a49f5933badc42403a845e150616790') no-repeat;
		background-size: 100%;
		// 假设这里进行编码处理（实际可能需要在合适的地方，比如获取图片资源处统一处理）
		background-image: url('https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201712%2F05%2F20171205051539_HUvhM.thumb.400_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1755698284&t=0a49f5933badc42403a845e150616790');
	}

	// .nav-bar-content {
	// 	position: absolute;
	// 	top: 50%;
	// 	left: 0;
	// 	transform: translateY(-50%);
	// }

	.back {
		width: 40rpx;
		height: 40rpx;
		background-color: #fffef4;
		border-radius: 10rpx;
		margin-left: 20rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
	}

	.main {
		height: 100%;
		width: 100vw;
		box-sizing: border-box;
	}


	.card {
		overflow: hidden;
	}

	.p-detail {
		&-content {
			width: 220rpx;
			height: 300rpx;
			border-radius: 10rpx;
			border: 2px solid #58F5DD;
			overflow: hidden;
		}
	}

	.raffle {
		width: 80vw;
		height: 85rpx;
		// background-color: red;
		position: fixed;
		left: 50%;
		bottom: 60rpx;
		transform: translateX(-50%);
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-radius: 10rpx;

		.raffle-type {
			width: 180rpx;
			height: 80rpx;
			background-color: #2E2E2E;
			border-radius: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.raffle-title {
				background-color: #505050;
				width: 120rpx;
				height: 40rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				position: relative;
				top:-5rpx;
				border-radius:0 0 10rpx 10rpx;
				clip-path: polygon(0 0, 100% 0, 85% 100%, 15% 100%);
				/* 创建梯形 */
				transform: rotateX(20deg);
				.raffle-text{
					color: #fff;
					font-size: 26rpx;
					font-weight: 800;
					transform: rotateX(-20deg) skewX(-10deg);
				}
			}
			.raffle-price{
				color: #FFD342;
				line-height: 40rpx;
				font-size: 24rpx;
				font-weight: 800;
			}
		}
	}
</style>