"use strict";
const common_vendor = require("../../common/vendor.js");
const src_api_layoutList = require("../../src/api/layout-list.js");
if (!Array) {
  const _easycom_up_icon2 = common_vendor.resolveComponent("up-icon");
  _easycom_up_icon2();
}
const _easycom_up_icon = () => "../../node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (_easycom_up_icon + common_vendor.unref(StatusBar) + chlidSwiperVue + previewVue)();
}
const StatusBar = () => "../../components/status-bar.js";
const chlidSwiperVue = () => "./componets/chlid-swiper2.js";
const previewVue = () => "./componets/preview2.js";
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const statusBarHeight = common_vendor.ref(0);
    common_vendor.ref(0);
    const isAnimating = common_vendor.ref(false);
    const autoPlay = common_vendor.ref(true);
    const autoPlayInterval = common_vendor.ref(3e3);
    const datalist = common_vendor.ref([]);
    const levelList = [
      {
        grade: "超神",
        probability: 1,
        sort: 1
      },
      {
        grade: "传说",
        probability: 4,
        sort: 2
      },
      {
        grade: "普通",
        probability: 95,
        sort: 3
      }
    ];
    const calssid = common_vendor.ref(0);
    const category = common_vendor.ref("");
    const instanceRef = common_vendor.ref(null);
    const tabClassShow = common_vendor.ref(false);
    const handleScroll = (data) => {
      if (!data)
        return;
      tabClassShow.value = data;
      common_vendor.index.__f__("log", "at pages/Home/detail.vue:90", tabClassShow.value, data, "-----data-----");
    };
    handleScroll();
    common_vendor.onReady(async () => {
      var _a;
      common_vendor.index.__f__("log", "at pages/Home/detail.vue:95", "页面初次渲染完成时触发");
      instanceRef.value = (_a = common_vendor.getCurrentInstance()) == null ? void 0 : _a.proxy;
      common_vendor.index.createSelectorQuery().in(instanceRef.value);
    });
    common_vendor.onLoad(async (option) => {
      calssid.value = option.id;
      category.value = option.category;
      try {
        const result = await src_api_layoutList.getInfinteLListDetail({ category: category.value });
        datalist.value = result;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Home/detail.vue:106", "加载数据失败:", error);
      }
    });
    common_vendor.onMounted(async () => {
    });
    const raffleList = [
      {
        id: 1,
        multiple: 1,
        title: "买一张",
        price: "10"
      },
      {
        id: 2,
        multiple: 3,
        title: "买三张",
        price: "30"
      },
      {
        id: 3,
        multiple: 10,
        title: "买十张",
        price: "100"
      }
    ];
    common_vendor.onShow(() => {
      common_vendor.index.__f__("log", "at pages/Home/detail.vue:139", "页面显示时触发");
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/Home/detail.vue:143", "页面隐藏时触发");
    });
    common_vendor.onUnload(() => {
      common_vendor.index.__f__("log", "at pages/Home/detail.vue:146", "页面销毁");
    });
    const back = () => {
      let pages = getCurrentPages();
      let beforePage = pages[pages.length - 2];
      if (!beforePage) {
        common_vendor.index.switchTab({
          url: "/pages/index/index"
        });
      }
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.p({
          name: "arrow-left",
          size: "15",
          bold: true
        }),
        b: common_vendor.o(back),
        c: common_vendor.p({
          datalist: datalist.value,
          isAnimating: isAnimating.value,
          autoPlay: autoPlay.value,
          autoPlayInterval: autoPlayInterval.value
        }),
        d: common_vendor.p({
          datalist: datalist.value,
          ["level-list"]: levelList
        }),
        e: common_vendor.n(tabClassShow.value ? "tab-position" : ""),
        f: statusBarHeight.value + "px",
        g: common_vendor.f(raffleList, (item, index, i0) => {
          return {
            a: common_vendor.t(item.price),
            b: common_vendor.t(item.price),
            c: item.id
          };
        }),
        h: common_vendor.gei(_ctx, "")
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a42b862d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/Home/detail.js.map
