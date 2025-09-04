"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  UniLazyImage();
}
const UniLazyImage = () => "./UniLazyImage.js";
const _sfc_main = {
  __name: "ProductCard",
  props: {
    // 商品数据
    product: {
      type: Object,
      required: true,
      validator: (value) => {
        return value && value.id;
      }
    },
    // 卡片布局模式
    layout: {
      type: String,
      default: "vertical",
      // vertical | horizontal | grid
      validator: (value) => ["vertical", "horizontal", "grid"].includes(value)
    },
    // 卡片尺寸
    size: {
      type: String,
      default: "medium",
      // small | medium | large
      validator: (value) => ["small", "medium", "large"].includes(value)
    },
    // 图片尺寸配置
    imageConfig: {
      type: Object,
      default: () => ({
        width: "100%",
        height: "360rpx",
        borderRadius: "10rpx"
      })
    },
    // 是否显示评分
    showRating: {
      type: Boolean,
      default: false
    },
    // 是否显示描述
    showDescription: {
      type: Boolean,
      default: false
    },
    // 是否显示额外信息
    showExtraInfo: {
      type: Boolean,
      default: false
    },
    // 是否显示操作按钮
    showActions: {
      type: Boolean,
      default: false
    },
    // 操作按钮配置
    actions: {
      type: Array,
      default: () => []
    },
    // 价格前缀
    pricePrefix: {
      type: String,
      default: "¥"
    },
    // 最大显示标签数
    maxTags: {
      type: Number,
      default: 3
    },
    // 是否启用懒加载
    enableLazyLoad: {
      type: Boolean,
      default: true
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
  emits: ["click", "image-load", "image-error", "action-click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const defaultImages = {
      placeholder: "https://img1.baidu.com/it/u=2244894265,3017695745&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1082",
      error: "https://img2.baidu.com/it/u=1455518479,3144936783&fm=253&fmt=auto&app=120&f=PNG?w=500&h=1065"
    };
    const sizeConfigs = {
      small: {
        cardWidth: "300rpx",
        cardHeight: "auto",
        imageHeight: "300rpx",
        fontSize: "24rpx",
        priceSize: "28rpx"
      },
      medium: {
        cardWidth: "350rpx",
        cardHeight: "auto",
        imageHeight: "360rpx",
        fontSize: "26rpx",
        priceSize: "32rpx"
      },
      large: {
        cardWidth: "400rpx",
        cardHeight: "auto",
        imageHeight: "400rpx",
        fontSize: "28rpx",
        priceSize: "36rpx"
      }
    };
    const cardClasses = common_vendor.computed(() => [
      "product-card",
      `product-card-${props.layout}`,
      `product-card-${props.size}`,
      props.customClass
    ]);
    const cardStyle = common_vendor.computed(() => {
      const config = sizeConfigs[props.size];
      return {
        width: config.cardWidth,
        height: config.cardHeight,
        ...props.customStyle
      };
    });
    const imageWidth = common_vendor.computed(() => {
      return props.imageConfig.width || "100%";
    });
    const imageHeight = common_vendor.computed(() => {
      return props.imageConfig.height || sizeConfigs[props.size].imageHeight;
    });
    const imageBorderRadius = common_vendor.computed(() => {
      return props.imageConfig.borderRadius || "10rpx";
    });
    common_vendor.computed(() => {
      if (!props.product.tags)
        return [];
      return props.product.tags.slice(0, props.maxTags);
    });
    const priceStyle = common_vendor.computed(() => ({
      fontSize: sizeConfigs[props.size].priceSize,
      fontWeight: "bold",
      color: "#e7717b"
    }));
    const titleStyle = common_vendor.computed(() => ({
      fontSize: sizeConfigs[props.size].fontSize,
      lineHeight: "1.4",
      color: "#333"
    }));
    common_vendor.computed(() => ({
      fontSize: "20rpx",
      backgroundColor: "#f7bf6c",
      color: "#333",
      padding: "4rpx 8rpx",
      borderRadius: "4rpx"
    }));
    common_vendor.computed(() => ({
      backgroundColor: "#d33b2e",
      color: "#fff",
      fontSize: "22rpx",
      fontWeight: "bold"
    }));
    const formatPrice = (price) => {
      if (price === void 0 || price === null)
        return "";
      const numPrice = parseFloat(price);
      if (isNaN(numPrice))
        return price;
      return `${props.pricePrefix}${numPrice.toFixed(2)}`;
    };
    const handleCardClick = () => {
      emit("click", props.product);
    };
    const handleImageLoad = () => {
      emit("image-load", props.product);
    };
    const handleImageError = () => {
      emit("image-error", props.product);
    };
    const handleActionClick = (action) => {
      emit("action-click", {
        action,
        product: props.product
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleImageLoad),
        b: common_vendor.o(handleImageError),
        c: common_vendor.p({
          src: __props.product.image_url || __props.product.smallPicurl,
          placeholder: defaultImages.placeholder,
          ["error-image"]: defaultImages.error,
          width: imageWidth.value,
          height: imageHeight.value,
          ["border-radius"]: imageBorderRadius.value,
          ["enable-lazy-load"]: __props.enableLazyLoad
        }),
        d: common_vendor.t(formatPrice(__props.product.price)),
        e: common_vendor.s(priceStyle.value),
        f: common_vendor.t(__props.product.category || __props.product.Title),
        g: common_vendor.s(titleStyle.value),
        h: __props.showActions
      }, __props.showActions ? {
        i: common_vendor.f(__props.actions, (action, k0, i0) => {
          return {
            a: common_vendor.t(action.text),
            b: action.key,
            c: common_vendor.n(action.class),
            d: common_vendor.s(action.style),
            e: common_vendor.o(($event) => handleActionClick(action), action.key)
          };
        })
      } : {}, {
        j: common_vendor.n(cardClasses.value),
        k: common_vendor.s(cardStyle.value),
        l: common_vendor.o(handleCardClick),
        m: common_vendor.gei(_ctx, "")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8df9df9a"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/shared/ProductCard.js.map
