"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "status-bar",
  emits: ["statusBarHeight"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const statusBarHeight = common_vendor.ref(0);
    const navBarHeight = common_vendor.ref(0);
    const totalHeight = common_vendor.ref(0);
    const navBarRight = common_vendor.ref(0);
    const initStatusBarHeight = () => {
      try {
        const systemInfo = common_vendor.index.getWindowInfo();
        let statusHeight = systemInfo.statusBarHeight + 22;
        let navHeight = statusHeight + 22;
        let total = statusHeight + navHeight;
        let rightPadding = systemInfo.windowWidth;
        try {
          const menuButtonInfo = common_vendor.index.getMenuButtonBoundingClientRect();
          statusHeight = systemInfo.statusBarHeight;
          navHeight = menuButtonInfo.bottom - statusHeight + 4;
          total = statusHeight + navHeight;
          rightPadding = menuButtonInfo.left - menuButtonInfo.width / 2;
        } catch (error) {
          common_vendor.index.__f__("warn", "at components/status-bar.vue:47", "获取胶囊位置失败，使用默认值:", error);
        }
        statusHeight = Math.max(statusHeight, 20);
        navHeight = Math.max(navHeight, 44);
        total = statusHeight + navHeight;
        statusBarHeight.value = statusHeight;
        navBarHeight.value = navHeight;
        totalHeight.value = total;
        navBarRight.value = rightPadding;
        emit("statusBarHeight", total);
        common_vendor.index.__f__("log", "at components/status-bar.vue:65", "状态栏高度初始化成功:", {
          statusBarHeight: statusHeight,
          navBarHeight: navHeight,
          totalHeight: total,
          navBarRight: rightPadding
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at components/status-bar.vue:72", "初始化状态栏高度失败:", error);
        statusBarHeight.value = 44;
        navBarHeight.value = 44;
        totalHeight.value = 88;
        navBarRight.value = 0;
        emit("statusBarHeight", 88);
      }
    };
    const emit = __emit;
    __expose({
      initStatusBarHeight,
      getStatusBarHeight: () => totalHeight.value,
      updateHeight: (height) => {
        if (height && height > 0) {
          totalHeight.value = height;
          emit("statusBarHeight", height);
        }
      }
    });
    common_vendor.onMounted(() => {
      setTimeout(() => {
        initStatusBarHeight();
      }, 100);
    });
    return (_ctx, _cache) => {
      return {
        a: statusBarHeight.value + "px",
        b: navBarRight.value + "rpx",
        c: navBarHeight.value + "px",
        d: common_vendor.o(() => {
        }),
        e: totalHeight.value + "px",
        f: common_vendor.gei(_ctx, "")
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6ad8bb15"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/status-bar.js.map
