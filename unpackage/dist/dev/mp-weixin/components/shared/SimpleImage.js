"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  __name: "SimpleImage",
  props: {
    // 图片地址
    src: {
      type: String,
      required: true
    },
    // 图片模式
    mode: {
      type: String,
      default: "aspectFill"
    },
    // 容器宽度
    width: {
      type: [String, Number],
      default: "100%"
    },
    // 容器高度
    height: {
      type: [String, Number],
      default: "200rpx"
    },
    // 圆角
    borderRadius: {
      type: [String, Number],
      default: "0"
    }
  },
  emits: ["load", "error"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const containerStyle = common_vendor.computed(() => {
      const width = typeof props.width === "number" ? `${props.width}rpx` : props.width;
      const height = typeof props.height === "number" ? `${props.height}rpx` : props.height;
      const borderRadius = typeof props.borderRadius === "number" ? `${props.borderRadius}rpx` : props.borderRadius;
      common_vendor.index.__f__("log", "at components/shared/SimpleImage.vue:62", "borderRadius", borderRadius);
      return {
        width,
        height,
        borderRadius,
        overflow: "hidden",
        position: "relative"
      };
    });
    const imageStyle = common_vendor.computed(() => ({
      width: "100%",
      height: "100%",
      display: "block"
    }));
    const handleLoad = (e) => {
      emit("load", e);
    };
    const handleError = (e) => {
      common_vendor.index.__f__("warn", "at components/shared/SimpleImage.vue:94", "图片加载失败:", props.src);
      emit("error", e);
    };
    return (_ctx, _cache) => {
      return {
        a: __props.src,
        b: __props.mode,
        c: common_vendor.s(imageStyle.value),
        d: common_vendor.o(handleLoad),
        e: common_vendor.o(handleError),
        f: common_vendor.s(containerStyle.value),
        g: common_vendor.gei(_ctx, "")
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a379dc4a"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/shared/SimpleImage.js.map
