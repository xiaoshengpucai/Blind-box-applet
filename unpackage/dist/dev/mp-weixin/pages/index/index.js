"use strict";
const common_vendor = require("../../common/vendor.js");
const stores_tabbar = require("../../stores/tabbar.js");
if (!Math) {
  (Home + Mall + Warehouse + Profile + common_vendor.unref(CustomTabBar))();
}
const Home = () => "../Home/index2.js";
const Mall = () => "../Mall/index2.js";
const Profile = () => "../Profile/index2.js";
const Warehouse = () => "../Warehouse/index2.js";
const CustomTabBar = () => "../../components/custom-tab-bar.js";
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const StoreTabbar = stores_tabbar.useTabbarStore();
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(StoreTabbar).activeIndex === 0,
        b: common_vendor.unref(StoreTabbar).activeIndex === 1,
        c: common_vendor.unref(StoreTabbar).activeIndex === 2,
        d: common_vendor.unref(StoreTabbar).activeIndex === 3
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
