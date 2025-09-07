/**
 * infinte 相关API
 * @description 赏品的类别数据的获取、详情、筛选等接口
 */
import api from './index'

export function getInfinteClassList(name, params = {}) {
	console.log(name, params, '请求list列表')
	return api.get(`/class/${name}`, params, {
		cache: false,
		cacheTime: 3 * 60 * 1000
	})
}

export function getInfinteLListDetail(params) {
	console.log(params, '请求list列表')
	return api.get(`/class/sublist`,params,{
		cache: true,
		cacheTime: 3 * 60 * 1000
	})
}
