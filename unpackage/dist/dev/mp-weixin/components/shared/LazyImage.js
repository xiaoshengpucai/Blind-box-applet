"use strict";
const common_vendor = require("../../common/vendor.js");
const src_composables_useLazyLoad = require("../../src/composables/useLazyLoad.js");
const _sfc_main = {
  __name: "LazyImage",
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
      default: "aspectFill",
      validator: (value) => [
        "scaleToFill",
        "aspectFit",
        "aspectFill",
        "widthFix",
        "heightFix",
        "top",
        "bottom",
        "center",
        "left",
        "right",
        "top left",
        "top right",
        "bottom left",
        "bottom right"
      ].includes(value)
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
    },
    // 观察器配置
    observerOptions: {
      type: Object,
      default: () => ({
        threshold: 0.1,
        rootMargin: "50px"
      })
    }
  },
  emits: ["load", "error", "retry"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const imageRef = common_vendor.ref(null);
    common_vendor.index.__f__("log", "at components/shared/LazyImage.vue:150", props.src, "-=-=-=-=-=-=-=-=-=-=-=-=-=");
    const {
      loading,
      loaded,
      error,
      currentSrc,
      retryCount,
      load,
      retry,
      reset,
      observe,
      unobserve
    } = src_composables_useLazyLoad.useLazyLoad({
      placeholder: props.placeholder,
      errorImage: props.errorImage,
      enableRetry: props.enableRetry,
      maxRetries: props.maxRetries,
      ...props.observerOptions
    });
    common_vendor.computed(() => {
      if (error.value && props.errorImage) {
        return props.errorImage;
      }
      return currentSrc.value || props.placeholder;
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
        position: "relative"
      };
    });
    const imageStyle = common_vendor.computed(() => ({
      width: "100%",
      height: "100%",
      opacity: loaded.value ? 1 : 0,
      transition: "opacity 0.3s ease-in-out"
    }));
    const imageClasses = common_vendor.computed(() => [
      "lazy-image",
      {
        "lazy-image-loaded": loaded.value,
        "lazy-image-loading": loading.value,
        "lazy-image-error": error.value
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
      backgroundColor: "#f5f5f5",
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
      backgroundColor: "#f0f0f0",
      cursor: props.enableRetry ? "pointer" : "default",
      zIndex: 2
    }));
    const handleLoad = () => {
      loading.value = false;
      loaded.value = true;
      error.value = false;
      emit("load");
    };
    const handleError = () => {
      loading.value = false;
      error.value = true;
      if (props.enableRetry && retryCount.value < props.maxRetries) {
        retryCount.value++;
        setTimeout(() => {
          loading.value = true;
          error.value = false;
        }, 1e3 * retryCount.value);
      }
      emit("error");
    };
    const handleRetry = () => {
      if (!props.enableRetry)
        return;
      retry(props.src);
      emit("retry", retryCount.value);
    };
    const initLazyLoad = () => {
      if (!props.enableLazyLoad) {
        loaded.value = true;
        return;
      }
      loading.value = true;
      if (typeof window !== "undefined" && window.IntersectionObserver) {
        common_vendor.nextTick$1(() => {
          try {
            if (imageRef.value) {
              observe(imageRef.value, props.src);
            } else {
              setTimeout(() => {
                loaded.value = true;
                loading.value = false;
              }, 100);
            }
          } catch (error2) {
            common_vendor.index.__f__("warn", "at components/shared/LazyImage.vue:325", "LazyImage: IntersectionObserver初始化失败，使用原生懒加载");
            setTimeout(() => {
              loaded.value = true;
              loading.value = false;
            }, 100);
          }
        });
      } else {
        setTimeout(() => {
          loaded.value = true;
          loading.value = false;
        }, 100);
      }
    };
    common_vendor.watch(() => props.src, (newSrc, oldSrc) => {
      if (newSrc !== oldSrc) {
        reset();
        unobserve();
        if (newSrc) {
          initLazyLoad();
        }
      }
    });
    common_vendor.onMounted(() => {
      if (props.src) {
        initLazyLoad();
      }
    });
    common_vendor.onUnmounted(() => {
      unobserve();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.n(imageClasses.value),
        b: props.enableLazyLoad ? common_vendor.unref(loaded).value ? props.src : props.placeholder : props.src,
        c: __props.mode,
        d: common_vendor.s(imageStyle.value),
        e: common_vendor.o(handleLoad),
        f: common_vendor.o(handleError),
        g: __props.enableLazyLoad,
        h: common_vendor.unref(loading) && __props.showLoading
      }, common_vendor.unref(loading) && __props.showLoading ? common_vendor.e({
        i: __props.loadingText
      }, __props.loadingText ? {
        j: common_vendor.t(__props.loadingText)
      } : {}, {
        k: common_vendor.s(loadingStyle.value)
      }) : {}, {
        l: common_vendor.unref(error) && __props.showError
      }, common_vendor.unref(error) && __props.showError ? common_vendor.e({
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
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-276ec750"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/shared/LazyImage.js.map
