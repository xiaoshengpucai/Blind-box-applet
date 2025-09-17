import {
	computed
} from 'vue';

export function useGrades(datalist) {
	const sortOrder = {
		'超神': 1,
		'传说': 2,
		'普通': 3
	};

	const gradeList = computed(() => {
		const result = {};
		if (!datalist.value) return result;

		datalist.value.forEach(item => {
			const {
				grade,
				probability
			} = item;

			if (!result[grade]) {
				result[grade] = {
					Total: 0,
					probability: 0,
					items: []
				};
			}
			result[grade].Total++;
			// 处理计算精度，避免浮点数累加误差
			result[grade].probability = Number((result[grade].probability + Number(probability)).toFixed(6));
			result[grade].items.push(item);
		});
		return result;
	});

	const tagLabel = computed(() => {
		return Object.entries(gradeList.value)
			.map(([key, val]) => ({
				grade: key,
				...val
			}))
			.sort((a, b) => sortOrder[a.grade] - sortOrder[b.grade]);
	});

	return {
		tagLabel
	};
}
