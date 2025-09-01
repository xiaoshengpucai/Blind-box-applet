"use strict";
const common_vendor = require("../../common/vendor.js");
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
    const datalist = [
      {
        listId: 1,
        title: "少女乐队的呐喊",
        price: "1100",
        level: "传说",
        chance: 0.5,
        src: "https://q0.itc.cn/q_70/images03/20240819/15e51341a9364d7b8c9f631b458fb8b5.jpeg"
      },
      {
        listId: 2,
        title: "炽焰x笙歌 原神 女仆浴室共鸣系列 雷电将军",
        price: "2599",
        level: "超神",
        chance: 0.5,
        src: "https://img1.baidu.com/it/u=3937103606,3676897764&fm=253&fmt=auto&app=120&f=JPEG?w=502&h=500"
      },
      {
        listId: 3,
        title: "原神 可莉·火花骑士Ver.1/7静态手办",
        price: "2599",
        level: "传说",
        chance: 1,
        src: "https://img1.baidu.com/it/u=1636141268,890026111&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
      },
      {
        listId: 4,
        title: "集美殿堂 进击的巨人 艾伦耶格尔vs女巨人",
        price: "7158",
        level: "传说",
        chance: 1,
        src: "https://img2.baidu.com/it/u=1357007271,1071071103&fm=253&fmt=auto&app=120&f=JPEG?w=503&h=500"
      },
      {
        listId: 5,
        title: "coolbear studio三周年 尼尔机械纪元2B 豪华版",
        price: "4680",
        level: "传说",
        chance: 2,
        src: "https://img0.baidu.com/it/u=478380046,1227329794&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"
      },
      {
        listId: 6,
        title: "魔法少女贴纸",
        price: "10",
        level: "普通",
        chance: 25,
        src: "https://img2.baidu.com/it/u=188958811,1450173967&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
      },
      {
        listId: 7,
        title: "原神贴纸",
        price: "5",
        level: "普通",
        chance: 70,
        src: "https://img0.baidu.com/it/u=2809378840,1099363868&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
      }
    ];
    const levelList = [
      {
        level: "超神",
        chance: 1,
        sort: 1
      },
      {
        level: "传说",
        chance: 4,
        sort: 2
      },
      {
        level: "普通",
        chance: 95,
        sort: 3
      }
    ];
    const calssid = common_vendor.ref(0);
    const instanceRef = common_vendor.ref(null);
    const tabClassShow = common_vendor.ref(false);
    const handleScroll = (data) => {
      if (!data)
        return;
      tabClassShow.value = data;
      common_vendor.index.__f__("log", "at pages/Home/detail.vue:143", tabClassShow.value, data, "-----data-----");
    };
    handleScroll();
    common_vendor.onReady(() => {
      var _a;
      common_vendor.index.__f__("log", "at pages/Home/detail.vue:148", "页面初次渲染完成时触发");
      instanceRef.value = (_a = common_vendor.getCurrentInstance()) == null ? void 0 : _a.proxy;
      common_vendor.index.createSelectorQuery().in(instanceRef.value);
    });
    common_vendor.onLoad((option) => {
      common_vendor.index.__f__("log", "at pages/Home/detail.vue:153", option, "option");
      calssid.value = option.id;
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
      common_vendor.index.__f__("log", "at pages/Home/detail.vue:186", "页面显示时触发");
    });
    common_vendor.onHide(() => {
      common_vendor.index.__f__("log", "at pages/Home/detail.vue:190", "页面隐藏时触发");
    });
    common_vendor.onUnload(() => {
      common_vendor.index.__f__("log", "at pages/Home/detail.vue:193", "页面销毁");
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
          datalist,
          isAnimating: isAnimating.value,
          autoPlay: autoPlay.value,
          autoPlayInterval: autoPlayInterval.value
        }),
        d: common_vendor.p({
          datalist,
          ["level-list"]: levelList
        }),
        e: common_vendor.n(tabClassShow.value ? "tab-position" : ""),
        f: statusBarHeight.value + "px",
        g: common_vendor.f(raffleList, (item, index, i0) => {
          return {
            a: common_vendor.t(item.title),
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
