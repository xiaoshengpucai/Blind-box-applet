"use strict";
const common_vendor = require("../../common/vendor.js");
const src_composables_useSwiper = require("../../src/composables/useSwiper.js");
const src_composables_useThrottle = require("../../src/composables/useThrottle.js");
if (!Array) {
  const _easycom_up_icon2 = common_vendor.resolveComponent("up-icon");
  _easycom_up_icon2();
}
const _easycom_up_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (_easycom_up_icon + SimpleImage)();
}
const SimpleImage = () => "./SimpleImage.js";
const _sfc_main = {
  __name: "EnhancedSwiper",
  props: {
    // 轮播图数据
    slides: {
      type: Array,
      required: true,
      default: () => []
    },
    // 轮播模式
    mode: {
      type: String,
      default: "slide",
      // slide | fade
      validator: (value) => ["slide", "fade"].includes(value)
    },
    // 自动播放
    autoplay: {
      type: Boolean,
      default: true
    },
    // 播放间隔
    interval: {
      type: Number,
      default: 3e3
    },
    // 切换时长
    duration: {
      type: Number,
      default: 500
    },
    // 是否循环
    circular: {
      type: Boolean,
      default: true
    },
    // 容器尺寸
    width: {
      type: [String, Number],
      default: "100%"
    },
    height: {
      type: [String, Number],
      default: "400rpx"
    },
    // 轮播图圆角
    borderRadius: {
      type: [String, Number],
      default: "20rpx"
    },
    // 幻灯片圆角
    slideRadius: {
      type: [String, Number],
      default: "20rpx"
    },
    // 边框配置
    border: {
      type: Object,
      default: () => ({
        width: "15rpx",
        color: "#cd4438",
        style: "solid"
      })
    },
    // 是否显示标题
    showTitle: {
      type: Boolean,
      default: false
    },
    // 标题配置
    title: {
      type: String,
      default: "RECOMMENDED"
    },
    headerIcon: {
      type: String,
      default: "gift-fill"
    },
    headerStyle: {
      type: Object,
      default: () => ({})
    },
    // 是否显示装饰图标
    showDecorations: {
      type: Boolean,
      default: false
    },
    decorations: {
      type: Array,
      default: () => []
    },
    // 是否显示控制按钮
    showControls: {
      type: Boolean,
      default: false
    },
    // 是否显示指示器
    showIndicators: {
      type: Boolean,
      default: true
    },
    // 指示器样式
    indicatorStyle: {
      type: Object,
      default: () => ({})
    },
    // 是否显示底部装饰
    showFloor: {
      type: Boolean,
      default: false
    },
    floorDots: {
      type: Number,
      default: 10
    },
    // 占位图
    placeholder: {
      type: String,
      default: ""
    },
    // 错误图
    errorImage: {
      type: String,
      default: ""
    },
    // 是否启用懒加载
    enableLazyLoad: {
      type: Boolean,
      default: true
    },
    // 图片字段映射
    imageField: {
      type: String,
      default: "src"
      // src | imageUrl | url
    },
    // 自定义样式
    customStyle: {
      type: Object,
      default: () => ({})
    }
  },
  emits: [
    "change",
    "click",
    "image-load",
    "image-error",
    "autoplay-start",
    "autoplay-stop"
  ],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const {
      currentIndex,
      realIndex,
      displaySlides,
      isTransitioning,
      transitionStyle,
      dynamicTransform,
      dynamicTransition,
      isDragging,
      dragOffset,
      next,
      prev,
      goToRealIndex,
      resetTransitionState,
      startAutoplay,
      stopAutoplay,
      resetAutoplay,
      handleTouchStart,
      handleTouchMove,
      handleTouchEnd
    } = src_composables_useSwiper.useSwiper({
      slides: common_vendor.toRefs(props).slides,
      autoplay: props.autoplay,
      interval: props.interval,
      duration: props.duration,
      circular: props.circular,
      switchMode: props.mode
    });
    src_composables_useThrottle.useThrottle(next, 300);
    src_composables_useThrottle.useThrottle(prev, 300);
    common_vendor.index.__f__("log", "at components/shared/EnhancedSwiper.vue:348", "realIndex", realIndex.value);
    const containerStyle = common_vendor.computed(() => {
      const width = typeof props.width === "number" ? `${props.width}rpx` : props.width;
      const height = typeof props.height === "number" ? `${props.height}rpx` : props.height;
      return {
        width,
        height,
        position: "relative",
        overflow: "visible",
        ...props.customStyle
      };
    });
    const swiperStyle = common_vendor.computed(() => {
      const borderRadius = typeof props.borderRadius === "number" ? `${props.borderRadius}rpx` : props.borderRadius;
      return {
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        borderRadius,
        border: `${props.border.width} ${props.border.style} ${props.border.color}`,
        backgroundColor: props.border.color
      };
    });
    const controlButtonStyle = common_vendor.computed(() => ({
      width: "100rpx",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      border: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "all 0.3s ease"
    }));
    const dotStyle = common_vendor.computed(() => ({}));
    const getSlideImage = (slide) => {
      if (!slide)
        return "";
      return slide[props.imageField] || slide.src || slide.imageUrl || slide.url || slide.image || "";
    };
    const handleImageLoad = (slide, index) => {
      emit("image-load", { slide, index });
    };
    const handleImageError = (slide, index) => {
      emit("image-error", { slide, index });
    };
    const handlePrevClick = () => {
      common_vendor.index.__f__("log", "at components/shared/EnhancedSwiper.vue:478", "------prev button clicked, isTransitioning:", isTransitioning.value);
      prev();
    };
    const handleNextClick = () => {
      common_vendor.index.__f__("log", "at components/shared/EnhancedSwiper.vue:487", "------next button clicked, isTransitioning:", isTransitioning.value);
      next();
    };
    const handleMouseDown = (e) => {
      handleTouchStart({
        touches: [{ clientX: e.clientX }]
      });
    };
    const handleMouseMove = (e) => {
      handleTouchMove({
        touches: [{ clientX: e.clientX }]
      });
    };
    const handleMouseUp = () => {
      handleTouchEnd();
    };
    const handleMouseLeave = () => {
      handleTouchEnd();
    };
    common_vendor.watch(realIndex, (newIndex, oldIndex) => {
      if (newIndex !== oldIndex) {
        emit("change", {
          current: newIndex,
          previous: oldIndex,
          slide: props.slides[newIndex]
        });
      }
    });
    common_vendor.watch(() => props.autoplay, (autoplay) => {
      if (autoplay) {
        startAutoplay();
        emit("autoplay-start");
      } else {
        stopAutoplay();
        emit("autoplay-stop");
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.showTitle
      }, __props.showTitle ? common_vendor.e({
        b: __props.headerIcon
      }, __props.headerIcon ? {
        c: common_vendor.p({
          name: __props.headerIcon,
          color: "#fff",
          size: "22"
        })
      } : {}, {
        d: common_vendor.t(__props.title),
        e: common_vendor.s(__props.headerStyle)
      }) : {}, {
        f: __props.showDecorations
      }, __props.showDecorations ? {
        g: common_vendor.f(__props.decorations, (decoration, index, i0) => {
          return {
            a: decoration.src,
            b: common_vendor.s(decoration.imageStyle),
            c: index,
            d: common_vendor.s(decoration.style)
          };
        })
      } : {}, {
        h: __props.mode === "slide"
      }, __props.mode === "slide" ? {
        i: common_vendor.f(common_vendor.unref(displaySlides), (slide, index, i0) => {
          return {
            a: common_vendor.o(($event) => handleImageLoad(slide, index), `slide-${index}`),
            b: common_vendor.o(($event) => handleImageError(slide, index), `slide-${index}`),
            c: "976540e0-1-" + i0,
            d: common_vendor.p({
              src: getSlideImage(slide),
              width: "100%",
              height: "100%",
              ["border-radius"]: __props.slideRadius
            }),
            e: `slide-${index}`
          };
        }),
        j: common_vendor.unref(dynamicTransform),
        k: common_vendor.unref(dynamicTransition)
      } : __props.mode === "fade" ? {
        m: common_vendor.f(__props.slides, (slide, index, i0) => {
          return {
            a: "976540e0-2-" + i0,
            b: common_vendor.p({
              src: getSlideImage(slide),
              width: "100%",
              height: "100%",
              ["border-radius"]: __props.slideRadius
            }),
            c: `fade-${index}`,
            d: common_vendor.unref(realIndex) === index ? 1 : "",
            e: common_vendor.unref(realIndex) === index ? 1 : 0,
            f: common_vendor.unref(realIndex) === index ? 2 : 1
          };
        }),
        n: `opacity ${__props.duration}ms ease`
      } : {}, {
        l: __props.mode === "fade",
        o: __props.showControls
      }, __props.showControls ? {
        p: common_vendor.p({
          name: "arrow-left",
          color: "#fff",
          size: "20"
        }),
        q: common_vendor.s(controlButtonStyle.value),
        r: common_vendor.o(handlePrevClick),
        s: common_vendor.p({
          name: "arrow-right",
          color: "#fff",
          size: "20"
        }),
        t: common_vendor.s(controlButtonStyle.value),
        v: common_vendor.o(handleNextClick)
      } : {}, {
        w: __props.showIndicators
      }, __props.showIndicators ? {
        x: common_vendor.f(__props.slides, (slide, index, i0) => {
          return common_vendor.e({
            a: common_vendor.unref(realIndex) === index
          }, common_vendor.unref(realIndex) === index ? {} : {}, {
            b: `indicator-${index}`,
            c: common_vendor.unref(realIndex) === index ? 1 : "",
            d: common_vendor.o(() => common_vendor.unref(goToRealIndex)(index), `indicator-${index}`)
          });
        }),
        y: common_vendor.s(dotStyle.value),
        z: common_vendor.s(__props.indicatorStyle)
      } : {}, {
        A: common_vendor.s(swiperStyle.value),
        B: common_vendor.o((...args) => common_vendor.unref(handleTouchStart) && common_vendor.unref(handleTouchStart)(...args)),
        C: common_vendor.o((...args) => common_vendor.unref(handleTouchMove) && common_vendor.unref(handleTouchMove)(...args)),
        D: common_vendor.o((...args) => common_vendor.unref(handleTouchEnd) && common_vendor.unref(handleTouchEnd)(...args)),
        E: common_vendor.o(handleMouseDown),
        F: common_vendor.o(handleMouseMove),
        G: common_vendor.o(handleMouseUp),
        H: common_vendor.o(handleMouseLeave),
        I: __props.showFloor
      }, __props.showFloor ? {
        J: common_vendor.f(__props.floorDots, (dot, k0, i0) => {
          return {
            a: dot
          };
        })
      } : {}, {
        K: common_vendor.s(containerStyle.value),
        L: common_vendor.gei(_ctx, "")
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-976540e0"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/shared/EnhancedSwiper.js.map
