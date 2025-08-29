"use strict";
const common_vendor = require("./common/vendor.js");
const src_api_product = require("./src/api/product.js");
if (!Math) {
  ProductList();
}
const ProductList = () => "./components/shared/ProductList.js";
const listLayout = "grid";
const columns = 2;
const gap = "20rpx";
const cardLayout = "vertical";
const cardSize = "medium";
const showHeader = false;
const showCount = false;
const showRating = false;
const showDescription = false;
const showExtraInfo = false;
const showActions = false;
const showSkeleton = false;
const skeletonCount = 6;
const enableLazyLoad = true;
const pricePrefix = "¥";
const maxTags = 3;
const emptyText = "暂无商品";
const _sfc_main = {
  __name: "trendy-tab",
  props: {
    // 商品列表数据（兼容原有的 CarListToChild）
    productList: {
      type: Array,
      default: () => []
    },
    // 兼容原有的 props
    CarListToChild: {
      type: Array,
      default: () => []
    },
    // 列表配置
    listTitle: {
      type: String,
      default: ""
    },
    // 是否显示加载更多
    enableLoadMore: {
      type: Boolean,
      default: false
    },
    // 是否自动加载
    autoLoad: {
      type: Boolean,
      default: false
    }
  },
  emits: ["product-click", "load-more", "image-load", "image-error"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const localProductList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const error = common_vendor.ref(null);
    const showLoadMore = props.enableLoadMore;
    const imageConfig = {
      width: "100%",
      height: "360rpx",
      borderRadius: "10rpx"
    };
    const cardActions = [];
    const listCustomStyle = {
      backgroundColor: "#eee",
      paddingBottom: "300rpx"
    };
    const productList = common_vendor.computed(() => {
      return props.productList.length > 0 ? props.productList : props.CarListToChild.length > 0 ? props.CarListToChild : localProductList.value;
    });
    const handleProductClick = (product) => {
      common_vendor.index.__f__("log", "at pages/Home/componets/trendy-tab.vue:136", "商品点击:", product);
      const productId = product.id || product.uid;
      if (productId) {
        common_vendor.index.navigateTo({
          url: `/pages/Home/detail?id=${productId}`
        });
      }
      emit("product-click", product);
    };
    const handleImageLoad = (product) => {
      emit("image-load", product);
    };
    const handleImageError = (product) => {
      common_vendor.index.__f__("warn", "at pages/Home/componets/trendy-tab.vue:162", "商品图片加载失败:", product);
      emit("image-error", product);
    };
    const handleActionClick = (payload) => {
      common_vendor.index.__f__("log", "at pages/Home/componets/trendy-tab.vue:171", "操作按钮点击:", payload);
    };
    const handleLoadMore = (pagination) => {
      common_vendor.index.__f__("log", "at pages/Home/componets/trendy-tab.vue:180", "加载更多:", pagination);
      emit("load-more", pagination);
      if (props.autoLoad) {
        loadMoreProducts(pagination);
      }
    };
    const handleRetry = () => {
      common_vendor.index.__f__("log", "at pages/Home/componets/trendy-tab.vue:192", "重试加载");
      loadProducts();
    };
    const getWallpaperList = async (params = {}) => {
      try {
        loading.value = true;
        const defaultParams = {
          classid: "65237031189f860b7613acf4",
          pageNum: 1,
          pageSize: 10,
          ...params
        };
        const result = await src_api_product.api.getWallpaperList(defaultParams);
        if (result && Array.isArray(result.data)) {
          localProductList.value = result.data.map((item) => ({
            ...item,
            // 统一字段映射
            id: item.id || item._id,
            title: item.title || item.Title || item.name,
            price: item.price || 0,
            imageUrl: item.smallPicurl || item.imageUrl || item.url,
            // 添加默认的促销标签
            promotionLabel: "惊喜连连",
            // 添加默认标签
            tags: ["热门", "推荐", "精选"].slice(0, Math.floor(Math.random() * 3) + 1)
          }));
        }
      } catch (err) {
        error.value = err;
        common_vendor.index.__f__("error", "at pages/Home/componets/trendy-tab.vue:228", "获取商品列表失败:", err);
      } finally {
        loading.value = false;
      }
    };
    const loadProducts = () => {
      if (props.autoLoad) {
        getWallpaperList();
      }
    };
    const loadMoreProducts = async (pagination) => {
      try {
        loading.value = true;
        const result = await src_api_product.api.getWallpaperList({
          classid: "65237031189f860b7613acf4",
          pageNum: pagination.page,
          pageSize: pagination.pageSize
        });
        if (result && Array.isArray(result.data)) {
          const newProducts = result.data.map((item) => ({
            ...item,
            id: item.id || item._id,
            title: item.title || item.Title || item.name,
            price: item.price || 0,
            imageUrl: item.smallPicurl || item.imageUrl || item.url,
            promotionLabel: "惊喜连连",
            tags: ["热门", "推荐", "精选"].slice(0, Math.floor(Math.random() * 3) + 1)
          }));
          localProductList.value.push(...newProducts);
        }
      } catch (err) {
        error.value = err;
        common_vendor.index.__f__("error", "at pages/Home/componets/trendy-tab.vue:271", "加载更多商品失败:", err);
      } finally {
        loading.value = false;
      }
    };
    common_vendor.watch(() => props.CarListToChild, (newList) => {
      if (newList && newList.length > 0) {
        localProductList.value = newList.map((item) => ({
          ...item,
          id: item.id || `${Date.now()}_${Math.random()}`,
          title: item.Title || item.title,
          imageUrl: item.smallPicurl || item.imageUrl,
          promotionLabel: "惊喜连连",
          tags: ["热门", "推荐", "精选"].slice(0, Math.floor(Math.random() * 3) + 1)
        }));
      }
    }, { immediate: true });
    common_vendor.onMounted(() => {
      loadProducts();
    });
    __expose({
      loadProducts,
      getWallpaperList,
      productList: localProductList
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleProductClick),
        b: common_vendor.o(handleImageLoad),
        c: common_vendor.o(handleImageError),
        d: common_vendor.o(handleActionClick),
        e: common_vendor.o(handleLoadMore),
        f: common_vendor.o(handleRetry),
        g: common_vendor.p({
          products: productList.value,
          title: __props.listTitle,
          layout: listLayout,
          columns,
          gap,
          ["card-layout"]: cardLayout,
          ["card-size"]: cardSize,
          ["image-config"]: imageConfig,
          ["show-header"]: showHeader,
          ["show-count"]: showCount,
          ["show-rating"]: showRating,
          ["show-description"]: showDescription,
          ["show-extra-info"]: showExtraInfo,
          ["show-actions"]: showActions,
          ["card-actions"]: cardActions,
          ["show-load-more"]: common_vendor.unref(showLoadMore),
          ["show-skeleton"]: showSkeleton,
          ["skeleton-count"]: skeletonCount,
          ["enable-lazy-load"]: enableLazyLoad,
          ["price-prefix"]: pricePrefix,
          ["max-tags"]: maxTags,
          ["empty-text"]: emptyText,
          ["custom-style"]: listCustomStyle
        }),
        h: common_vendor.gei(_ctx, "")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5d90c2f6"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/trendy-tab.js.map
