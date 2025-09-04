import { ref } from 'vue'
/**
 * 首页的数据列表处理
 */
import { getInfinteClassList } from '@/src/api/layout-list.js';

export function useLayoutList() {
	const infinteClassList = ref([]);
	const isLoading = ref(false);
	const error = ref(null);

	const fetchInfinteClassList = async (params) => {
		isLoading.value = true;
		error.value = null;
		try {
			// 这里调用的是从 api/layout-list.js 导入的 getInfinteClassList
			const data = await getInfinteClassList(params);
			infinteClassList.value = data;
			console.log('Infinte Class List fetched via composable:', infinteClassList.value);
			return infinteClassList.value;
		} catch (err) {
			error.value = err;
			console.error('Failed to fetch infinte class list:', err);
		} finally {
			isLoading.value = false;
		}
	};

	// 将状态和方法暴露出去，给页面使用
	return {
		infinteClassList,
		isLoading,
		error,
		fetchInfinteClassList,
	};
}