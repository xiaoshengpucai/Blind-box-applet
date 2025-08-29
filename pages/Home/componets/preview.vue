<template>
	<view class="tab" :class="preSetPositon?'tab-position':''">
		<view class="tab-box">
			<view class="tab-item" @click="handleTabClick(0)">
				赏品预览
			</view>
			<view class="tab-item " @click="handleTabClick(1)">
				中赏记录
			</view>
			<view class="active" :style="{left:tabChangeLeft+'px'}"></view>
		</view>
		<view class="preview" v-if="tabChangeIndex === 0">
			<view class="controls-left" @click="tagLeft()">
				<image class="icon" style="width:80rpx;opacity: 0.5;"
					src="data:image/svg+xml;base64,PHN2ZyB0PSIxNzU0NDA3MjUyMjM4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEzNjYgMTAyNCIgdmVyc2lvbj0iMS4xIg0KCQkJCQl4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEwMDQ0IiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPg0KCQkJCQk8cGF0aA0KCQkJCQkJZD0iTTc5Ni40NDQ0NDQgODA0LjU3MTQyOCA3OTYuNDQ0NDQ0IDEwMjQgMCA1MTIgNzk2LjQ0NDQ0NCAwIDc5Ni40NDQ0NDQgMjE5LjQyODU3MiAzNDEuMzMzMzMzIDUxMiA3OTYuNDQ0NDQ0IDgwNC41NzE0MjhaTTEzNjUuMzMzMzMzIDEwMjQgMTM2NS4zMzMzMzMgMCA1NjguODg4ODg5IDUxMiAxMzY1LjMzMzMzMyAxMDI0WiINCgkJCQkJCWZpbGw9IiNmNGVhMmEiIHAtaWQ9IjEwMDQ1Ij48L3BhdGg+DQoJCQkJPC9zdmc+"
					mode="widthFix">
				</image>
			</view>
			<view class="tag-list">
				<view class="tag-item" :class="{'active':changeTag === item.tag}"
					:style="{backgroundColor:getTagColor(item.tag).Color}" v-for="item,index in tagLabel" :key="index"
					@click="handleClickTag(item.tag)">
					<text class="tag">{{item.tag}}</text>
					<text class="chance">{{item.chance}}</text>
				</view>
			</view>
			<view class="controls-right" @click="tagRight()">
				<image class="icon" style="width:80rpx;opacity: 0.5;"
					src="data:image/svg+xml;base64,PHN2ZyB0PSIxNzU0NDA3MzAzNzg0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEzNjYgMTAyNCIgdmVyc2lvbj0iMS4xIg0KCQkJCQl4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjExNDM1IiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPg0KCQkJCQk8cGF0aA0KCQkJCQkJZD0iTTU2OC44ODg4ODkgODA0LjU3MTQyOCA1NjguODg4ODg5IDEwMjQgMTM2NS4zMzMzMzMgNTEyIDU2OC44ODg4ODkgMCA1NjguODg4ODg5IDIxOS40Mjg1NzIgMTAyNCA1MTIgNTY4Ljg4ODg4OSA4MDQuNTcxNDI4Wk0wIDEwMjQgMCAwIDc5Ni40NDQ0NDQgNTEyIDAgMTAyNFoiDQoJCQkJCQlmaWxsPSIjZjRlYTJhIiBwLWlkPSIxMTQzNiI+PC9wYXRoPg0KCQkJCTwvc3ZnPg=="
					mode="widthFix"></image>
			</view>
		</view>
		<view class="record" v-if="tabChangeIndex === 1">
			<view class="record-list">
				<view class="record-item" v-for="item,index in tagLabel" :key="index"
					@click="changRecordIndex(index,item.tag)">
					<text class="tag">{{item.tag}}</text>
				</view>
				<view class="record-active" :style="{left:recordChangeLeft+'px'}"></view>
			</view>
		</view>
	</view>
	<view class="p-detail" :style="preSetPositon?{'marginTop':150+'px'}:''" v-if="tabChangeIndex === 0">
		<view class="p-detail-content" v-for="(item,index) in filteredList" :key="item.listId"
			:style="{borderColor:getTagColor(item.level).Color}" @click="showPopup(item.listId)">
			<view class="p-img">
				<image class="_img" :src="item.src" mode="heightFix"></image>
			</view>
			<view class="p-text" :style="{background:getTagColor(item.level).bgColor}">
				<text class="u-p-t-price"> {{item.price}}元</text>
				<text class="u-p-t-title"> {{item.title}}</text>
			</view>
		</view>
	</view>
	<view class="record-detail" v-if="tabChangeIndex === 1">
		<view class="record-detail-list" v-for="(item,index) in recordDetailList" :key="index"
			:style="{borderColor:getTagColor(item.level).Color,backgroundColor:getTagColor(item.level).recolor}">
			<view class="r-d-img">
				<image class="_image" :src="item.smallPicurl" mode="aspectFill"></image>
			</view>
			<view class="r-d-">
				111
			</view>
		</view>
	</view>
	<up-popup :show="show" :round="10" mode="center" @open="showPopup" @close="closePopup">
		<view class="up-popup" v-if="showData">
			<view class="show-image" :style="{borderColor:getTagColor(showData.level).Color}">
				<image :src="showData.src" mode="widthFix"></image>
			</view>
			<view class="show-detail">
				<text class="s-t-title">
					{{showData.title}}
				</text>
				<text class="s-t-chance">
					概率&nbsp;&nbsp;{{showData.chance}}%
				</text>
				<text class="s-t-price">
					价格&nbsp;&nbsp;{{showData.price}}
				</text>
			</view>
		</view>
	</up-popup>
</template>

<script setup>
	import {
		computed,
		ref,
		reactive,
		getCurrentInstance,
		onMounted,
		watch,
		nextTick
	} from 'vue'
	import {
		onReady,
		onPageScroll
	} from '@dcloudio/uni-app'

	const props = defineProps({
		datalist: {
			type: Array,
			default: () => []
		},
		levelList: {
			type: Array,
			default: () => []
		}
	})
	const {
		datalist,
		levelList
	} = props

	const tabChangeIndex = ref(1);
	const handleTabClick = (index) => {
		if (tabChangeIndex.value === index) return
		tabChangeIndex.value = index
	};

	const tabInfo = ref([]);
	const tabChangeLeft = computed(() => {
		return tabInfo.value[tabChangeIndex.value]?.left + 3;
	});


	let changeTag = ref('超神')
	//映射规则
	const sortOrder = {
		'超神': 1,
		'传说': 2,
		'普通': 3
	}
	const tagColors = {
		'超神': '#53F1E3',
		'传说': '#B3F5C0',
		'普通': '#CAA8E5'
	}


	const tagList = computed(() => {
		const result = {}
		datalist.forEach(item => {
			const {
				level,
				chance
			} = item
			if (!result[level]) {
				result[level] = []
			}
			result[level] = {
				Total: result[level].Total ? result[level].Total + 1 : 1,
				chance: result[level].chance ? result[level].chance + chance : chance
			}
		})
		return result
	})

	const tagLabel = computed(() => {
		const entries = Object.entries(tagList.value)
			.map(([key, value]) => ({
				tag: key,
				...value
			}))
			.sort((a, b) => sortOrder[a.tag] - sortOrder[b.tag])
		return entries
	})

	watch(tagLabel, (newVal) => {
		if (newVal.length > 0) {
			changeTag.value = newVal[0].tag
		}
	}, {
		immediate: true
	})
	
	//处理颜色函数
	function hexToRgba(hex,opacity){
		hex = hex.replace('#','')
		const r = parseInt(hex.substring(0,2),16)
		const g = parseInt(hex.substring(2,4),16)
		const b = parseInt(hex.substring(4,6),16)
		return `rgba(${r},${g},${b},${opacity})`
	}
	
	
	const getTagColor = (tag) => {
		return {
			Color: hexToRgba(tagColors[tag],1) || '#ccc',
			bgColor: `linear-gradient(to bottom, ${hexToRgba(tagColors[tag],.5)} 0%, #fff 25%)`,
			recolor: `${hexToRgba(tagColors[tag],0.2)}`
		}
	}
	const currentTagIndex = ref(0)

	function handleClickTag(tag) {
		if (tag === changeTag.value) return
		changeTag.value = tag
	}

	function tagLeft() {
		currentTagIndex.value = currentTagIndex.value === 0 ?
			tagLabel.value.length - 1 :
			currentTagIndex.value - 1
		changeTag.value = tagLabel.value[currentTagIndex.value].tag
	}

	function tagRight() {
		currentTagIndex.value = currentTagIndex.value === tagLabel.value.length - 1 ?
			0 :
			currentTagIndex.value + 1
		changeTag.value = tagLabel.value[currentTagIndex.value].tag
	}

	// 先创建计算属性
	const filteredList = computed(() => {
		return datalist.filter(item => item.level === changeTag.value)
	})

	const instance = getCurrentInstance()
	let previewRect = reactive([])
	const preSetPositon = ref(false)
	const recordIndex = ref(0)
	const recordChangeRect = ref([])
	const recordChangeLeft = computed(() => {
		if (!recordChangeRect.value[recordIndex.value]) return
		const left = recordChangeRect.value[recordIndex.value].left
		const width = recordChangeRect.value[recordIndex.value].width
		let result = left + width / 2 - 10
		return result
	});
	const recordTragetTag = ref('超神' || '传说')
	const changRecordIndex = (index, target) => {
		if (recordIndex.value === index) return
		recordIndex.value = index
		recordTragetTag.value = target

	}
	const recordDetailList = computed(() => {
		let result = recordTestList.filter(item => item.level === recordTragetTag.value)
		return result
	})

	// 初始化
	onMounted(async () => {
		await nextTick()
		// 获取组件实例
		const instanceRef = ref(instance?.proxy)
		if (!instanceRef.value) return

		// // 获取 preview 的位置
		uni.createSelectorQuery().in(instanceRef.value)
			.select('.tab-box')
			.boundingClientRect((data) => {
				previewRect = data
				srollPreviewPostion(previewRect)
			})
			.exec();
		// // 获取 tab-item 的位置
		uni.createSelectorQuery().in(instanceRef.value)
			.selectAll('.tab-item')
			.boundingClientRect((data) => {
				tabInfo.value = [...data];
			})
			.exec();
		// // // 获取 tab-item 的位置
		uni.createSelectorQuery().in(instanceRef.value)
			.selectAll('.record-item')
			.boundingClientRect((data) => {
				recordChangeRect.value = [...data]
			})
			.exec();
	})
	// 位置监听
	const srollPreviewPostion = (previewRect) => {
		return previewRect.top
	}
	onPageScroll((e) => {
		const previewTop = srollPreviewPostion(previewRect)
		if (e.scrollTop <= previewTop) {
			preSetPositon.value = false

		} else {
			preSetPositon.value = true
		}
	})

	const show = ref(false)
	const showData = ref(null)
	const showPopup = (id) => {
		filteredList.value.forEach(item => {
			if (item.listId === id) {
				show.value = true
				showData.value = item
			}
		})
	}
	const closePopup = () => {
		show.value = false
	}


	const recordTestList = reactive([
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '全景运动相机',
			level: '超神',
			count: 12,
			oldCount: 54,
			time: '2023-11-11 12:12:12',
			smallPicurl: 'https://img2.baidu.com/it/u=1455518479,3144936783&fm=253&fmt=auto&app=120&f=PNG?w=500&h=1065'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '富士拍拍',
			level: '超神',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img2.baidu.com/it/u=3360815703,3321978180&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1111'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: 'UNiQUE ART雕像',
			level: '传说',
			count: 12,
			oldCount: 44,
			time: '2023-12-11 12:12:12',
			smallPicurl: 'https://img0.baidu.com/it/u=3700946987,2207883969&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1114'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '少女乐队的呐喊',
			level: '传说',
			count: 122,
			oldCount: 46,
			time: '2023-12-12 02:01:12',
			smallPicurl: 'https://img1.baidu.com/it/u=894955063,4138614589&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1083'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '阴阳师',
			level: '传说',
			count: 172,
			oldCount: 114,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img0.baidu.com/it/u=3318815481,675612407&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '胜利女生',
			level: '传说',
			count: 102,
			oldCount: 54,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img1.baidu.com/it/u=1297405382,3279217087&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1426'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '崩坏：星穹铁道',
			level: '传说',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img2.baidu.com/it/u=3969315328,3300096298&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1091'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: 'FuFu大家庭',
			level: '传说',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img0.baidu.com/it/u=1965100551,3593283040&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1081'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '赛博朋克',
			level: '普通',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img2.baidu.com/it/u=3570987437,1081851385&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1083'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '流星花园',
			level: '普通',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img2.baidu.com/it/u=3896495679,3732936033&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '诡秘之主',
			level: '普通',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img0.baidu.com/it/u=1974539446,523763973&fm=253&fmt=auto?w=800&h=1745'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '三丽鸥公仔系列',
			level: '普通',
			smallPicurl: 'https://img1.baidu.com/it/u=1299369810,3742035215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1082'
		}, {
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '三丽鸥公仔系列',
			level: '超神',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img1.baidu.com/it/u=1299369810,3742035215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1082'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '全景运动相机',
			level: '超神',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img2.baidu.com/it/u=1455518479,3144936783&fm=253&fmt=auto&app=120&f=PNG?w=500&h=1065'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '富士拍拍',
			level: '超神',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img2.baidu.com/it/u=3360815703,3321978180&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1111'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: 'UNiQUE ART雕像',
			level: '传说',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img0.baidu.com/it/u=3700946987,2207883969&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1114'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '少女乐队的呐喊',
			level: '传说',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img1.baidu.com/it/u=894955063,4138614589&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1083'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '阴阳师',
			level: '传说',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img0.baidu.com/it/u=3318815481,675612407&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '胜利女生',
			level: '传说',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img1.baidu.com/it/u=1297405382,3279217087&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1426'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '崩坏：星穹铁道',
			level: '传说',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img2.baidu.com/it/u=3969315328,3300096298&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1091'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: 'FuFu大家庭',
			level: '传说',
			count: 122,
			oldCount: 14,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img0.baidu.com/it/u=1965100551,3593283040&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1081'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '赛博朋克',
			level: '普通',
			count: 66,
			oldCount: 21,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img2.baidu.com/it/u=3570987437,1081851385&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1083'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '流星花园',
			level: '普通',
			count: 22,
			oldCount: 64,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img2.baidu.com/it/u=3896495679,3732936033&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889'
		},
		{
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '诡秘之主',
			level: '普通',
			count: 9,
			oldCount: 54,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img0.baidu.com/it/u=1974539446,523763973&fm=253&fmt=auto?w=800&h=1745'
		}, {
			id: new Date().getTime() + Math.floor(Math.random() * 1000),
			Title: '三丽鸥公仔系列',
			level: '普通',
			count: 22,
			oldCount: 94,
			time: '2023-12-11 12:01:12',
			smallPicurl: 'https://img1.baidu.com/it/u=1299369810,3742035215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1082'
		}
	])
</script>

<style lang='scss' scoped>
	.tab-position {
		position: fixed;
		top: 0;
		left: 0;
		backdrop-filter: blur(2px);
		/* 应用模糊效果到背景区域 */
		background-color: rgba(0, 0, 0, 0.3);
		/* 设置背景颜色和透明度 */
		z-index: 999;
	}

	.tab {
		width: 100vw;
		padding: 20rpx 0;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.tab-box {
		height: 70rpx;
		width: 340rpx;
		border: 2px solid #B4B5A9;
		border-radius: 5rpx;
		background-color: #EFF2E0;
		display: flex;
		justify-content: space-evenly;
		align-items: center;

		.tab-item {
			width: 50%;
			height: 60rpx;
			border-radius: 5rpx;
			padding: 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 24rpx;
			font-weight: bold;
			color: #303133;
			z-index: 10;
		}

		.active {
			position: absolute;
			width: 150rpx;
			height: 58rpx;
			font-size: 26rpx;
			border: 2px solid #B4B5A9;
			border-radius: 10rpx;
			background-color: #F9F7EA;
			z-index: 5;
			transition: all 0.3s ease-in-out;
		}
	}

	.preview {
		width: 100vw;
		display: flex;
		justify-content: space-around;
		padding: 20rpx;
		height: 80rpx;
	}

	.controls-left,
	.controls-right {
		width: 160rpx;
		height: 60rpx;
		line-height: 120rpx;
		text-align: center;
		border-radius: 5rpx;
		display: inline-block;


	}

	.tag-list {
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
	}

	.tag-item {
		width: 110rpx;
		height: 70rpx;
		text-align: center;
		border-radius: 5rpx;
		font-weight: bold;
		transition: all 0.3s ease;
		margin: 0 5rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.tag {
			font-size: 24rpx;
		}

		.chance {
			font-size: 20rpx;
		}
	}



	.active {
		width: 130rpx;
		height: 85rpx;
	}

	.p-detail {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		place-items: center;
		/* 同时设置水平和垂直居中 */
		grid-gap: 15rpx;
		padding: 0 20rpx;

		&-content {
			width: 220rpx;
			height: 300rpx;
			border-radius: 10rpx;
			border: 2px solid #58F5DD;
			overflow: hidden;
		}

		.p-img {
			width: 100%;
			height: 220rpx;

			._img {
				width: 100%;
				height: 100%;
				box-sizing: border-box;
			}
		}

		.p-text {
			display: flex;
			flex-direction: column;
			padding-left: 10rpx;
			height: 100%;
			background: linear-gradient(to bottom, #a1c4fd 0%, #fff 25%);

			.u-p-t-title {
				font-size: 18rpx;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}

			.u-p-t-price {
				padding: 5rpx 0;
				font-size: 26rpx;
				font-weight: bold;
				color: #E67D87;
			}
		}
	}

	.up-popup {
		width: 540rpx;
		height: 720rpx;

		.show-image {
			width: 480rpx;
			height: 480rpx;
			border: 1px solid #000;
			border-radius: 10rpx;
			overflow: hidden;
			margin: 30rpx auto;

			.show-img {
				width: 100%;
				height: 100%;
			}
		}

		.show-detail {
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 0 30rpx;

			.s-t-title {
				font-size: 30rpx;
			}

			.s-t-chance {
				font-size: 30rpx;
				color: #868683;

				margin: 10rpx 0;
			}

			.s-t-price {
				font-size: 30rpx;
				color: #868683;
			}
		}
	}

	.record {
		width: 100%;
		height: 80rpx;
		margin: 20rpx 0;

		.record-list {
			width: 100%;
			height: 80rpx;
			position: relative;
			display: flex;
			align-items: center;
			padding-left: 40rpx;

			.record-item {
				width: 130rpx;
				height: 80rpx;
				font-size: 24rpx;
				font-weight: bold;
				display: flex;
				justify-content: center;
				line-height: 80rpx;
			}

			.record-active {
				width: 40rpx;
				height: 7rpx;
				background-color: #FDA32E;
				border-radius: 10rpx;
				bottom: 12rpx;
				position: absolute;
				left: 0;
				transition: all 0.3s ease-in-out;
			}


		}
	}

	.record-detail {
		&-list {
			width: 90%;
			height: 130rpx;
			margin: 5rpx auto;
			background-color: #B4B5A9;
			border: 5rpx solid transparent;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			padding:0 20rpx;
		}

		.r-d-img {
			width: 110rpx;
			height: 110rpx;
			overflow: hidden;
		}

		.r-d-img>._image {
			width: 110rpx;
			height: 110rpx;
		}
	}
</style>