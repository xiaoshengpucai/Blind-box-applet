"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "UniLazyImage",
  props: {
    // 图片地址
    src: {
      type: String,
      required: true
    },
    // 占位图地址
    placeholder: {
      type: String,
      default: ""
    },
    // 错误图地址
    errorImage: {
      type: String,
      default: ""
    },
    // 图片模式
    mode: {
      type: String,
      default: "aspectFill"
    },
    // 容器宽度
    width: {
      type: [String, Number],
      default: "100%"
    },
    // 容器高度
    height: {
      type: [String, Number],
      default: "200rpx"
    },
    // 圆角
    borderRadius: {
      type: [String, Number],
      default: "0"
    },
    // 是否启用懒加载
    enableLazyLoad: {
      type: Boolean,
      default: true
    },
    // 是否启用重试
    enableRetry: {
      type: Boolean,
      default: true
    },
    // 最大重试次数
    maxRetries: {
      type: Number,
      default: 3
    },
    // 是否显示加载状态
    showLoading: {
      type: Boolean,
      default: true
    },
    // 是否显示错误状态
    showError: {
      type: Boolean,
      default: true
    },
    // 加载文案
    loadingText: {
      type: String,
      default: ""
    },
    // 错误文案
    errorText: {
      type: String,
      default: "图片加载失败"
    },
    // 自定义类名
    customClass: {
      type: String,
      default: ""
    }
  },
  emits: ["load", "error", "retry"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isLoading = common_vendor.ref(false);
    const isLoaded = common_vendor.ref(false);
    const hasError = common_vendor.ref(false);
    const retryCount = common_vendor.ref(0);
    const imageSrc = common_vendor.computed(() => {
      if (hasError.value && props.errorImage) {
        return props.errorImage;
      }
      if (isLoading.value && props.placeholder && !props.enableLazyLoad) {
        return props.placeholder;
      }
      return props.src;
    });
    const containerStyle = common_vendor.computed(() => {
      const width = typeof props.width === "number" ? `${props.width}rpx` : props.width;
      const height = typeof props.height === "number" ? `${props.height}rpx` : props.height;
      const borderRadius = typeof props.borderRadius === "number" ? `${props.borderRadius}rpx` : props.borderRadius;
      return {
        width,
        height,
        borderRadius,
        overflow: "hidden",
        position: "relative",
        backgroundColor: "#f5f5f5"
      };
    });
    const imageStyle = common_vendor.computed(() => ({
      width: "100%",
      height: "100%",
      opacity: isLoaded.value ? 1 : props.placeholder ? 1 : 0,
      transition: "opacity 0.3s ease-in-out"
    }));
    const imageClasses = common_vendor.computed(() => [
      "uni-lazy-image",
      {
        "uni-lazy-image-loaded": isLoaded.value,
        "uni-lazy-image-loading": isLoading.value,
        "uni-lazy-image-error": hasError.value
      },
      props.customClass
    ]);
    const loadingStyle = common_vendor.computed(() => ({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(245, 245, 245, 0.8)",
      zIndex: 1
    }));
    const errorStyle = common_vendor.computed(() => ({
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(240, 240, 240, 0.9)",
      cursor: props.enableRetry ? "pointer" : "default",
      zIndex: 2
    }));
    const handleLoad = () => {
      isLoading.value = false;
      isLoaded.value = true;
      hasError.value = false;
      retryCount.value = 0;
      emit("load");
    };
    const handleError = () => {
      isLoading.value = false;
      hasError.value = true;
      if (props.enableRetry && retryCount.value < props.maxRetries) {
        setTimeout(() => {
          retryCount.value++;
          isLoading.value = true;
          hasError.value = false;
        }, 1e3 * retryCount.value);
      }
      emit("error");
    };
    const handleRetry = () => {
      if (!props.enableRetry || retryCount.value >= props.maxRetries)
        return;
      retryCount.value++;
      isLoading.value = true;
      hasError.value = false;
      emit("retry", retryCount.value);
    };
    const reset = () => {
      isLoading.value = true;
      isLoaded.value = false;
      hasError.value = false;
      retryCount.value = 0;
    };
    common_vendor.watch(() => props.src, (newSrc, oldSrc) => {
      if (newSrc !== oldSrc && newSrc) {
        reset();
      }
    });
    __expose({
      reset,
      retry: handleRetry,
      isLoading: () => isLoading.value,
      isLoaded: () => isLoaded.value,
      hasError: () => hasError.value
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.n(imageClasses.value),
        b: imageSrc.value,
        c: __props.mode,
        d: common_vendor.s(imageStyle.value),
        e: __props.enableLazyLoad,
        f: common_vendor.o(handleLoad),
        g: common_vendor.o(handleError),
        h: isLoading.value && __props.showLoading
      }, isLoading.value && __props.showLoading ? common_vendor.e({
        i: __props.loadingText
      }, __props.loadingText ? {
        j: common_vendor.t(__props.loadingText)
      } : {}, {
        k: common_vendor.s(loadingStyle.value)
      }) : {}, {
        l: hasError.value && __props.showError
      }, hasError.value && __props.showError ? common_vendor.e({
        m: common_vendor.t(__props.errorText),
        n: __props.enableRetry
      }, __props.enableRetry ? {} : {}, {
        o: common_vendor.r("error", {
          retry: handleRetry
        }),
        p: common_vendor.s(errorStyle.value),
        q: common_vendor.o(handleRetry)
      }) : {}, {
        r: common_vendor.s(containerStyle.value),
        s: common_vendor.gei(_ctx, "")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-f11eb715"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/shared/UniLazyImage.js.map
