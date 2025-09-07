<template>
	<view class="tab" :class="preSetPositon ? 'tab-position' : ''">
		<view class="tab-box">
			<view class="tab-item" @click="handleTabClick(0)">
				赏品预览
			</view>
			<view class="tab-item " @click="handleTabClick(1)">
				中赏记录
			</view>
			<view class="active" :style="{ left: tabChangeLeft + 'px' }"></view>
		</view>
		<view class="preview" v-if="tabChangeIndex === 0">
			<view class="controls-left" @click="tagLeft()">
				<image class="icon" style="width:80rpx;opacity: 0.5;"
					src="data:image/svg+xml;base64,PHN2ZyB0PSIxNzU0NDA3MjUyMjM4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEzNjYgMTAyNCIgdmVyc2lvbj0iMS4xIg0KCQkJCQl4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEwMDQ0IiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPg0KCQkJCQk8cGF0aA0KCQkJCQkJZD0iTTc5Ni40NDQ0NDQgODA0LjU3MTQyOCA3OTYuNDQ0NDQ0IDEwMjQgMCA1MTIgNzk2LjQ0NDQ0NCAwIDc5Ni40NDQ0NDQgMjE5LjQyODU3MiAzNDEuMzMzMzMzIDUxMiA3OTYuNDQ0NDQ0IDgwNC41NzE0MjhaTTEzNjUuMzMzMzMzIDEwMjQgMTM2NS4zMzMzMzMgMCA1NjguODg4ODg5IDUxMiAxMzY1LjMzMzMzMyAxMDI0WiINCgkJCQkJCWZpbGw9IiNmNGVhMmEiIHAtaWQ9IjEwMDQ1Ij48L3BhdGg+DQoJCQkJPC9zdmc+"
					mode="widthFix">
				</image>
			</view>
			<view class="tag-list">
				<view class="tag-item" :class="{ 'active': changeGrade === item.grade }"
					:style="{ backgroundColor: getTagColor(item.grade).Color }" v-for="item, index in tagLabel"
					:key="index" @click="handleClickTag(item.grade)">
					<text class="tag">{{ item.grade }}</text>
					<text class="chance">{{ item.probability }}%</text>
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
				<view class="record-item" v-for="item, index in tagLabel" :key="index"
					@click="changRecordIndex(index, item.grade)">
					<text class="tag">{{ item.grade }}</text>
				</view>
				<view class="record-active" :style="{ left: recordChangeLeft + 'px' }"></view>
			</view>
		</view>
	</view>
	<view class="p-detail" :style="preSetPositon ? { 'marginTop': 150 + 'px' } : ''" v-if="tabChangeIndex === 0">

		<view class="p-detail-content" v-for="(item) in filteredList" :key="item.id"
			:style="{ borderColor: getTagColor(item.grade).Color }" @click="showPopup(item.id)">
			<view class="p-img">
				<image class="_img" :src="item.image_url" mode="heightFix"></image>
			</view>
			<view class="p-text" :style="{ background: getTagColor(item.grade).bgColor }">
				<text class="u-p-t-price"> {{ item.price }}元</text>
				<text class="u-p-t-title"> {{ item.title }}</text>
			</view>
		</view>
	</view>
	<view class="record-detail" v-if="tabChangeIndex === 1">
		<view class="record-detail-list" v-for="(item, index) in recordDetailList" :key="index"
			:style="{ borderColor: getTagColor(item.grade).Color, backgroundColor: getTagColor(item.grade).recolor }">
			<view class="r-d-img">
				<image class="_image" :src="item.image_url" mode="aspectFill"></image>
			</view>
			<view class="r-d-">
				111
			</view>
		</view>
	</view>
	<up-popup :show="show" :round="10" mode="center" @open="showPopup" @close="closePopup">
		<view class="up-popup" v-if="showData">
			<view class="show-image" :style="{ borderColor: getTagColor(showData.grade).Color }">
				<image :src="showData.image_url" mode="widthFix"></image>
			</view>
			<view class="show-detail">
				<text class="s-t-title">
					{{ showData.title }}
				</text>
				<text class="s-t-chance">
					概率&nbsp;&nbsp;{{ showData.probability }}%
				</text>
				<text class="s-t-price">
					价格&nbsp;&nbsp;{{ showData.price }}
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

const tabChangeIndex = ref(0);
const handleTabClick = (index) => {
	if (tabChangeIndex.value === index) return
	tabChangeIndex.value = index
};
console.log('datalist-------------------datalist', datalist);
const tabInfo = ref([]);
const tabChangeLeft = computed(() => {
	return tabInfo.value[tabChangeIndex.value]?.left + 3;
});


let changeGrade = ref('超神')
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
const gradeList = computed(() => {
	const result = {}
	props.datalist.forEach(item => {
		console.log('item-------------------item', item);

		const {
			grade,
			probability
		} = item

		if (!result[grade]) {
			result[grade] = []
		}
		result[grade] = {
			Total: result[grade].Total ? result[grade].Total + 1 : 1,
			probability: result[grade].probability ? result[grade].probability + probability : probability
		}
	})
	return result
})
console.log('gradeList-------------------gradeList1', gradeList.value);


const tagLabel = computed(() => {
	const entries = Object.entries(gradeList.value)
		.map(([key,val])=>{
			return {
				grade:key,
				...val
			}
		}).sort((a, b) => sortOrder[a.grade] - sortOrder[b.grade])
	return entries
})

watch(tagLabel, (newVal) => {
	if (newVal.length > 0) {
		changeGrade.value = newVal[0].grade
	}
}, {
	immediate: true
})

//处理颜色函数
function hexToRgba(hex, opacity) {
	if (!hex) {
		hex = '#CCCCCC'
	}
	hex = hex.replace('#', '')
	const r = parseInt(hex.substring(0, 2), 16)
	const g = parseInt(hex.substring(2, 4), 16)
	const b = parseInt(hex.substring(4, 6), 16)
	return `rgba(${r},${g},${b},${opacity})`
}


const getTagColor = (grade) => {
	const color = tagColors[grade] || '#CCCCCC';
	return {
		Color: hexToRgba(color, 1),
		bgColor: `linear-gradient(to bottom, ${hexToRgba(color, .5)} 0%, #fff 25%)`,
		recolor: `${hexToRgba(color, 0.2)}`
	}
}
const currentTagIndex = ref(0)

function handleClickTag(grade) {
	if (grade === changeGrade.value) return
	changeGrade.value = grade
}

function tagLeft() {
	currentTagIndex.value = currentTagIndex.value === 0 ?
		tagLabel.value.length - 1 :
		currentTagIndex.value - 1
	changeGrade.value = tagLabel.value[currentTagIndex.value].grade
}

function tagRight() {
	currentTagIndex.value = currentTagIndex.value === tagLabel.value.length - 1 ?
		0 :
		currentTagIndex.value + 1
	changeGrade.value = tagLabel.value[currentTagIndex.value].grade
}

// 先创建计算属性
const filteredList = computed(() => {
	return props.datalist.filter(item => item.grade === changeGrade.value)
})


console.log('filteredList-------------------filteredList', filteredList.value);
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
	let result = props.datalist.filter(item => item.grade === recordTragetTag.value)
	return result
})
console.log('recordDetailList-------------------recordDetailList', recordDetailList.value);

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
	props.datalist.forEach(item => {
		if (item.id === id) {
			show.value = true
			showData.value = item
		}
	})
}
const closePopup = () => {
	show.value = false
}


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
		padding: 0 20rpx;
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