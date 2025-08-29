"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "status-bar",
  emits: ["statusBarHeight"],
  setup(__props, { emit: __emit }) {
    const systemInfo = common_vendor.index.getWindowInfo();
    let statusBarHeight = systemInfo.statusBarHeight + 22;
    let navBarHeight = statusBarHeight + 22;
    let navBarRight = systemInfo.windowWidth - 330;
    const menuButtonInfo = common_vendor.index.getMenuButtonBoundingClientRect();
    statusBarHeight = systemInfo.statusBarHeight;
    navBarRight = systemInfo.windowWidth - menuButtonInfo.right + menuButtonInfo.width;
    navBarHeight = menuButtonInfo.bottom - statusBarHeight + 4;
    const emit = __emit;
    emit("statusBarHeight", statusBarHeight + navBarHeight);
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(statusBarHeight) + "px",
        b: common_vendor.unref(navBarRight) + "px",
        c: common_vendor.unref(navBarHeight) + "px",
        d: common_vendor.gei(_ctx, "")
      };
    };
  }
};
wx.createComponent(_sfc_main);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/status-bar.js.map
