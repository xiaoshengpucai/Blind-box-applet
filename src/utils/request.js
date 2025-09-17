import axios from 'axios'
import mpAdapter from 'axios-miniprogram-adapter'

// 创建 axios 实例（修正适配器名称）
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : 'http://ijls-wxuani.webn.cc',
  timeout: 5000, // 增加超时时间到 5 秒
  headers: {
    'access-key': '624590'
  },
  adapter: mpAdapter // 修正名称为 mpAdapter
});

service.interceptors.request.use(
	config => {
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

service.interceptors.response.use(
	response => {
		return response.data
	},
	error => {
		return Promise.reject(error)
	}
)

export default service