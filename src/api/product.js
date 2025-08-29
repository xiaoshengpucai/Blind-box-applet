/**
 * 商品相关API
 * @description 商品数据的获取、搜索、筛选等接口
 */
import api from './index.js';

// ==================== 商品API ====================
export const productApi = {
  /**
   * 获取商品列表
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.category - 分类ID
   * @param {string} params.keyword - 搜索关键词
   * @param {string} params.sortBy - 排序字段
   * @param {string} params.sortOrder - 排序方向 asc|desc
   * @returns {Promise} 商品列表数据
   */
  getProductList: (params = {}) => {
    const {
      page = 1,
      pageSize = 20,
      category,
      keyword,
      sortBy = 'createTime',
      sortOrder = 'desc'
    } = params;

    return api.get('/products', {
      page,
      pageSize,
      category,
      keyword,
      sortBy,
      sortOrder
    }, {
      cache: true,
      cacheTime: 3 * 60 * 1000 // 3分钟缓存
    });
  },

  /**
   * 获取商品详情
   * @param {string} productId - 商品ID
   * @returns {Promise} 商品详情数据
   */
  getProductDetail: (productId) => {
    return api.get(`/products/${productId}`, null, {
      cache: true,
      cacheTime: 5 * 60 * 1000 // 5分钟缓存
    });
  },

  /**
   * 搜索商品
   * @param {Object} params - 搜索参数
   * @param {string} params.keyword - 搜索关键词
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {Array} params.filters - 筛选条件
   * @returns {Promise} 搜索结果
   */
  searchProducts: (params) => {
    const {
      keyword,
      page = 1,
      pageSize = 20,
      filters = []
    } = params;

    return api.get('/products/search', {
      q: keyword,
      page,
      pageSize,
      filters: JSON.stringify(filters)
    }, {
      cache: true,
      cacheTime: 2 * 60 * 1000 // 2分钟缓存
    });
  },

  /**
   * 获取推荐商品
   * @param {Object} params - 推荐参数
   * @param {string} params.type - 推荐类型 hot|new|related
   * @param {string} params.userId - 用户ID（个性化推荐）
   * @param {number} params.limit - 数量限制
   * @returns {Promise} 推荐商品列表
   */
  getRecommendedProducts: (params = {}) => {
    const {
      type = 'hot',
      userId,
      limit = 10
    } = params;

    return api.get('/products/recommended', {
      type,
      userId,
      limit
    }, {
      cache: true,
      cacheTime: 10 * 60 * 1000 // 10分钟缓存
    });
  },

  /**
   * 获取商品分类
   * @param {string} parentId - 父分类ID（可选）
   * @returns {Promise} 分类列表
   */
  getProductCategories: (parentId) => {
    return api.get('/products/categories', {
      parentId
    }, {
      cache: true,
      cacheTime: 30 * 60 * 1000 // 30分钟缓存
    });
  },

  /**
   * 获取商品筛选条件
   * @param {string} categoryId - 分类ID
   * @returns {Promise} 筛选条件配置
   */
  getProductFilters: (categoryId) => {
    return api.get(`/products/categories/${categoryId}/filters`, null, {
      cache: true,
      cacheTime: 20 * 60 * 1000 // 20分钟缓存
    });
  },

  /**
   * 获取商品评价
   * @param {string} productId - 商品ID
   * @param {Object} params - 查询参数
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   * @param {string} params.type - 评价类型 all|good|medium|bad
   * @returns {Promise} 评价列表
   */
  getProductReviews: (productId, params = {}) => {
    const {
      page = 1,
      pageSize = 10,
      type = 'all'
    } = params;

    return api.get(`/products/${productId}/reviews`, {
      page,
      pageSize,
      type
    }, {
      cache: true,
      cacheTime: 5 * 60 * 1000 // 5分钟缓存
    });
  },

  /**
   * 添加商品到收藏
   * @param {string} productId - 商品ID
   * @returns {Promise} 操作结果
   */
  addToFavorites: (productId) => {
    return api.post('/favorites', {
      productId,
      type: 'product'
    });
  },

  /**
   * 从收藏中移除商品
   * @param {string} productId - 商品ID
   * @returns {Promise} 操作结果
   */
  removeFromFavorites: (productId) => {
    return api.delete(`/favorites/${productId}`);
  },

  /**
   * 获取用户收藏的商品
   * @param {Object} params - 查询参数
   * @returns {Promise} 收藏列表
   */
  getFavoriteProducts: (params = {}) => {
    const {
      page = 1,
      pageSize = 20
    } = params;

    return api.get('/favorites/products', {
      page,
      pageSize
    });
  },

  /**
   * 获取商品库存信息
   * @param {string} productId - 商品ID
   * @param {string} skuId - SKU ID（可选）
   * @returns {Promise} 库存信息
   */
  getProductStock: (productId, skuId) => {
    return api.get(`/products/${productId}/stock`, {
      skuId
    }, {
      cache: true,
      cacheTime: 30 * 1000 // 30秒缓存（库存变化较快）
    });
  },

  /**
   * 获取商品价格历史
   * @param {string} productId - 商品ID
   * @param {number} days - 天数
   * @returns {Promise} 价格历史数据
   */
  getProductPriceHistory: (productId, days = 30) => {
    return api.get(`/products/${productId}/price-history`, {
      days
    }, {
      cache: true,
      cacheTime: 60 * 60 * 1000 // 1小时缓存
    });
  }
};

// ==================== 壁纸API（兼容原有接口）====================
export const wallpaperApi = {
  /**
   * 获取壁纸列表
   * @param {Object} params - 查询参数
   * @returns {Promise} 壁纸列表
   */
  getWallpaperList: (params = {}) => {
    const {
      classid = '65237031189f860b7613acf4',
      pageNum = 1,
      pageSize = 10
    } = params;

    return api.get('/bizhi/wallList', {
      classid,
      pageNum,
      pageSize
    }, {
      cache: true,
      cacheTime: 5 * 60 * 1000 // 5分钟缓存
    });
  },

  /**
   * 获取随机壁纸
   * @param {Object} params - 查询参数
   * @returns {Promise} 随机壁纸
   */
  getRandomWallpaper: (params = {}) => {
    return api.get('/bizhi/random', params, {
      cache: false // 随机壁纸不缓存
    });
  }
};

// ==================== 导出 ====================
export default {
  ...productApi,
  ...wallpaperApi
};
