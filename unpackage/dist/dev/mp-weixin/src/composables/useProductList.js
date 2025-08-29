"use strict";
const common_vendor = require("../../common/vendor.js");
const SORT_TYPES = {
  DEFAULT: "default",
  NEW: "new",
  PRICE_ASC: "priceAsc",
  PRICE_DESC: "priceDesc",
  POPULAR: "popular"
};
function useProductList(initialData = []) {
  const originalList = common_vendor.ref([...initialData]);
  const productList = common_vendor.ref([...initialData]);
  const currentSortType = common_vendor.ref(SORT_TYPES.DEFAULT);
  const loading = common_vendor.ref(false);
  const error = common_vendor.ref(null);
  const currentPage = common_vendor.ref(1);
  const pageSize = common_vendor.ref(20);
  const hasMore = common_vendor.ref(true);
  const totalCount = common_vendor.computed(() => productList.value.length);
  const isEmpty = common_vendor.computed(() => totalCount.value === 0);
  const paginatedList = common_vendor.computed(() => {
    const start = 0;
    const end = currentPage.value * pageSize.value;
    return productList.value.slice(start, end);
  });
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
  const setProductList = (data, replace = true) => {
    if (replace) {
      originalList.value = [...data];
      productList.value = [...data];
      currentPage.value = 1;
    } else {
      originalList.value.push(...data);
      productList.value.push(...data);
    }
    if (currentSortType.value !== SORT_TYPES.DEFAULT) {
      applySorting(currentSortType.value);
    }
  };
  const applySorting = (sortType) => {
    if (!sortStrategies[sortType]) {
      common_vendor.index.__f__("warn", "at src/composables/useProductList.js:120", `未知的排序类型: ${sortType}`);
      return;
    }
    currentSortType.value = sortType;
    productList.value = sortStrategies[sortType](productList.value);
  };
  const resetSorting = () => {
    applySorting(SORT_TYPES.DEFAULT);
  };
  const filterProducts = (filterFn) => {
    if (typeof filterFn !== "function") {
      productList.value = [...originalList.value];
      return;
    }
    productList.value = originalList.value.filter(filterFn);
    if (currentSortType.value !== SORT_TYPES.DEFAULT) {
      applySorting(currentSortType.value);
    }
  };
  const searchProducts = (keyword, searchFields = ["title", "description"]) => {
    if (!keyword.trim()) {
      productList.value = [...originalList.value];
      return;
    }
    const lowerKeyword = keyword.toLowerCase();
    productList.value = originalList.value.filter((product) => {
      return searchFields.some((field) => {
        const fieldValue = product[field];
        return fieldValue && fieldValue.toString().toLowerCase().includes(lowerKeyword);
      });
    });
  };
  const loadMore = () => {
    if (!hasMore.value || loading.value)
      return;
    currentPage.value += 1;
    const maxPage = Math.ceil(totalCount.value / pageSize.value);
    hasMore.value = currentPage.value < maxPage;
  };
  const refresh = () => {
    currentPage.value = 1;
    hasMore.value = true;
    error.value = null;
    productList.value = [...originalList.value];
    if (currentSortType.value !== SORT_TYPES.DEFAULT) {
      applySorting(currentSortType.value);
    }
  };
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: product.id || `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createTime: Date.now()
    };
    originalList.value.unshift(newProduct);
    refresh();
  };
  const removeProduct = (productId) => {
    const originalIndex = originalList.value.findIndex((p) => p.id === productId);
    const currentIndex = productList.value.findIndex((p) => p.id === productId);
    if (originalIndex !== -1) {
      originalList.value.splice(originalIndex, 1);
    }
    if (currentIndex !== -1) {
      productList.value.splice(currentIndex, 1);
    }
  };
  const updateProduct = (productId, updates) => {
    const updateItem = (list) => {
      const index = list.findIndex((p) => p.id === productId);
      if (index !== -1) {
        list[index] = { ...list[index], ...updates, updateTime: Date.now() };
      }
    };
    updateItem(originalList.value);
    updateItem(productList.value);
  };
  const getSortTypeName = (sortType) => {
    const names = {
      [SORT_TYPES.DEFAULT]: "默认排序",
      [SORT_TYPES.NEW]: "最新发布",
      [SORT_TYPES.PRICE_ASC]: "价格从低到高",
      [SORT_TYPES.PRICE_DESC]: "价格从高到低",
      [SORT_TYPES.POPULAR]: "热门商品"
    };
    return names[sortType] || "未知排序";
  };
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
exports.useProductList = useProductList;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/composables/useProductList.js.map
