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
    common_vendor.index.__f__("log", "at pages/Home/componets/chlid-swiper.vue:78", "datalist-chlid-swiper", datalist);
    let autoPlayTimer = null;
    const currentIndex = common_vendor.ref(0);
    const transitionStyle = common_vendor.ref("transform 0.5s ease");
    const translateY = common_vendor.computed(() => {
      return `translateY(-${currentIndex.value * 100}%)`;
    });
    const contentData = common_vendor.ref({});
    common_vendor.watchEffect(() => {
      if (props.datalist && props.datalist.length > 0) {
        contentData.value = props.datalist[0];
      }
    });
    common_vendor.index.__f__("log", "at pages/Home/componets/chlid-swiper.vue:91", "-----------contentData", contentData.value);
    const initList = common_vendor.computed(() => {
      if (!props.datalist || props.datalist.length === 0) {
        return [];
      }
      return [
        // 复制最后一张放在开头
        ...props.datalist.map((item) => ({
          ...item,
          keyPrefix: `prev-${item.id}`
        })),
        // 原始轮播图
        ...props.datalist.map((item) => ({
          ...item,
          keyPrefix: `original-${item.id}`
        })),
        // 复制第一张放在结尾
        ...props.datalist.map((item) => ({
          ...item,
          keyPrefix: `next-${item.id}`
        }))
      ];
    });
    common_vendor.index.__f__("log", "at pages/Home/componets/chlid-swiper.vue:115", "initList", initList.value);
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
      if (currentIndex.value >= initList.value.length) {
        currentIndex.value = props.datalist.length;
      }
      contentData.value = initList.value[currentIndex.value];
      if (currentIndex.value > props.datalist.length * 2 - 1) {
        setTimeout(() => {
          transitionStyle.value = "none";
          currentIndex.value = props.datalist.length;
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
      contentData.value = initList.value.find((item) => item.id === index && item.keyPrefix.startsWith(
        "original-"
      ));
      common_vendor.index.__f__("log", "at pages/Home/componets/chlid-swiper.vue:167", "contentData", contentData.value);
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
        c: contentData.value.image_url,
        d: common_vendor.f(initList.value, (item, index, i0) => {
          return {
            a: item.image_url,
            b: common_vendor.t(item.title),
            c: common_vendor.o(($event) => changeIndex(item.id), item.keyPrefix),
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
