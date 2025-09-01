"use strict";
const common_vendor = require("./common/vendor.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const originalImages = [
      { url: "https://img1.baidu.com/it/u=4250025404,3394384390&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1082" },
      { url: "https://img2.baidu.com/it/u=33930452,3866960736&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=722" },
      { url: "https://img2.baidu.com/it/u=481074814,730334518&fm=253&fmt=auto&app=120&f=PNG?w=500&h=656" }
    ];
    const swiperList = common_vendor.ref([
      originalImages[originalImages.length - 1],
      // 最后一张的复制放在前面
      ...originalImages,
      // 原始图片
      originalImages[0]
      // 第一张的复制放在后面
    ]);
    const currentIndex = common_vendor.ref(1);
    const transitionStyle = common_vendor.ref("transform 0.5s ease-out");
    const totalSlides = swiperList.value.length;
    const realImageCount = originalImages.length;
    const handleTransitionEnd = () => {
      if (currentIndex.value === totalSlides - 1) {
        transitionStyle.value = "none";
        currentIndex.value = 1;
        setTimeout(() => {
          transitionStyle.value = "transform 0.5s ease-out";
        }, 0);
      } else if (currentIndex.value === 0) {
        transitionStyle.value = "none";
        currentIndex.value = realImageCount;
        setTimeout(() => {
          transitionStyle.value = "transform 0.5s ease-out";
        }, 0);
      }
      setTimeout(() => {
        currentIndex.value++;
      }, 2e3);
    };
    setTimeout(() => {
      currentIndex.value++;
    }, 2e3);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(swiperList.value, (item, index, i0) => {
          return {
            a: item.url,
            b: index
          };
        }),
        b: `translateX(${-currentIndex.value * 100}%)`,
        c: transitionStyle.value,
        d: common_vendor.o(handleTransitionEnd),
        e: common_vendor.gei(_ctx, "")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-9849a389"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/index2.js.map
