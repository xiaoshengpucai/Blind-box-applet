"use strict";
const common_vendor = require("../../../common/vendor.js");
if (!Math) {
  EnhancedSwiper();
}
const EnhancedSwiper = () => "../../../components/shared/EnhancedSwiper.js";
const swiperWidth = "90%";
const swiperHeight = "350rpx";
const borderRadius = "0 20rpx 20rpx 20rpx";
const slideRadius = "20rpx";
const title = "RECOMMENDED";
const headerIcon = "gift-fill";
const imageField = "imageUrl";
const _sfc_main = {
  __name: "swiper",
  props: {
    slide: {
      type: Array,
      required: true
      // 暂时移除验证器进行调试
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3e3
    },
    duration: {
      type: Number,
      default: 500
    },
    switchModeL: {
      type: String,
      default: "slide"
      // 改为slide模式以显示向左切换效果
    },
    circular: {
      type: Boolean,
      default: true
    },
    showIndicators: {
      type: Boolean,
      default: true
    },
    isshowcontrols: {
      type: Boolean,
      default: true
    }
  },
  emits: ["change", "click", "image-load", "image-error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const borderConfig = {
      width: "15rpx",
      color: "#cd4438",
      style: "solid"
    };
    const decorationIcons = [
      {
        src: "/static/icon/ice.svg",
        style: {
          position: "absolute",
          left: "10rpx",
          top: "-20rpx",
          zIndex: 1
        },
        imageStyle: {
          width: "60rpx",
          animation: "roleAnimation 2s linear infinite"
        }
      },
      {
        src: "/static/icon/aircraft.svg",
        style: {
          position: "absolute",
          left: "40rpx",
          top: "-20rpx",
          zIndex: 3
        },
        imageStyle: {
          width: "80rpx",
          animation: "fly 3s linear infinite"
        }
      },
      {
        src: "/static/icon/gost.svg",
        style: {
          position: "absolute",
          left: "130rpx",
          top: "-10rpx",
          zIndex: 2
        },
        imageStyle: {
          width: "70rpx",
          animation: "roleAnimation 1.5s linear infinite"
        }
      }
    ];
    const customSwiperStyle = common_vendor.computed(() => ({
      marginLeft: "40rpx",
      marginRight: "24rpx"
    }));
    const handleChange = (data) => {
      emit("change", data);
    };
    const handleSlideClick = (data) => {
      common_vendor.index.__f__("log", "at pages/Home/componets/swiper.vue:160", data, "handleSlideClick");
      emit("click", data);
    };
    const handleImageLoad = (data) => {
      emit("image-load", data);
    };
    const handleImageError = (data) => {
      common_vendor.index.__f__("warn", "at pages/Home/componets/swiper.vue:177", "轮播图图片加载失败:", data);
      emit("image-error", data);
    };
    common_vendor.watch(() => props.slide, (newSlide) => {
    }, { immediate: true, deep: true });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleChange),
        b: common_vendor.o(handleImageLoad),
        c: common_vendor.o(handleImageError),
        d: common_vendor.o(handleSlideClick),
        e: common_vendor.p({
          slides: __props.slide,
          mode: __props.switchModeL,
          autoplay: __props.autoplay,
          interval: __props.interval,
          duration: __props.duration,
          circular: __props.circular,
          width: swiperWidth,
          height: swiperHeight,
          ["border-radius"]: borderRadius,
          ["slide-radius"]: slideRadius,
          border: borderConfig,
          ["show-title"]: true,
          title,
          ["header-icon"]: headerIcon,
          ["show-decorations"]: true,
          decorations: decorationIcons,
          ["show-controls"]: __props.isshowcontrols,
          ["show-indicators"]: __props.showIndicators,
          ["show-floor"]: true,
          ["floor-dots"]: 10,
          ["image-field"]: imageField,
          ["custom-style"]: customSwiperStyle.value
        }),
        f: common_vendor.gei(_ctx, "")
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-4ce4781f"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/Home/componets/swiper.js.map
