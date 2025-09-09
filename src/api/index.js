/**
 * API 请求层
 * @description 统一的API请求管理，包含缓存、错误处理、重试机制等
 */
import axios from 'axios';
import mpAdapter from 'axios-miniprogram-adapter'

// 调试：打印 Vite 的环境变量，确认.env文件是否加载成功
console.log('[Vite Environment Variables]', import.meta.env);

// 根据运行平台和环境动态设置API基础URL
const getBaseUrl = () => {
  // 定义后备URL，以防.env文件加载失败
  const fallbacks = {
    production: 'http://localhost:3000/api/',
    devtools: 'http://localhost:3000/api/',
    device: 'http://192.168.0.105:3000/api/' // 将端口号 :3000 加回来
  };

  // Vite 会通过 import.meta.env.MODE 区分环境 ('development' 或 'production')
  const isProduction = import.meta.env.MODE === 'production';

  // 1. 首先判断是否为生产环境
  if (isProduction) {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || fallbacks.production;
    console.log(`[API Setup] Running in production mode. API_URL: ${apiUrl}`);
    return apiUrl;
  }

  // 2. 如果是开发环境，再判断运行平台
  const platform = uni.getSystemInfoSync().platform;
  console.log(`[API Setup] Running in development mode on platform: ${platform}`);
  
  if (platform === 'devtools') {
    // 本地开发环境 (微信开发者工具模拟器)
    const apiUrl = import.meta.env.VITE_API_BASE_URL_DEVTOOLS || fallbacks.devtools;
    console.log(`[API Setup] Devtools API_URL: ${apiUrl}`);
    return apiUrl;
  } else {
    // 真机调试 ('ios' or 'android')
    const apiUrl = import.meta.env.VITE_API_BASE_URL_DEVICE || fallbacks.device;
    console.log(`[API Setup] Device API_URL: ${apiUrl}`);
    return apiUrl;
  }
};
console.log(getBaseUrl(),'----------------------------------------getBaseUrl');
// ==================== 配置常量 ====================
const API_CONFIG = {
  BASE_URL: `${getBaseUrl()}`,
  TIMEOUT: 10000,
  RETRY_TIMES: 3,
  RETRY_DELAY: 1000,
  CACHE_TIME: 5 * 60 * 1000, // 5分钟缓存
  ACCESS_KEY: '624590'
};

// ==================== 创建axios实例 ====================
const service = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'access-key': API_CONFIG.ACCESS_KEY,
    'Content-Type': 'application/json'
  },
  adapter: mpAdapter
});

// ==================== 缓存管理 ====================
class ApiCache {
  constructor() {
    this.cache = new Map();
    this.cacheTimers = new Map();
  }

  /**
   * 生成缓存键
   * @param {string} url - 请求URL
   * @param {Object} params - 请求参数
   * @returns {string} 缓存键
   */
  generateKey(url, params = {}) {
    return `${url}?${JSON.stringify(params)}`;
  }

  /**
   * 获取缓存
   * @param {string} key - 缓存键
   * @returns {any} 缓存数据
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * 设置缓存
   * @param {string} key - 缓存键
   * @param {any} data - 缓存数据
   * @param {number} ttl - 缓存时间（毫秒）
   */
  set(key, data, ttl = API_CONFIG.CACHE_TIME) {
    this.cache.set(key, data);
    
    // 清除之前的定时器
    if (this.cacheTimers.has(key)) {
      clearTimeout(this.cacheTimers.get(key));
    }
    
    // 设置新的过期定时器
    const timer = setTimeout(() => {
      this.cache.delete(key);
      this.cacheTimers.delete(key);
    }, ttl);
    
    this.cacheTimers.set(key, timer);
  }

  /**
   * 删除缓存
   * @param {string} key - 缓存键
   */
  delete(key) {
    this.cache.delete(key);
    if (this.cacheTimers.has(key)) {
      clearTimeout(this.cacheTimers.get(key));
      this.cacheTimers.delete(key);
    }
  }

  /**
   * 清空所有缓存
   */
  clear() {
    this.cache.clear();
    this.cacheTimers.forEach(timer => clearTimeout(timer));
    this.cacheTimers.clear();
  }

  /**
   * 检查缓存是否存在
   * @param {string} key - 缓存键
   * @returns {boolean} 是否存在
   */
  has(key) {
    return this.cache.has(key);
  }
}

const apiCache = new ApiCache();

// ==================== 重试机制 ====================
/**
 * 请求重试函数
 * @param {Function} requestFn - 请求函数
 * @param {number} retries - 重试次数
 * @param {number} delay - 重试延迟
 * @returns {Promise} 请求结果
 */
const retryRequest = async (requestFn, retries = API_CONFIG.RETRY_TIMES, delay = API_CONFIG.RETRY_DELAY) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && isRetryableError(error)) {
      console.log(`请求失败，${delay}ms后进行第${API_CONFIG.RETRY_TIMES - retries + 1}次重试`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return retryRequest(requestFn, retries - 1, delay * 1.5); // 指数退避
    }
    throw error;
  }
};

/**
 * 判断是否为可重试的错误
 * @param {Error} error - 错误对象
 * @returns {boolean} 是否可重试
 */
const isRetryableError = (error) => {
  // 网络错误、超时错误、5xx服务器错误可以重试
  return !error.response || 
         error.code === 'ECONNABORTED' ||
         (error.response.status >= 500 && error.response.status < 600);
};

// ==================== 请求拦截器 ====================
service.interceptors.request.use(
  (config) => {
    // 添加请求时间戳，用于日志
    config.metadata = { startTime: Date.now() };
    
    // 添加请求ID，用于追踪
    config.requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    console.log(`[API Request] ${API_CONFIG.BASE_URL} ${config.requestId}: ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('[API Request Error]:', error);
    return Promise.reject(error);
  }
);

// ==================== 响应拦截器 ====================
service.interceptors.response.use(
  (response) => {
    const { config } = response;
    const duration = Date.now() - config.metadata.startTime;
    
    console.log(`[API Response] ${config.requestId}: ${response.status} (${duration}ms)`);
    
    // 统一处理响应数据格式
    const { data } = response;
    // 根据实际API的数据结构调整
    if (data.status === 200 || data.code === 200 || data.success) {
      return data.data || data.result || data;
    } else {
      // 增加详细的错误日志，打印出完整的响应数据
      // console.error('[API Response Error Body]', data); 
      throw new Error(data.message || data.msg || '请求失败');
    }
  },
  (error) => {
    const { config } = error;
    const duration = config?.metadata ? Date.now() - config.metadata.startTime : 0;
    
    console.error(`[API Error] ${config?.requestId}: ${error.message} (${duration}ms)`);
    
    // 统一错误处理
    let errorMessage = '网络请求失败';
    
    if (error.response) {
      // 服务器响应错误
      const { status, data } = error.response;
      switch (status) {
        case 400:
          errorMessage = '请求参数错误';
          break;
        case 401:
          errorMessage = '未授权，请重新登录';
          break;
        case 403:
          errorMessage = '拒绝访问';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        default:
          errorMessage = data?.message || data?.msg || `服务器错误 (${status})`;
      }
    } else if (error.request) {
      // 网络错误
      errorMessage = '网络连接失败，请检查网络';
    } else if (error.code === 'ECONNABORTED') {
      // 超时错误
      errorMessage = '请求超时，请重试';
    }
    
    error.friendlyMessage = errorMessage;
    return Promise.reject(error);
  }
);

// ==================== API请求封装 ====================
/**
 * 通用请求方法
 * @param {Object} options - 请求配置
 * @returns {Promise} 请求结果
 */
const request = async (options) => {
  const {
    url,
    method = 'GET',
    params,
    data,
    headers,
    cache = true,
    cacheTime = API_CONFIG.CACHE_TIME,
    retry = true,
    ...otherConfig
  } = options;

  // 生成缓存键
  const cacheKey = apiCache.generateKey(url, { ...params, ...data });
  
  // 检查缓存（仅GET请求且启用缓存）
  if (method.toUpperCase() === 'GET' && cache && apiCache.has(cacheKey)) {
    console.log(`[API Cache Hit] ${url}`);
    return apiCache.get(cacheKey);
  }

  // 创建请求函数
  const requestFn = () => service({
    url,
    method,
    params,
    data,
    headers,
    ...otherConfig
  });

  try {
    // 执行请求（带重试）
    const result = retry ? await retryRequest(requestFn) : await requestFn();
    
    // 缓存结果（仅GET请求且启用缓存）
    if (method.toUpperCase() === 'GET' && cache) {
      apiCache.set(cacheKey, result, cacheTime);
    }
    
    return result;
  } catch (error) {
    // 显示友好的错误提示
    if (error.friendlyMessage) {
      uni.showToast({
        title: error.friendlyMessage,
        icon: 'none',
        duration: 2000
      });
    }
    throw error;
  }
};

// ==================== 便捷方法 ====================
const api = {
  /**
   * GET请求
   * @param {string} url - 请求URL
   * @param {Object} params - 请求参数
   * @param {Object} options - 其他配置
   * @returns {Promise} 请求结果
   */
  get: (url, params, options = {}) => {
    return request({
      url,
      method: 'GET',
      params,
      ...options
    });
  },

  /**
   * POST请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} options - 其他配置
   * @returns {Promise} 请求结果
   */
  post: (url, data, options = {}) => {
    return request({
      url,
      method: 'POST',
      data,
      cache: false, // POST请求默认不缓存
      ...options
    });
  },

  /**
   * PUT请求
   * @param {string} url - 请求URL
   * @param {Object} data - 请求数据
   * @param {Object} options - 其他配置
   * @returns {Promise} 请求结果
   */
  put: (url, data, options = {}) => {
    return request({
      url,
      method: 'PUT',
      data,
      cache: false,
      ...options
    });
  },

  /**
   * DELETE请求
   * @param {string} url - 请求URL
   * @param {Object} params - 请求参数
   * @param {Object} options - 其他配置
   * @returns {Promise} 请求结果
   */
  delete: (url, params, options = {}) => {
    return request({
      url,
      method: 'DELETE',
      params,
      cache: false,
      ...options
    });
  },

  /**
   * 清除所有缓存
   */
  clearCache: () => {
    apiCache.clear();
  },

  /**
   * 清除指定缓存
   * @param {string} url - 请求URL
   * @param {Object} params - 请求参数
   */
  clearCacheByKey: (url, params = {}) => {
    const key = apiCache.generateKey(url, params);
    apiCache.delete(key);
  }
};

// ==================== 导出 ====================
export default api;
export { service, apiCache, API_CONFIG };
