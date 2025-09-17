"use strict";
const common_vendor = require("./common/vendor.js");
if (!Array) {
  const _easycom_up_icon2 = common_vendor.resolveComponent("up-icon");
  _easycom_up_icon2();
}
const _easycom_up_icon = () => "./node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  _easycom_up_icon();
}
const _sfc_main = {
  __name: "chlid-swiper",
  props: {
    datalist: {
      type: Array,
      default: () => []
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    autoPlayInterval: {
      type: Number,
      default: 3e3
    }
  },
  setup(__props) {
    const props = __props;
    const imageLoadedState = common_vendor.reactive({});
    common_vendor.watch(() => props.datalist, (newDatalist) => {
      if (!newDatalist)
        return;
      newDatalist.forEach((item) => {
        if (imageLoadedState[item.id] === void 0) {
          imageLoadedState[item.id] = false;
        }
      });
    }, {
      deep: true,
      immediate: true
    });
    const onImageLoad = (id) => {
      imageLoadedState[id] = true;
    };
    const onImageError = (id) => {
      imageLoadedState[id] = true;
    };
    let autoPlayTimer = null;
    const currentIndex = common_vendor.ref(0);
    const isAnimating = common_vendor.ref(false);
    const transitionEnabled = common_vendor.ref(true);
    const initList = common_vendor.computed(() => {
      if (!props.datalist || props.datalist.length === 0)
        return [];
      return [...props.datalist, ...props.datalist, ...props.datalist];
    });
    common_vendor.watch(() => props.datalist, (newVal) => {
      if (newVal && newVal.length > 0) {
        transitionEnabled.value = false;
        currentIndex.value = newVal.length;
        common_vendor.nextTick$1(() => {
          transitionEnabled.value = true;
        });
      }
    }, {
      immediate: true,
      deep: true
    });
    const contentData = common_vendor.computed(() => {
      if (!initList.value || initList.value.length === 0)
        return {};
      return initList.value[currentIndex.value];
    });
    const wrapperStyle = common_vendor.computed(() => {
      const itemHeight = 120;
      const containerHeight = 360;
      const offset = (containerHeight - itemHeight) / 2;
      const translateY = -currentIndex.value * itemHeight + offset;
      return {
        transform: `translateY(${translateY}rpx)`,
        transition: transitionEnabled.value ? "transform 0.5s ease-in-out" : "none"
      };
    });
    const prevSlide = () => {
      if (isAnimating.value || props.datalist.length <= 1)
        return;
      isAnimating.value = true;
      transitionEnabled.value = true;
      resetAutoPlay();
      currentIndex.value++;
      if (currentIndex.value >= props.datalist.length * 2) {
        setTimeout(() => {
          transitionEnabled.value = false;
          currentIndex.value = props.datalist.length;
          isAnimating.value = false;
        }, 500);
      } else {
        isAnimating.value = false;
      }
    };
    const startAutoPlay = () => {
      if (!props.autoPlay || props.datalist.length <= 1)
        return;
      stopAutoPlay();
      autoPlayTimer = setInterval(prevSlide, props.autoPlayInterval);
    };
    const stopAutoPlay = () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    };
    const resetAutoPlay = () => {
      stopAutoPlay();
      startAutoPlay();
    };
    const changeIndex = (clickedIndex) => {
      if (isAnimating.value || clickedIndex === currentIndex.value)
        return;
      const trueIndex = clickedIndex % props.datalist.length;
      const targetInMiddle = props.datalist.length + trueIndex;
      isAnimating.value = true;
      transitionEnabled.value = true;
      currentIndex.value = clickedIndex;
      resetAutoPlay();
      if (currentIndex.value !== targetInMiddle) {
        setTimeout(() => {
          transitionEnabled.value = false;
          currentIndex.value = targetInMiddle;
          isAnimating.value = false;
        }, 500);
      } else {
        isAnimating.value = false;
      }
    };
    common_vendor.onMounted(() => {
      startAutoPlay();
    });
    common_vendor.onBeforeUnmount(() => {
      stopAutoPlay();
    });
    common_vendor.watch(() => props.autoPlay, (newVal) => {
      if (newVal) {
        startAutoPlay();
      } else {
        stopAutoPlay();
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "order",
          size: "20"
        }),
        b: common_vendor.p({
          name: "bag",
          size: "20"
        }),
        c: contentData.value.image_url,
        d: common_vendor.f(initList.value, (item, index, i0) => {
          return {
            a: imageLoadedState[item.id] ? 1 : "",
            b: item.image_url,
            c: common_vendor.o(($event) => onImageLoad(item.id), index),
            d: common_vendor.o(($event) => onImageError(item.id), index),
            e: common_vendor.t(item.title),
            f: common_vendor.o(($event) => changeIndex(index), index),
            g: index
          };
        }),
        e: common_vendor.s(wrapperStyle.value),
        f: common_vendor.t(contentData.value.title),
        g: common_vendor.t(contentData.value.price),
        h: common_vendor.gei(_ctx, "")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a8118bef"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/chlid-swiper.js.map
