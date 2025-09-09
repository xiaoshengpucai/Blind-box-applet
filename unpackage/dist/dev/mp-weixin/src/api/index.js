"use strict";
const common_vendor = require("../../common/vendor.js");
var define_import_meta_env_default = { VITE_CJS_IGNORE_WARNING: "true", VITE_ROOT_DIR: "E:/HBuildX_Opject/newTai-copy", VITE_USER_NODE_ENV: "development", BASE_URL: "/", MODE: "development", DEV: true, PROD: false, SSR: false };
common_vendor.index.__f__("log", "at src/api/index.js:9", "[Vite Environment Variables]", define_import_meta_env_default);
const getBaseUrl = () => {
  const fallbacks = {
    production: "http://localhost:3000/api/",
    devtools: "http://localhost:3000/api/",
    device: "http://192.168.0.105:3000/api/"
    // 将端口号 :3000 加回来
  };
  const platform = common_vendor.index.getSystemInfoSync().platform;
  if (platform === "devtools") {
    const apiUrl = define_import_meta_env_default.VITE_API_BASE_URL_DEVTOOLS || fallbacks.devtools;
    return apiUrl;
  } else {
    const apiUrl = define_import_meta_env_default.VITE_API_BASE_URL_DEVICE || fallbacks.device;
    return apiUrl;
  }
};
common_vendor.index.__f__("log", "at src/api/index.js:42", getBaseUrl(), "----------------------------------------getBaseUrl");
const API_CONFIG = {
  BASE_URL: `${getBaseUrl()}`,
  TIMEOUT: 1e4,
  RETRY_TIMES: 3,
  RETRY_DELAY: 1e3,
  CACHE_TIME: 5 * 60 * 1e3,
  // 5分钟缓存
  ACCESS_KEY: "624590"
};
const service = common_vendor.axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "access-key": API_CONFIG.ACCESS_KEY,
    "Content-Type": "application/json"
  },
  adapter: common_vendor.mpAdapter
});
class ApiCache {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
    this.cacheTimers = /* @__PURE__ */ new Map();
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
    if (this.cacheTimers.has(key)) {
      clearTimeout(this.cacheTimers.get(key));
    }
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
    this.cacheTimers.forEach((timer) => clearTimeout(timer));
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
const retryRequest = async (requestFn, retries = API_CONFIG.RETRY_TIMES, delay = API_CONFIG.RETRY_DELAY) => {
  try {
    return await requestFn();
  } catch (error) {
    if (retries > 0 && isRetryableError(error)) {
      common_vendor.index.__f__("log", "at src/api/index.js:159", `请求失败，${delay}ms后进行第${API_CONFIG.RETRY_TIMES - retries + 1}次重试`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryRequest(requestFn, retries - 1, delay * 1.5);
    }
    throw error;
  }
};
const isRetryableError = (error) => {
  return !error.response || error.code === "ECONNABORTED" || error.response.status >= 500 && error.response.status < 600;
};
service.interceptors.request.use(
  (config) => {
    var _a;
    config.metadata = { startTime: Date.now() };
    config.requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    common_vendor.index.__f__("log", "at src/api/index.js:188", `[API Request] ${API_CONFIG.BASE_URL} ${config.requestId}: ${(_a = config.method) == null ? void 0 : _a.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    common_vendor.index.__f__("error", "at src/api/index.js:193", "[API Request Error]:", error);
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  (response) => {
    const { config } = response;
    const duration = Date.now() - config.metadata.startTime;
    common_vendor.index.__f__("log", "at src/api/index.js:204", `[API Response] ${config.requestId}: ${response.status} (${duration}ms)`);
    const { data } = response;
    if (data.status === 200 || data.code === 200 || data.success) {
      return data.data || data.result || data;
    } else {
      throw new Error(data.message || data.msg || "请求失败");
    }
  },
  (error) => {
    const { config } = error;
    const duration = (config == null ? void 0 : config.metadata) ? Date.now() - config.metadata.startTime : 0;
    common_vendor.index.__f__("error", "at src/api/index.js:221", `[API Error] ${config == null ? void 0 : config.requestId}: ${error.message} (${duration}ms)`);
    let errorMessage = "网络请求失败";
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          errorMessage = "请求参数错误";
          break;
        case 401:
          errorMessage = "未授权，请重新登录";
          break;
        case 403:
          errorMessage = "拒绝访问";
          break;
        case 404:
          errorMessage = "请求的资源不存在";
          break;
        case 500:
          errorMessage = "服务器内部错误";
          break;
        default:
          errorMessage = (data == null ? void 0 : data.message) || (data == null ? void 0 : data.msg) || `服务器错误 (${status})`;
      }
    } else if (error.request) {
      errorMessage = "网络连接失败，请检查网络";
    } else if (error.code === "ECONNABORTED") {
      errorMessage = "请求超时，请重试";
    }
    error.friendlyMessage = errorMessage;
    return Promise.reject(error);
  }
);
const request = async (options) => {
  const {
    url,
    method = "GET",
    params,
    data,
    headers,
    cache = true,
    cacheTime = API_CONFIG.CACHE_TIME,
    retry = true,
    ...otherConfig
  } = options;
  const cacheKey = apiCache.generateKey(url, { ...params, ...data });
  if (method.toUpperCase() === "GET" && cache && apiCache.has(cacheKey)) {
    common_vendor.index.__f__("log", "at src/api/index.js:285", `[API Cache Hit] ${url}`);
    return apiCache.get(cacheKey);
  }
  const requestFn = () => service({
    url,
    method,
    params,
    data,
    headers,
    ...otherConfig
  });
  try {
    const result = retry ? await retryRequest(requestFn) : await requestFn();
    if (method.toUpperCase() === "GET" && cache) {
      apiCache.set(cacheKey, result, cacheTime);
    }
    return result;
  } catch (error) {
    if (error.friendlyMessage) {
      common_vendor.index.showToast({
        title: error.friendlyMessage,
        icon: "none",
        duration: 2e3
      });
    }
    throw error;
  }
};
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
      method: "GET",
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
      method: "POST",
      data,
      cache: false,
      // POST请求默认不缓存
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
      method: "PUT",
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
      method: "DELETE",
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
exports.api = api;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/api/index.js.map
