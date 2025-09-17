<template>
	<view class="tab" :class="preSetPositon ? 'tab-position' : ''">
		<view class="tab-box">
			<view class="tab-item" @click="() => tabChangeIndex = 0">
				赏品预览
			</view>
			<view class="tab-item " @click="() => tabChangeIndex = 1">
				中赏记录
			</view>
			<view class="active" :style="{ left: tabChangeLeft + 'px' }"></view>
		</view>
		<view class="preview" v-if="tabChangeIndex === 0">
			<view class="controls-left" @click="tagChange(false)">
				<image class="icon" style="width:80rpx;opacity: 0.5;"
					src="data:image/svg+xml;base64,PHN2ZyB0PSIxNzU0NDA3MjUyMjM4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEzNjYgMTAyNCIgdmVyc2lvbj0iMS4xIg0KCQkJCQl4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEwMDQ0IiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPg0KCQkJCQk8cGF0aA0KCQkJCQkJZD0iTTc5Ni40NDQ0NDQgODA0LjU3MTQyOCA3OTYuNDQ0NDQ0IDEwMjQgMCA1MTIgNzk2LjQ0NDQ0NCAwIDc5Ni40NDQ0NDQgMjE5LjQyODU3MiAzNDEuMzMzMzMzIDUxMiA3OTYuNDQ0NDQ0IDgwNC41NzE0MjhaTTEzNjUuMzMzMzMzIDEwMjQgMTM2NS4zMzMzMzMgMCA1NjguODg4ODg5IDUxMiAxMzY1LjMzMzMzMyAxMDI0WiINCgkJCQkJCWZpbGw9IiNmNGVhMmEiIHAtaWQ9IjEwMDQ1Ij48L3BhdGg+DQoJCQkJPC9zdmc+"
					mode="widthFix">
				</image>
			</view>
			<view class="tag-list">
				<view class="tag-item" :class="{ 'active': changeGrade === item.grade }"
					:style="{ backgroundColor: getTagColor(item.grade).Color }" v-for="item, index in tagLabel"
					:key="index" @click="() => tagChange(index, item.grade)">
					<text class="tag">{{ item.grade }}</text>
					<text class="chance">{{ item.probability }}%</text>
				</view>
			</view>
			<view class="controls-right" @click="tagChange(true)">
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
	<view class="p-detail" v-if="tabChangeIndex === 0">
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
	<!-- START: Refactored Record Detail Section -->
	<view class="record-detail-container" :style="preSetPositon ? { marginTop: 100 + 'px' } : ''"
		v-if="tabChangeIndex === 1">
		<view class="record-detail-list" :style="recordliststyle" v-for="(record, index) in recordDetailList"
			:key="index">
			<view class="item-info">
				<image class="item-image-left" :src="record.item.image_url" mode="aspectFill"></image>
			</view>
			<view class="record-content">
				<text class="item-title">{{ record.item.title }}</text>
				<view class="draw-info">
					<text class="draw-count">{{ record.drawCount }}发</text>
					<text class="extra-info">{{ record.extraInfo }}</text>
				</view>
			</view>
			<view class="timestamp-container">
				<text class="timestamp">{{ record.timestamp }}</text>
			</view>
		</view>
	</view>
	<!-- END: Refactored Record Detail Section -->

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
	nextTick,
	toRefs
} from 'vue'
import {
	onPageScroll
} from '@dcloudio/uni-app'
import {
	useTagColors
} from '@/src/composables/useTagColors.js'
import {
	useGrades
} from '@/src/composables/useGrades.js'

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
	datalist
} = toRefs(props)

const {
	getTagColor
} = useTagColors()
const {
	tagLabel
} = useGrades(datalist)

const tabChangeIndex = ref(0);


const tabInfo = ref([]);
const tabChangeLeft = computed(() => {
	if (tabInfo.value.length === 0) return 0;
	return tabInfo.value[tabChangeIndex.value]?.left + 3;
});

let changeGrade = ref('')
watch(tagLabel, (newVal) => {
	if (newVal.length > 0) {
		changeGrade.value = newVal[0].grade
	}
}, {
	immediate: true
})

const currentTagIndex = ref(0)

//  切换标签
const tagChange = (isnext) => {
	if (isnext) {
		currentTagIndex.value = currentTagIndex.value === tagLabel.value.length - 1 ?
			0 :
			currentTagIndex.value + 1
	} else {
		currentTagIndex.value = currentTagIndex.value === 0 ?
			tagLabel.value.length - 1 :
			currentTagIndex.value - 1
	}
	changeGrade.value = tagLabel.value[currentTagIndex.value].grade
}


const filteredList = computed(() => {
	return datalist.value.filter(item => item.grade === changeGrade.value)
})

const instance = getCurrentInstance()
const instanceProxy = instance?.proxy

let previewRect = reactive([])
const preSetPositon = ref(false)
const recordIndex = ref(0)
const recordChangeRect = ref([])
const recordChangeLeft = computed(() => {
	if (!recordChangeRect.value[recordIndex.value]) return 0
	const left = recordChangeRect.value[recordIndex.value].left
	const width = recordChangeRect.value[recordIndex.value].width
	let result = left + width / 2 - 10
	return result
});
// console.log('recordChangeLeft-------------------recordChangeLeft', recordChangeLeft.value);
const recordTragetTag = ref('')
const changRecordIndex = (index, target) => {
	if (recordIndex.value === index) return
	recordIndex.value = index
	recordTragetTag.value = target
}

const recordDetailList = ref([])

const generateMockRecords = (items) => {
	if (!items || items.length === 0) return [];
	return items.map((item, index) => ({
		item: {
			title: item.title,
			image_url: item.image_url,
		},
		timestamp: `2025-09-12 15:${20 + index}:${10 + index}`,
		drawCount: Math.floor(Math.random() * 90) + 10,
		extraInfo: index === 0 ? '距本次中赏已过5发' : ''
	}));
};

watch(tabChangeIndex, (newIndex) => {
	if (newIndex === 1) {
		const items = datalist.value.filter(item => item.grade === tagLabel.value[recordIndex.value]?.grade);
		recordDetailList.value = generateMockRecords(items);
	}

	if (newIndex === 1 && recordChangeRect.value.length === 0) {
		nextTick(() => {
			if (instanceProxy) {
				uni.createSelectorQuery().in(instanceProxy)
					.selectAll('.record-item')
					.boundingClientRect((data) => {
						if (data && data.length > 0) {
							recordChangeRect.value = [...data]
						}
					})
					.exec();
			}
		});
	}
});

const recordliststyle = computed(() => {
	let tag = tagLabel.value[recordIndex.value]?.grade
	return {
		border: `5rpx solid ${useTagColors().getTagColor(tag).Color}`,
		backgroundColor: useTagColors().getTagColor(tag).recolor
	}
})

watch(recordTragetTag, (newTag) => {
	const items = datalist.value.filter(item => item.grade === newTag);
	recordDetailList.value = generateMockRecords(items);
});

onMounted(() => {
	if (!instanceProxy) return

	uni.createSelectorQuery().in(instanceProxy)
		.select('.tab-box')
		.boundingClientRect((data) => {
			previewRect = data
		})
		.exec();

	uni.createSelectorQuery().in(instanceProxy)
		.selectAll('.tab-item')
		.boundingClientRect((data) => {
			tabInfo.value = [...data];
		})
		.exec();
})

onPageScroll((e) => {
	if (!previewRect || previewRect.top === undefined) return
	console.log('e.scrollTop-------------------e.scrollTop', e.scrollTop, previewRect.top)
	preSetPositon.value = e.scrollTop > previewRect.top
})

const show = ref(false)
const showData = ref(null)
const showPopup = (id) => {
	const item = datalist.value.find(item => item.id === id)
	if (item) {
		show.value = true
		showData.value = item
	}
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
	color: #fff;
}

.tab {
	width: 100vw;
	padding: 20rpx 0;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	transition: all 0.3s ease-in-out;
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
			font-size: 28rpx;
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
			bottom: 10rpx;
			position: absolute;
			left: 0;
			transition: all 0.3s ease-in-out;
		}


	}
}

/* START: New styles for Record Detail */
.record-detail-container {
	width: 100%;
	padding: 0 30rpx;
	box-sizing: border-box;
	padding-bottom: 200rpx;
	// transition: all .5s ease-in-out;
	/* Add some padding at the bottom */

	.record-detail-list {
		display: flex;
		align-items: center;
		border-radius: 15rpx;
		padding: 10rpx;
		margin-bottom: 10rpx;

		.item-info {
			margin-right: 20rpx;
			flex-shrink: 0;

			.item-image-left {
				width: 120rpx;
				height: 120rpx;
				border-radius: 10rpx;
			}
		}

		.record-content {
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			gap: 10rpx;
			overflow: hidden;

			.item-title {
				font-size: 28rpx;
				font-weight: 500;
				color: #333;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.draw-info {
				display: flex;
				align-items: baseline;
				gap: 15rpx;

				.draw-count {
					font-size: 26rpx;
					color: #555;
				}

				.extra-info {
					font-size: 24rpx;
					color: #999;
				}
			}
		}

		.timestamp-container {
			flex-shrink: 0;
			margin-left: 20rpx;

			.timestamp {
				font-size: 18rpx;
				color: #999;
			}
		}
	}
}
</style>