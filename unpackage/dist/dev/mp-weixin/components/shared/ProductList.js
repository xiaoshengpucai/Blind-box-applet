"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_product = require("../../stores/product.js");
if (!Math) {
  ProductCard();
}
const ProductCard = () => "./ProductCard.js";
const _sfc_main = {
  __name: "ProductList",
  props: {
    // 列表标题
    title: {
      type: String,
      default: ""
    },
    // 布局模式
    layout: {
      type: String,
      default: "grid",
      // grid | list | waterfall
      validator: (value) => ["grid", "list", "waterfall"].includes(value)
    },
    // 列数（grid模式）
    columns: {
      type: Number,
      default: 2,
      validator: (value) => value > 0 && value <= 4
    },
    // 间距
    gap: {
      type: [String, Number],
      default: "20rpx"
    },
    // 卡片配置
    cardLayout: {
      type: String,
      default: "vertical"
    },
    cardSize: {
      type: String,
      default: "medium"
    },
    cardActions: {
      type: Array,
      default: () => []
    },
    cardCustomStyle: {
      type: Object,
      default: () => ({})
    },
    cardCustomClass: {
      type: String,
      default: ""
    },
    // 图片配置
    imageConfig: {
      type: Object,
      default: () => ({
        width: "100%",
        height: "360rpx",
        borderRadius: "10rpx"
      })
    },
    // 显示配置
    showHeader: {
      type: Boolean,
      default: false
    },
    showCount: {
      type: Boolean,
      default: false
    },
    showRating: {
      type: Boolean,
      default: false
    },
    showDescription: {
      type: Boolean,
      default: false
    },
    showExtraInfo: {
      type: Boolean,
      default: false
    },
    showActions: {
      type: Boolean,
      default: false
    },
    showLoadMore: {
      type: Boolean,
      default: true
    },
    showRetry: {
      type: Boolean,
      default: true
    },
    showSkeleton: {
      type: Boolean,
      default: false
    },
    // 分页配置
    pageSize: {
      type: Number,
      default: 20
    },
    // 懒加载配置
    enableLazyLoad: {
      type: Boolean,
      default: true
    },
    enableVirtualScroll: {
      type: Boolean,
      default: false
    },
    // 价格前缀
    pricePrefix: {
      type: String,
      default: "¥"
    },
    // 最大标签数
    maxTags: {
      type: Number,
      default: 3
    },
    // 空状态文案
    emptyText: {
      type: String,
      default: "暂无商品"
    },
    // 骨架屏数量
    skeletonCount: {
      type: Number,
      default: 6
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default: () => ({})
    },
    // 自定义类名
    customClass: {
      type: String,
      default: ""
    }
  },
  emits: [
    "product-click",
    "image-load",
    "image-error",
    "action-click",
    "load-more",
    "retry",
    "update:products"
  ],
  setup(__props, { emit: __emit }) {
    const productStore = stores_product.useProductStore();
    const { productList, isLoading, hasMore, currentPage } = common_vendor.storeToRefs(productStore);
    const props = __props;
    const emit = __emit;
    const loadingMore = common_vendor.computed(() => isLoading.value && productList.value.length > 0);
    const showSkeleton = common_vendor.computed(() => isLoading.value && productList.value.length === 0);
    const listClasses = common_vendor.computed(() => [
      "product-list",
      `product-list-${props.layout}`,
      props.customClass
    ]);
    const listStyle = common_vendor.computed(() => {
      const style = { ...props.customStyle };
      const systemInfo = common_vendor.index.getSystemInfoSync();
      if (systemInfo.safeAreaInsets && systemInfo.safeAreaInsets.bottom > 0) {
        const safeAreaBottomRpx = systemInfo.safeAreaInsets.bottom * 2 + 60;
        const currentPaddingBottom = style.paddingBottom ? parseInt(style.paddingBottom) : 0;
        style.paddingBottom = `${currentPaddingBottom + safeAreaBottomRpx}rpx`;
      }
      return style;
    });
    const skeletonStyle = common_vendor.computed(() => {
      return { width: "100%" };
    });
    const totalCount = common_vendor.computed(() => productList.value.length);
    const isEmpty = common_vendor.computed(() => productList.value.length === 0);
    const gridStyle = common_vendor.computed(() => {
      const gap = typeof props.gap === "number" ? `${props.gap}rpx` : props.gap;
      if (props.layout === "grid") {
        return {
          display: "grid",
          gridTemplateColumns: `repeat(${props.columns}, 1fr)`,
          gap: `${gap} 10rpx`,
          padding: `0rpx ${gap}`,
          background: "#F5F5F5"
        };
      }
      if (props.layout === "list") {
        return {
          display: "flex",
          flexDirection: "column",
          gap,
          padding: gap
        };
      }
      return {
        display: "flex",
        flexWrap: "wrap",
        gap,
        padding: gap
      };
    });
    const getProductKey = (product, index) => {
      return product.id || product.uid || `product-${index}`;
    };
    const handleProductClick = (product) => {
      emit("product-click", product);
    };
    const handleImageLoad = (product) => {
      emit("image-load", product);
    };
    const handleImageError = (product) => {
      emit("image-error", product);
    };
    const handleActionClick = (payload) => {
      emit("action-click", payload);
    };
    const handleLoadMore = () => {
      if (!hasMore.value || loadingMore.value)
        return;
      productStore.loadMoreProducts();
      emit("load-more", {
        page: currentPage.value,
        pageSize: props.pageSize
      });
    };
    const handleRetry = () => {
      productStore.fetchProductList();
      emit("retry");
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.showHeader
      }, __props.showHeader ? common_vendor.e({
        b: common_vendor.t(__props.title),
        c: __props.showCount
      }, __props.showCount ? {
        d: common_vendor.t(totalCount.value)
      } : {}) : {}, {
        e: common_vendor.unref(isLoading) && !common_vendor.unref(productList).length && !showSkeleton.value
      }, common_vendor.unref(isLoading) && !common_vendor.unref(productList).length && !showSkeleton.value ? {} : isEmpty.value && !common_vendor.unref(isLoading) ? common_vendor.e({
        g: common_vendor.t(__props.emptyText),
        h: __props.showRetry
      }, __props.showRetry ? {
        i: common_vendor.o(handleRetry)
      } : {}) : {
        j: common_vendor.f(common_vendor.unref(productList), (product, index, i0) => {
          return {
            a: getProductKey(product, index),
            b: common_vendor.o(handleProductClick, getProductKey(product, index)),
            c: common_vendor.o(handleImageLoad, getProductKey(product, index)),
            d: common_vendor.o(handleImageError, getProductKey(product, index)),
            e: common_vendor.o(handleActionClick, getProductKey(product, index)),
            f: "1a048fba-0-" + i0,
            g: common_vendor.p({
              product,
              layout: __props.cardLayout,
              size: __props.cardSize,
              ["image-config"]: __props.imageConfig,
              ["show-rating"]: __props.showRating,
              ["show-description"]: __props.showDescription,
              ["show-extra-info"]: __props.showExtraInfo,
              ["show-actions"]: __props.showActions,
              actions: __props.cardActions,
              ["price-prefix"]: __props.pricePrefix,
              ["max-tags"]: __props.maxTags,
              ["enable-lazy-load"]: __props.enableLazyLoad,
              ["custom-style"]: __props.cardCustomStyle,
              ["custom-class"]: __props.cardCustomClass
            })
          };
        }),
        k: common_vendor.s(gridStyle.value)
      }, {
        f: isEmpty.value && !common_vendor.unref(isLoading),
        l: __props.showLoadMore
      }, __props.showLoadMore ? common_vendor.e({
        m: loadingMore.value
      }, loadingMore.value ? {} : common_vendor.unref(hasMore) ? {
        o: common_vendor.o(handleLoadMore)
      } : {}, {
        n: common_vendor.unref(hasMore)
      }) : {}, {
        p: showSkeleton.value
      }, showSkeleton.value ? {
        q: common_vendor.f(__props.skeletonCount, (skeleton, k0, i0) => {
          return {
            a: skeleton
          };
        }),
        r: common_vendor.s(skeletonStyle.value),
        s: common_vendor.s(gridStyle.value)
      } : {}, {
        t: common_vendor.n(listClasses.value),
        v: common_vendor.s(listStyle.value),
        w: common_vendor.gei(_ctx, "")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1a048fba"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/shared/ProductList.js.map
