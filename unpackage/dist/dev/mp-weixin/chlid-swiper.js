"use strict";
const common_vendor = require("./common/vendor.js");
const src_utils_format = require("./src/utils/format.js");
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
    isAnimating: {
      type: Boolean,
      default: false
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
    let {
      datalist,
      isAnimating,
      autoPlay,
      autoPlayInterval
    } = props;
    let autoPlayTimer = null;
    const currentIndex = common_vendor.ref(0);
    const transitionStyle = common_vendor.ref("transform 0.5s ease");
    const translateY = common_vendor.computed(() => {
      return `translateY(-${currentIndex.value * 100}%)`;
    });
    const contentData = common_vendor.ref({});
    contentData.value = datalist[0];
    const initList = common_vendor.computed(() => {
      datalist.forEach((item) => {
        item.price = src_utils_format.formatPrice(item.price, { useThousand: true });
      });
      return [
        // 复制最后一张放在开头
        ...datalist.map((item) => ({ ...item, keyPrefix: `prev-${item.listId}` })),
        // 原始轮播图
        ...datalist.map((item) => ({ ...item, keyPrefix: `original-${item.listId}` })),
        // 复制第一张放在结尾
        ...datalist.map((item) => ({ ...item, keyPrefix: `next-${item.listId}` }))
      ];
    });
    const startAutoPlay = () => {
      autoPlayTimer = setInterval(() => {
        prevSlide();
      }, autoPlayInterval);
    };
    const prevSlide = () => {
      if (isAnimating)
        return;
      isAnimating = true;
      transitionStyle.value = "transform 0.5s ease";
      resetAutoPlay();
      currentIndex.value++;
      contentData.value = initList.value[currentIndex.value];
      if (currentIndex.value > datalist.length) {
        setTimeout(() => {
          transitionStyle.value = "none";
          currentIndex.value = 1;
          isAnimating = false;
        }, 500);
      } else {
        isAnimating = false;
      }
    };
    common_vendor.onMounted(() => {
      startAutoPlay();
    });
    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }
    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }
    function changeIndex(index) {
      stopAutoPlay();
      contentData.value = initList.value[index - 1];
      startAutoPlay();
    }
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
        c: contentData.value.src,
        d: common_vendor.f(initList.value, (item, index, i0) => {
          return {
            a: item.src,
            b: common_vendor.t(item.title),
            c: common_vendor.o(($event) => changeIndex(item.listId), item.keyPrefix),
            d: item.keyPrefix
          };
        }),
        e: translateY.value,
        f: transitionStyle.value,
        g: common_vendor.t(contentData.value.title),
        h: common_vendor.t(contentData.value.price)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a8118bef"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/chlid-swiper.js.map
