"use strict";
const common_vendor = require("../common/vendor.js");
const stores_tabbar = require("../stores/tabbar.js");
const _sfc_main = {
  __name: "custom-tab-bar",
  setup(__props) {
    common_vendor.ref([]);
    const instanceRef = common_vendor.ref(null);
    const lineLeft = common_vendor.ref(0);
    const lineTop = common_vendor.ref(0);
    const Store = stores_tabbar.useTabbarStore();
    const safeAreaStyle = {
      paddingBottom: "env(safe-area-inset-bottom)"
    };
    const switchTab = (path, index) => {
      if (Store.activeIndex === index)
        return;
      if (Store.switchLock)
        return;
      Store.switchLock = true;
      setTimeout(() => {
        Store.switchLock = false;
      }, 300);
      Store.setActiveIndex(index);
      common_vendor.nextTick$1(() => {
        getIconPosition();
      });
    };
    common_vendor.onMounted(() => {
      var _a;
      instanceRef.value = (_a = common_vendor.getCurrentInstance()) == null ? void 0 : _a.proxy;
      setTimeout(() => {
        getIconPosition();
      }, 300);
    });
    const getIconPosition = () => {
      if (!instanceRef.value) {
        common_vendor.index.__f__("warn", "at components/custom-tab-bar.vue:66", "Component instance not ready");
        return;
      }
      const query = common_vendor.index.createSelectorQuery().in(instanceRef.value);
      query.select(`.tabbar-item`).boundingClientRect((rect) => {
        if (!rect) {
          return;
        }
        lineLeft.value = rect.right * Store.activeIndex + rect.width / 2;
        lineTop.value = rect.height / 2;
      }).exec();
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(common_vendor.unref(Store).tabList, (item, index, i0) => {
          return {
            a: item.iconPath,
            b: common_vendor.t(item.text),
            c: index,
            d: common_vendor.o(($event) => switchTab(item.pagePath, index), index),
            e: common_vendor.unref(Store).activeIndex === index ? 1 : ""
          };
        }),
        b: common_vendor.s(`left: ${lineLeft.value}px; top: ${lineTop.value}px`),
        c: common_vendor.s(safeAreaStyle),
        d: common_vendor.o(() => {
        }),
        e: common_vendor.gei(_ctx, "")
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8fac706f"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/custom-tab-bar.js.map
