/**
 * infinte 相关API
 * @description 赏品的类别数据的获取、详情、筛选等接口
 */
import api from './index'

export function getInfinteClassList(params = {}) {
	return api.get('/class/class-list', params, {
		cahche: false,
		cacheTime: 3 * 60 * 1000
	})
}
