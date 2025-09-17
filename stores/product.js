import { defineStore } from 'pinia';
import { getInfinteClassList as fetchProductsAPI } from '@/src/api/layout-list.js';

export const useProductStore = defineStore('product', {
  // ====================
  //       STATE
  // ====================
  state: () => ({
    productList: [],
    currentPage: 1,
    hasMore: true,
    isLoading: false,
    currentCategory: '无限赏',
  }),

  // ====================
  //      GETTERS
  // ====================
  getters: {
    // 可以在这里添加派生状态，例如商品总数等
    totalProducts: (state) => state.productList.length,
  },

  // ====================
  //      ACTIONS
  // ====================
  actions: {
    /**
     * 获取商品列表（会覆盖现有列表）
     * 通常用于首次加载、下拉刷新、切换分类
     */
    async fetchProductList(category) {
      if (this.isLoading) return;
      this.isLoading = true;
      
      try {
        // 更新分类并重置分页
        this.currentCategory = category || '无限赏';
        this.currentPage = 1;
        
        const params = { page: this.currentPage, limit: 10 };
        const result = await fetchProductsAPI(this.currentCategory, params);

        if (result && Array.isArray(result)) {
          this.productList = result;
          this.hasMore = result.length === params.limit;
        } else {
          this.productList = [];
          this.hasMore = false;
        }
      } catch (error) {
        console.error('Failed to fetch product list in store:', error);
        this.productList = [];
        this.hasMore = false;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * 加载更多商品（会追加到列表末尾）
     * 用于上拉加载更多
     */
    async loadMoreProducts() {
      if (this.isLoading || !this.hasMore) return;
      this.isLoading = true;

      try {
        this.currentPage++;
        const params = { page: this.currentPage, limit: 10 };
        const result = await fetchProductsAPI(this.currentCategory, params);

        if (result && Array.isArray(result) && result.length > 0) {
          this.productList.push(...result);
          this.hasMore = result.length === params.limit;
        } else {
          this.hasMore = false;
        }
      } catch (error) {
        console.error('Failed to load more products in store:', error);
        this.hasMore = false;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
