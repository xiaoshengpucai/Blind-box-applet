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
    const tabChangeIndex = common_vendor.ref(0);
    const handleTabClick = (index) => {
      if (tabChangeIndex.value === index)
        return;
      tabChangeIndex.value = index;
    };
    common_vendor.index.__f__("log", "at pages/Home/componets/preview.vue:122", "datalist-------------------datalist", datalist);
    const tabInfo = common_vendor.ref([]);
    const tabChangeLeft = common_vendor.computed(() => {
      var _a;
      return ((_a = tabInfo.value[tabChangeIndex.value]) == null ? void 0 : _a.left) + 3;
    });
    let changeGrade = common_vendor.ref("超神");
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
    const gradeList = common_vendor.computed(() => {
      const result = {};
      props.datalist.forEach((item) => {
        common_vendor.index.__f__("log", "at pages/Home/componets/preview.vue:144", "item-------------------item", item);
        const {
          grade,
          probability
        } = item;
        if (!result[grade]) {
          result[grade] = [];
        }
        result[grade] = {
          Total: result[grade].Total ? result[grade].Total + 1 : 1,
          probability: result[grade].probability ? result[grade].probability + probability : probability
        };
      });
      return result;
    });
    common_vendor.index.__f__("log", "at pages/Home/componets/preview.vue:161", "gradeList-------------------gradeList1", gradeList.value);
    const tagLabel = common_vendor.computed(() => {
      const entries = Object.entries(gradeList.value).map(([key, val]) => {
        return {
          grade: key,
          ...val
        };
      }).sort((a, b) => sortOrder[a.grade] - sortOrder[b.grade]);
      return entries;
    });
    common_vendor.watch(tagLabel, (newVal) => {
      if (newVal.length > 0) {
        changeGrade.value = newVal[0].grade;
      }
    }, {
      immediate: true
    });
    function hexToRgba(hex, opacity) {
      if (!hex) {
        hex = "#CCCCCC";
      }
      hex = hex.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${opacity})`;
    }
    const getTagColor = (grade) => {
      const color = tagColors[grade] || "#CCCCCC";
      return {
        Color: hexToRgba(color, 1),
        bgColor: `linear-gradient(to bottom, ${hexToRgba(color, 0.5)} 0%, #fff 25%)`,
        recolor: `${hexToRgba(color, 0.2)}`
      };
    };
    const currentTagIndex = common_vendor.ref(0);
    function handleClickTag(grade) {
      if (grade === changeGrade.value)
        return;
      changeGrade.value = grade;
    }
    function tagLeft() {
      currentTagIndex.value = currentTagIndex.value === 0 ? tagLabel.value.length - 1 : currentTagIndex.value - 1;
      changeGrade.value = tagLabel.value[currentTagIndex.value].grade;
    }
    function tagRight() {
      currentTagIndex.value = currentTagIndex.value === tagLabel.value.length - 1 ? 0 : currentTagIndex.value + 1;
      changeGrade.value = tagLabel.value[currentTagIndex.value].grade;
    }
    const filteredList = common_vendor.computed(() => {
      return props.datalist.filter((item) => item.grade === changeGrade.value);
    });
    common_vendor.index.__f__("log", "at pages/Home/componets/preview.vue:231", "filteredList-------------------filteredList", filteredList.value);
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
      let result = props.datalist.filter((item) => item.grade === recordTragetTag.value);
      return result;
    });
    common_vendor.index.__f__("log", "at pages/Home/componets/preview.vue:255", "recordDetailList-------------------recordDetailList", recordDetailList.value);
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
      props.datalist.forEach((item) => {
        if (item.id === id) {
          show.value = true;
          showData.value = item;
        }
      });
    };
    const closePopup = () => {
      show.value = false;
    };
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
            a: common_vendor.t(item.grade),
            b: common_vendor.t(item.probability),
            c: common_vendor.unref(changeGrade) === item.grade ? 1 : "",
            d: getTagColor(item.grade).Color,
            e: index,
            f: common_vendor.o(($event) => handleClickTag(item.grade), index)
          };
        }),
        g: common_vendor.o(($event) => tagRight())
      } : {}, {
        h: tabChangeIndex.value === 1
      }, tabChangeIndex.value === 1 ? {
        i: common_vendor.f(tagLabel.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.grade),
            b: index,
            c: common_vendor.o(($event) => changRecordIndex(index, item.grade), index)
          };
        }),
        j: recordChangeLeft.value + "px"
      } : {}, {
        k: common_vendor.n(preSetPositon.value ? "tab-position" : ""),
        l: tabChangeIndex.value === 0
      }, tabChangeIndex.value === 0 ? {
        m: common_vendor.f(filteredList.value, (item, k0, i0) => {
          return {
            a: item.image_url,
            b: common_vendor.t(item.price),
            c: common_vendor.t(item.title),
            d: getTagColor(item.grade).bgColor,
            e: item.id,
            f: getTagColor(item.grade).Color,
            g: common_vendor.o(($event) => showPopup(item.id), item.id)
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
            a: item.image_url,
            b: index,
            c: getTagColor(item.grade).Color,
            d: getTagColor(item.grade).recolor
          };
        })
      } : {}, {
        q: showData.value
      }, showData.value ? {
        r: showData.value.image_url,
        s: getTagColor(showData.value.grade).Color,
        t: common_vendor.t(showData.value.title),
        v: common_vendor.t(showData.value.probability),
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
