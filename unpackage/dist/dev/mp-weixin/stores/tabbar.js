"use strict";
const common_vendor = require("../common/vendor.js");
const tabList = common_vendor.ref([
  {
    pagePath: "/pages/index/index",
    text: "首页",
    iconPath: "/static/tabbar/aigei.png",
    selectedIconPath: "/static/tabbar/aigei.png"
  },
  {
    pagePath: "/pages/Mall/Mall",
    text: "商城",
    iconPath: "/static/tabbar/mall.png",
    selectedIconPath: "/static/tabbar/mall.png"
  },
  {
    pagePath: "/pages/Warehouse/Warehouse",
    text: "仓库",
    iconPath: "/static/tabbar/warehouse.png",
    selectedIconPath: "/static/tabbar/warehouse.png"
  },
  {
    pagePath: "/pages/Profile/Profile",
    text: "我的",
    iconPath: "/static/tabbar/mine.png",
    selectedIconPath: "/static/tabbar/mine.png"
  }
]);
const useTabbarStore = common_vendor.defineStore("tabbar", () => {
  const switchLock = common_vendor.ref(false);
  const activeIndex = common_vendor.ref(0);
  activeIndex.value = common_vendor.index.getStorageSync("TABBAR_INDEX");
  function setActiveIndex(index) {
    activeIndex.value = index;
    common_vendor.index.setStorageSync("TABBAR_INDEX", index);
  }
  return {
    switchLock,
    activeIndex,
    tabList,
    setActiveIndex
  };
});
common_vendor.defineStore("CarList", () => {
  const cardList = common_vendor.ref([]);
  function setCardList(list) {
    cardList.value = list;
  }
  return {
    cardList,
    setCardList
  };
});
exports.useTabbarStore = useTabbarStore;
//# sourceMappingURL=../../.sourcemap/mp-weixin/stores/tabbar.js.map
