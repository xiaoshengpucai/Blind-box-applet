/**
 * 商品列表组合式函数
 * @description 提供商品列表的数据管理和操作逻辑
 */
import { ref, computed } from 'vue';

// 排序类型常量
export const SORT_TYPES = {
  DEFAULT: 'default',
  NEW: 'new',
  PRICE_ASC: 'priceAsc',
  PRICE_DESC: 'priceDesc',
  POPULAR: 'popular'
};

/**
 * 商品列表Hook
 * @param {Array} initialData - 初始商品数据
 * @returns {Object} 商品列表相关状态和方法
 */
export function useProductList(initialData = []) {
  // ==================== 状态管理 ====================
  const originalList = ref([...initialData]);
  const productList = ref([...initialData]);
  const currentSortType = ref(SORT_TYPES.DEFAULT);
  const loading = ref(false);
  const error = ref(null);
  
  // 分页相关
  const currentPage = ref(1);
  const pageSize = ref(20);
  const hasMore = ref(true);

  // ==================== 计算属性 ====================
  /**
   * 总商品数量
   */
  const totalCount = computed(() => productList.value.length);

  /**
   * 是否为空列表
   */
  const isEmpty = computed(() => totalCount.value === 0);

  /**
   * 分页显示的商品列表
   */
  const paginatedList = computed(() => {
    const start = 0;
    const end = currentPage.value * pageSize.value;
    return productList.value.slice(start, end);
  });

  // ==================== 排序算法 ====================
  const sortStrategies = {
    [SORT_TYPES.DEFAULT]: (products) => [...originalList.value],
    
    [SORT_TYPES.NEW]: (products) => {
      return [...products].sort((a, b) => {
        const timeA = a.createTime || a.updateTime || 0;
        const timeB = b.createTime || b.updateTime || 0;
        return timeB - timeA;
      });
    },
    
    [SORT_TYPES.PRICE_ASC]: (products) => {
      return [...products].sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceA - priceB;
      });
    },
    
    [SORT_TYPES.PRICE_DESC]: (products) => {
      return [...products].sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return priceB - priceA;
      });
    },
    
    [SORT_TYPES.POPULAR]: (products) => {
      return [...products].sort((a, b) => {
        const popularityA = a.viewCount || a.likeCount || 0;
        const popularityB = b.viewCount || b.likeCount || 0;
        return popularityB - popularityA;
      });
    }
  };

  // ==================== 核心方法 ====================
  /**
   * 设置商品列表数据
   * @param {Array} data - 商品数据
   * @param {boolean} replace - 是否替换原有数据
   */
  const setProductList = (data, replace = true) => {
    if (replace) {
      originalList.value = [...data];
      productList.value = [...data];
      currentPage.value = 1;
    } else {
      // 追加数据（用于分页加载）
      originalList.value.push(...data);
      productList.value.push(...data);
    }
    
    // 如果当前有排序，重新应用排序
    if (currentSortType.value !== SORT_TYPES.DEFAULT) {
      applySorting(currentSortType.value);
    }
  };

  /**
   * 应用排序
   * @param {string} sortType - 排序类型
   */
  const applySorting = (sortType) => {
    if (!sortStrategies[sortType]) {
      console.warn(`未知的排序类型: ${sortType}`);
      return;
    }
    
    currentSortType.value = sortType;
    productList.value = sortStrategies[sortType](productList.value);
  };

  /**
   * 重置排序
   */
  const resetSorting = () => {
    applySorting(SORT_TYPES.DEFAULT);
  };

  /**
   * 筛选商品
   * @param {Function} filterFn - 筛选函数
   */
  const filterProducts = (filterFn) => {
    if (typeof filterFn !== 'function') {
      productList.value = [...originalList.value];
      return;
    }
    
    productList.value = originalList.value.filter(filterFn);
    
    // 重新应用当前排序
    if (currentSortType.value !== SORT_TYPES.DEFAULT) {
      applySorting(currentSortType.value);
    }
  };

  /**
   * 搜索商品
   * @param {string} keyword - 搜索关键词
   * @param {Array} searchFields - 搜索字段
   */
  const searchProducts = (keyword, searchFields = ['title', 'description']) => {
    if (!keyword.trim()) {
      productList.value = [...originalList.value];
      return;
    }
    
    const lowerKeyword = keyword.toLowerCase();
    productList.value = originalList.value.filter(product => {
      return searchFields.some(field => {
        const fieldValue = product[field];
        return fieldValue && fieldValue.toString().toLowerCase().includes(lowerKeyword);
      });
    });
  };

  /**
   * 加载更多数据（分页）
   */
  const loadMore = () => {
    if (!hasMore.value || loading.value) return;
    
    currentPage.value += 1;
    
    // 检查是否还有更多数据
    const maxPage = Math.ceil(totalCount.value / pageSize.value);
    hasMore.value = currentPage.value < maxPage;
  };

  /**
   * 刷新列表
   */
  const refresh = () => {
    currentPage.value = 1;
    hasMore.value = true;
    error.value = null;
    productList.value = [...originalList.value];
    
    // 重新应用当前排序
    if (currentSortType.value !== SORT_TYPES.DEFAULT) {
      applySorting(currentSortType.value);
    }
  };

  /**
   * 添加商品
   * @param {Object} product - 商品数据
   */
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: product.id || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createTime: Date.now()
    };
    
    originalList.value.unshift(newProduct);
    
    // 重新应用当前排序和筛选
    refresh();
  };

  /**
   * 删除商品
   * @param {string} productId - 商品ID
   */
  const removeProduct = (productId) => {
    const originalIndex = originalList.value.findIndex(p => p.id === productId);
    const currentIndex = productList.value.findIndex(p => p.id === productId);
    
    if (originalIndex !== -1) {
      originalList.value.splice(originalIndex, 1);
    }
    
    if (currentIndex !== -1) {
      productList.value.splice(currentIndex, 1);
    }
  };

  /**
   * 更新商品
   * @param {string} productId - 商品ID
   * @param {Object} updates - 更新数据
   */
  const updateProduct = (productId, updates) => {
    const updateItem = (list) => {
      const index = list.findIndex(p => p.id === productId);
      if (index !== -1) {
        list[index] = { ...list[index], ...updates, updateTime: Date.now() };
      }
    };
    
    updateItem(originalList.value);
    updateItem(productList.value);
  };

  // ==================== 工具方法 ====================
  /**
   * 获取排序类型的中文名称
   * @param {string} sortType - 排序类型
   * @returns {string} 中文名称
   */
  const getSortTypeName = (sortType) => {
    const names = {
      [SORT_TYPES.DEFAULT]: '默认排序',
      [SORT_TYPES.NEW]: '最新发布',
      [SORT_TYPES.PRICE_ASC]: '价格从低到高',
      [SORT_TYPES.PRICE_DESC]: '价格从高到低',
      [SORT_TYPES.POPULAR]: '热门商品'
    };
    return names[sortType] || '未知排序';
  };

  // ==================== 返回API ====================
  return {
    // 状态
    productList: paginatedList,
    originalList,
    currentSortType,
    loading,
    error,
    totalCount,
    isEmpty,
    hasMore,
    currentPage,
    
    // 方法
    setProductList,
    applySorting,
    resetSorting,
    filterProducts,
    searchProducts,
    loadMore,
    refresh,
    addProduct,
    removeProduct,
    updateProduct,
    getSortTypeName,
    
    // 常量
    SORT_TYPES
  };
}
