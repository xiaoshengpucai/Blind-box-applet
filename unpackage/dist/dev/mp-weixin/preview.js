"use strict";
const common_vendor = require("./common/vendor.js");
const src_composables_useTagColors = require("./src/composables/useTagColors.js");
const src_composables_useGrades = require("./src/composables/useGrades.js");
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
    } = common_vendor.toRefs(props);
    const {
      getTagColor
    } = src_composables_useTagColors.useTagColors();
    const {
      tagLabel
    } = src_composables_useGrades.useGrades(datalist);
    const tabChangeIndex = common_vendor.ref(0);
    const tabInfo = common_vendor.ref([]);
    const tabChangeLeft = common_vendor.computed(() => {
      var _a;
      if (tabInfo.value.length === 0)
        return 0;
      return ((_a = tabInfo.value[tabChangeIndex.value]) == null ? void 0 : _a.left) + 3;
    });
    let changeGrade = common_vendor.ref("");
    common_vendor.watch(tagLabel, (newVal) => {
      if (newVal.length > 0) {
        changeGrade.value = newVal[0].grade;
      }
    }, {
      immediate: true
    });
    const currentTagIndex = common_vendor.ref(0);
    const tagChange = (isnext) => {
      if (isnext) {
        currentTagIndex.value = currentTagIndex.value === tagLabel.value.length - 1 ? 0 : currentTagIndex.value + 1;
      } else {
        currentTagIndex.value = currentTagIndex.value === 0 ? tagLabel.value.length - 1 : currentTagIndex.value - 1;
      }
      changeGrade.value = tagLabel.value[currentTagIndex.value].grade;
    };
    const filteredList = common_vendor.computed(() => {
      return datalist.value.filter((item) => item.grade === changeGrade.value);
    });
    const instance = common_vendor.getCurrentInstance();
    const instanceProxy = instance == null ? void 0 : instance.proxy;
    let previewRect = common_vendor.reactive([]);
    const preSetPositon = common_vendor.ref(false);
    const recordIndex = common_vendor.ref(0);
    const recordChangeRect = common_vendor.ref([]);
    const recordChangeLeft = common_vendor.computed(() => {
      if (!recordChangeRect.value[recordIndex.value])
        return 0;
      const left = recordChangeRect.value[recordIndex.value].left;
      const width = recordChangeRect.value[recordIndex.value].width;
      let result = left + width / 2 - 10;
      return result;
    });
    const recordTragetTag = common_vendor.ref("");
    const changRecordIndex = (index, target) => {
      if (recordIndex.value === index)
        return;
      recordIndex.value = index;
      recordTragetTag.value = target;
    };
    const recordDetailList = common_vendor.ref([]);
    const generateMockRecords = (items) => {
      if (!items || items.length === 0)
        return [];
      return items.map((item, index) => ({
        item: {
          title: item.title,
          image_url: item.image_url
        },
        timestamp: `2025-09-12 15:${20 + index}:${10 + index}`,
        drawCount: Math.floor(Math.random() * 90) + 10,
        extraInfo: index === 0 ? "距本次中赏已过5发" : ""
      }));
    };
    common_vendor.watch(tabChangeIndex, (newIndex) => {
      if (newIndex === 1) {
        const items = datalist.value.filter((item) => {
          var _a;
          return item.grade === ((_a = tagLabel.value[recordIndex.value]) == null ? void 0 : _a.grade);
        });
        recordDetailList.value = generateMockRecords(items);
      }
      if (newIndex === 1 && recordChangeRect.value.length === 0) {
        common_vendor.nextTick$1(() => {
          if (instanceProxy) {
            common_vendor.index.createSelectorQuery().in(instanceProxy).selectAll(".record-item").boundingClientRect((data) => {
              if (data && data.length > 0) {
                recordChangeRect.value = [...data];
              }
            }).exec();
          }
        });
      }
    });
    const recordliststyle = common_vendor.computed(() => {
      var _a;
      let tag = (_a = tagLabel.value[recordIndex.value]) == null ? void 0 : _a.grade;
      return {
        border: `5rpx solid ${src_composables_useTagColors.useTagColors().getTagColor(tag).Color}`,
        backgroundColor: src_composables_useTagColors.useTagColors().getTagColor(tag).recolor
      };
    });
    common_vendor.watch(recordTragetTag, (newTag) => {
      const items = datalist.value.filter((item) => item.grade === newTag);
      recordDetailList.value = generateMockRecords(items);
    });
    common_vendor.onMounted(() => {
      if (!instanceProxy)
        return;
      common_vendor.index.createSelectorQuery().in(instanceProxy).select(".tab-box").boundingClientRect((data) => {
        previewRect = data;
      }).exec();
      common_vendor.index.createSelectorQuery().in(instanceProxy).selectAll(".tab-item").boundingClientRect((data) => {
        tabInfo.value = [...data];
      }).exec();
    });
    common_vendor.onPageScroll((e) => {
      if (!previewRect || previewRect.top === void 0)
        return;
      common_vendor.index.__f__("log", "at pages/Home/componets/preview.vue:271", "e.scrollTop-------------------e.scrollTop", e.scrollTop, previewRect.top);
      preSetPositon.value = e.scrollTop > previewRect.top;
    });
    const show = common_vendor.ref(false);
    const showData = common_vendor.ref(null);
    const showPopup = (id) => {
      const item = datalist.value.find((item2) => item2.id === id);
      if (item) {
        show.value = true;
        showData.value = item;
      }
    };
    const closePopup = () => {
      show.value = false;
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(() => tabChangeIndex.value = 0),
        b: common_vendor.o(() => tabChangeIndex.value = 1),
        c: tabChangeLeft.value + "px",
        d: tabChangeIndex.value === 0
      }, tabChangeIndex.value === 0 ? {
        e: common_vendor.o(($event) => tagChange(false)),
        f: common_vendor.f(common_vendor.unref(tagLabel), (item, index, i0) => {
          return {
            a: common_vendor.t(item.grade),
            b: common_vendor.t(item.probability),
            c: common_vendor.unref(changeGrade) === item.grade ? 1 : "",
            d: common_vendor.unref(getTagColor)(item.grade).Color,
            e: index,
            f: common_vendor.o(() => tagChange(index, item.grade), index)
          };
        }),
        g: common_vendor.o(($event) => tagChange(true))
      } : {}, {
        h: tabChangeIndex.value === 1
      }, tabChangeIndex.value === 1 ? {
        i: common_vendor.f(common_vendor.unref(tagLabel), (item, index, i0) => {
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
            d: common_vendor.unref(getTagColor)(item.grade).bgColor,
            e: item.id,
            f: common_vendor.unref(getTagColor)(item.grade).Color,
            g: common_vendor.o(($event) => showPopup(item.id), item.id)
          };
        })
      } : {}, {
        n: tabChangeIndex.value === 1
      }, tabChangeIndex.value === 1 ? {
        o: common_vendor.f(recordDetailList.value, (record, index, i0) => {
          return {
            a: record.item.image_url,
            b: common_vendor.t(record.item.title),
            c: common_vendor.t(record.drawCount),
            d: common_vendor.t(record.extraInfo),
            e: common_vendor.t(record.timestamp),
            f: index
          };
        }),
        p: common_vendor.s(recordliststyle.value),
        q: common_vendor.s(preSetPositon.value ? {
          marginTop: "100px"
        } : "")
      } : {}, {
        r: showData.value
      }, showData.value ? {
        s: showData.value.image_url,
        t: common_vendor.unref(getTagColor)(showData.value.grade).Color,
        v: common_vendor.t(showData.value.title),
        w: common_vendor.t(showData.value.probability),
        x: common_vendor.t(showData.value.price)
      } : {}, {
        y: common_vendor.o(showPopup),
        z: common_vendor.o(closePopup),
        A: common_vendor.p({
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
