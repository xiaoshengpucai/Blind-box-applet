"use strict";
const common_vendor = require("./common/vendor.js");
if (!Array) {
  const _easycom_up_popup2 = common_vendor.resolveComponent("up-popup");
  _easycom_up_popup2();
}
const _easycom_up_popup = () => "./node-modules/uview-plus/components/u-popup/u-popup.js";
if (!Math) {
  _easycom_up_popup();
}
const _sfc_main = {
  __name: "preview",
  props: {
    datalist: {
      type: Array,
      default: () => []
    },
    levelList: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    const props = __props;
    const {
      datalist,
      levelList
    } = props;
    const tabChangeIndex = common_vendor.ref(1);
    const handleTabClick = (index) => {
      if (tabChangeIndex.value === index)
        return;
      tabChangeIndex.value = index;
    };
    const tabInfo = common_vendor.ref([]);
    const tabChangeLeft = common_vendor.computed(() => {
      var _a;
      return ((_a = tabInfo.value[tabChangeIndex.value]) == null ? void 0 : _a.left) + 3;
    });
    let changeTag = common_vendor.ref("超神");
    const sortOrder = {
      "超神": 1,
      "传说": 2,
      "普通": 3
    };
    const tagColors = {
      "超神": "#53F1E3",
      "传说": "#B3F5C0",
      "普通": "#CAA8E5"
    };
    const tagList = common_vendor.computed(() => {
      const result = {};
      datalist.forEach((item) => {
        const {
          level,
          chance
        } = item;
        if (!result[level]) {
          result[level] = [];
        }
        result[level] = {
          Total: result[level].Total ? result[level].Total + 1 : 1,
          chance: result[level].chance ? result[level].chance + chance : chance
        };
      });
      return result;
    });
    const tagLabel = common_vendor.computed(() => {
      const entries = Object.entries(tagList.value).map(([key, value]) => ({
        tag: key,
        ...value
      })).sort((a, b) => sortOrder[a.tag] - sortOrder[b.tag]);
      return entries;
    });
    common_vendor.watch(tagLabel, (newVal) => {
      if (newVal.length > 0) {
        changeTag.value = newVal[0].tag;
      }
    }, {
      immediate: true
    });
    function hexToRgba(hex, opacity) {
      hex = hex.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${opacity})`;
    }
    const getTagColor = (tag) => {
      return {
        Color: hexToRgba(tagColors[tag], 1) || "#ccc",
        bgColor: `linear-gradient(to bottom, ${hexToRgba(tagColors[tag], 0.5)} 0%, #fff 25%)`,
        recolor: `${hexToRgba(tagColors[tag], 0.2)}`
      };
    };
    const currentTagIndex = common_vendor.ref(0);
    function handleClickTag(tag) {
      if (tag === changeTag.value)
        return;
      changeTag.value = tag;
    }
    function tagLeft() {
      currentTagIndex.value = currentTagIndex.value === 0 ? tagLabel.value.length - 1 : currentTagIndex.value - 1;
      changeTag.value = tagLabel.value[currentTagIndex.value].tag;
    }
    function tagRight() {
      currentTagIndex.value = currentTagIndex.value === tagLabel.value.length - 1 ? 0 : currentTagIndex.value + 1;
      changeTag.value = tagLabel.value[currentTagIndex.value].tag;
    }
    const filteredList = common_vendor.computed(() => {
      return datalist.filter((item) => item.level === changeTag.value);
    });
    const instance = common_vendor.getCurrentInstance();
    let previewRect = common_vendor.reactive([]);
    const preSetPositon = common_vendor.ref(false);
    const recordIndex = common_vendor.ref(0);
    const recordChangeRect = common_vendor.ref([]);
    const recordChangeLeft = common_vendor.computed(() => {
      if (!recordChangeRect.value[recordIndex.value])
        return;
      const left = recordChangeRect.value[recordIndex.value].left;
      const width = recordChangeRect.value[recordIndex.value].width;
      let result = left + width / 2 - 10;
      return result;
    });
    const recordTragetTag = common_vendor.ref("超神");
    const changRecordIndex = (index, target) => {
      if (recordIndex.value === index)
        return;
      recordIndex.value = index;
      recordTragetTag.value = target;
    };
    const recordDetailList = common_vendor.computed(() => {
      let result = recordTestList.filter((item) => item.level === recordTragetTag.value);
      return result;
    });
    common_vendor.onMounted(async () => {
      await common_vendor.nextTick$1();
      const instanceRef = common_vendor.ref(instance == null ? void 0 : instance.proxy);
      if (!instanceRef.value)
        return;
      common_vendor.index.createSelectorQuery().in(instanceRef.value).select(".tab-box").boundingClientRect((data) => {
        previewRect = data;
        srollPreviewPostion(previewRect);
      }).exec();
      common_vendor.index.createSelectorQuery().in(instanceRef.value).selectAll(".tab-item").boundingClientRect((data) => {
        tabInfo.value = [...data];
      }).exec();
      common_vendor.index.createSelectorQuery().in(instanceRef.value).selectAll(".record-item").boundingClientRect((data) => {
        recordChangeRect.value = [...data];
      }).exec();
    });
    const srollPreviewPostion = (previewRect2) => {
      return previewRect2.top;
    };
    common_vendor.onPageScroll((e) => {
      const previewTop = srollPreviewPostion(previewRect);
      if (e.scrollTop <= previewTop) {
        preSetPositon.value = false;
      } else {
        preSetPositon.value = true;
      }
    });
    const show = common_vendor.ref(false);
    const showData = common_vendor.ref(null);
    const showPopup = (id) => {
      filteredList.value.forEach((item) => {
        if (item.listId === id) {
          show.value = true;
          showData.value = item;
        }
      });
    };
    const closePopup = () => {
      show.value = false;
    };
    const recordTestList = common_vendor.reactive([
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "全景运动相机",
        level: "超神",
        count: 12,
        oldCount: 54,
        time: "2023-11-11 12:12:12",
        smallPicurl: "https://img2.baidu.com/it/u=1455518479,3144936783&fm=253&fmt=auto&app=120&f=PNG?w=500&h=1065"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "富士拍拍",
        level: "超神",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img2.baidu.com/it/u=3360815703,3321978180&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1111"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "UNiQUE ART雕像",
        level: "传说",
        count: 12,
        oldCount: 44,
        time: "2023-12-11 12:12:12",
        smallPicurl: "https://img0.baidu.com/it/u=3700946987,2207883969&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1114"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "少女乐队的呐喊",
        level: "传说",
        count: 122,
        oldCount: 46,
        time: "2023-12-12 02:01:12",
        smallPicurl: "https://img1.baidu.com/it/u=894955063,4138614589&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1083"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "阴阳师",
        level: "传说",
        count: 172,
        oldCount: 114,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img0.baidu.com/it/u=3318815481,675612407&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "胜利女生",
        level: "传说",
        count: 102,
        oldCount: 54,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img1.baidu.com/it/u=1297405382,3279217087&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1426"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "崩坏：星穹铁道",
        level: "传说",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img2.baidu.com/it/u=3969315328,3300096298&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1091"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "FuFu大家庭",
        level: "传说",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img0.baidu.com/it/u=1965100551,3593283040&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1081"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "赛博朋克",
        level: "普通",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img2.baidu.com/it/u=3570987437,1081851385&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1083"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "流星花园",
        level: "普通",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img2.baidu.com/it/u=3896495679,3732936033&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "诡秘之主",
        level: "普通",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img0.baidu.com/it/u=1974539446,523763973&fm=253&fmt=auto?w=800&h=1745"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "三丽鸥公仔系列",
        level: "普通",
        smallPicurl: "https://img1.baidu.com/it/u=1299369810,3742035215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1082"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "三丽鸥公仔系列",
        level: "超神",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img1.baidu.com/it/u=1299369810,3742035215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1082"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "全景运动相机",
        level: "超神",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img2.baidu.com/it/u=1455518479,3144936783&fm=253&fmt=auto&app=120&f=PNG?w=500&h=1065"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "富士拍拍",
        level: "超神",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img2.baidu.com/it/u=3360815703,3321978180&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1111"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "UNiQUE ART雕像",
        level: "传说",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img0.baidu.com/it/u=3700946987,2207883969&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1114"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "少女乐队的呐喊",
        level: "传说",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img1.baidu.com/it/u=894955063,4138614589&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1083"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "阴阳师",
        level: "传说",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img0.baidu.com/it/u=3318815481,675612407&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "胜利女生",
        level: "传说",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img1.baidu.com/it/u=1297405382,3279217087&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1426"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "崩坏：星穹铁道",
        level: "传说",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img2.baidu.com/it/u=3969315328,3300096298&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1091"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "FuFu大家庭",
        level: "传说",
        count: 122,
        oldCount: 14,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img0.baidu.com/it/u=1965100551,3593283040&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1081"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "赛博朋克",
        level: "普通",
        count: 66,
        oldCount: 21,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img2.baidu.com/it/u=3570987437,1081851385&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1083"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "流星花园",
        level: "普通",
        count: 22,
        oldCount: 64,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img2.baidu.com/it/u=3896495679,3732936033&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "诡秘之主",
        level: "普通",
        count: 9,
        oldCount: 54,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img0.baidu.com/it/u=1974539446,523763973&fm=253&fmt=auto?w=800&h=1745"
      },
      {
        id: (/* @__PURE__ */ new Date()).getTime() + Math.floor(Math.random() * 1e3),
        Title: "三丽鸥公仔系列",
        level: "普通",
        count: 22,
        oldCount: 94,
        time: "2023-12-11 12:01:12",
        smallPicurl: "https://img1.baidu.com/it/u=1299369810,3742035215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1082"
      }
    ]);
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(($event) => handleTabClick(0)),
        b: common_vendor.o(($event) => handleTabClick(1)),
        c: tabChangeLeft.value + "px",
        d: tabChangeIndex.value === 0
      }, tabChangeIndex.value === 0 ? {
        e: common_vendor.o(($event) => tagLeft()),
        f: common_vendor.f(tagLabel.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.tag),
            b: common_vendor.t(item.chance),
            c: common_vendor.unref(changeTag) === item.tag ? 1 : "",
            d: getTagColor(item.tag).Color,
            e: index,
            f: common_vendor.o(($event) => handleClickTag(item.tag), index)
          };
        }),
        g: common_vendor.o(($event) => tagRight())
      } : {}, {
        h: tabChangeIndex.value === 1
      }, tabChangeIndex.value === 1 ? {
        i: common_vendor.f(tagLabel.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.tag),
            b: index,
            c: common_vendor.o(($event) => changRecordIndex(index, item.tag), index)
          };
        }),
        j: recordChangeLeft.value + "px"
      } : {}, {
        k: common_vendor.n(preSetPositon.value ? "tab-position" : ""),
        l: tabChangeIndex.value === 0
      }, tabChangeIndex.value === 0 ? {
        m: common_vendor.f(filteredList.value, (item, index, i0) => {
          return {
            a: item.src,
            b: common_vendor.t(item.price),
            c: common_vendor.t(item.title),
            d: getTagColor(item.level).bgColor,
            e: item.listId,
            f: getTagColor(item.level).Color,
            g: common_vendor.o(($event) => showPopup(item.listId), item.listId)
          };
        }),
        n: common_vendor.s(preSetPositon.value ? {
          "marginTop": "150px"
        } : "")
      } : {}, {
        o: tabChangeIndex.value === 1
      }, tabChangeIndex.value === 1 ? {
        p: common_vendor.f(recordDetailList.value, (item, index, i0) => {
          return {
            a: item.smallPicurl,
            b: index,
            c: getTagColor(item.level).Color,
            d: getTagColor(item.level).recolor
          };
        })
      } : {}, {
        q: showData.value
      }, showData.value ? {
        r: showData.value.src,
        s: getTagColor(showData.value.level).Color,
        t: common_vendor.t(showData.value.title),
        v: common_vendor.t(showData.value.chance),
        w: common_vendor.t(showData.value.price)
      } : {}, {
        x: common_vendor.o(showPopup),
        y: common_vendor.o(closePopup),
        z: common_vendor.p({
          show: show.value,
          round: 10,
          mode: "center"
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-45a02a3d"]]);
_sfc_main.__runtimeHooks = 1;
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/preview.js.map
