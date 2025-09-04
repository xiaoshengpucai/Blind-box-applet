"use strict";
const common_vendor = require("./common/vendor.js");
const src_hooks_throttle = require("./src/hooks/throttle.js");
const src_composables_useLayoutList = require("./src/composables/useLayoutList.js");
if (!Array) {
  const _easycom_up_icon2 = common_vendor.resolveComponent("up-icon");
  _easycom_up_icon2();
}
const _easycom_up_icon = () => "./node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (FilterDropdown + _easycom_up_icon + common_vendor.unref(StatusBar) + NavigationIcons + common_vendor.unref(Swiper) + WelfareCards + common_vendor.unref(TrendyTabVue))();
}
const StatusBar = () => "./components/status-bar.js";
const Swiper = () => "./pages/Home/componets/swiper.js";
const TrendyTabVue = () => "./pages/Home/componets/trendy-tab2.js";
const FilterDropdown = () => "./components/business/FilterDropdown.js";
const WelfareCards = () => "./components/business/WelfareCards.js";
const NavigationIcons = () => "./components/business/NavigationIcons.js";
const BACKGROUND_IMAGE_URL = "https://pica.zhimg.com/100/v2-211f3f93123fafec7b424efa838fe542_r.jpg";
const SCROLL_THRESHOLD = 500;
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const { fetchInfinteClassList } = src_composables_useLayoutList.useLayoutList();
    const THROTTLE_DELAY = {
      PAGE_CLICK: 300,
      // 降低页面点击节流延迟，提升响应性
      FILTER_TOGGLE: 300,
      SCROLL: 200
    };
    const SORT_TYPES = {
      NEW: "new",
      PRICE_DESC: "priceDesc",
      PRICE_ASC: "priceAsc"
    };
    const sortOptions = common_vendor.ref([
      {
        key: "new",
        label: "最新发布"
      },
      {
        key: "priceDesc",
        label: "价格从高到低"
      },
      {
        key: "priceAsc",
        label: "价格从低到高"
      }
    ]);
    const backgroundImage = BACKGROUND_IMAGE_URL;
    const handlePageClick = src_hooks_throttle.throttle(() => {
      if (!isFilterDropdownVisible.value)
        return;
      hideFilterDropdown();
    }, THROTTLE_DELAY.PAGE_CLICK);
    const statusBarHeight = common_vendor.ref(0);
    const handleStatusBarHeight = (height) => {
      common_vendor.index.__f__("log", "at pages/Home/index.vue:129", height, "height----------------");
      statusBarHeight.value = height;
    };
    const isFilterDropdownVisible = common_vendor.ref(false);
    const currentSortType = common_vendor.ref("");
    const showFilterDropdown = () => {
      isFilterDropdownVisible.value = true;
    };
    const hideFilterDropdown = () => {
      isFilterDropdownVisible.value = false;
    };
    const handleFilterToggle = src_hooks_throttle.throttle(() => {
      if (isFilterDropdownVisible.value) {
        hideFilterDropdown();
      } else {
        showFilterDropdown();
      }
    }, THROTTLE_DELAY.FILTER_TOGGLE);
    const productList = common_vendor.ref([]);
    const sortProducts = {
      /**
       * 按创建时间排序（最新）
       * @param {Array} products - 商品列表
       * @returns {Array} 排序后的商品列表
       */
      [SORT_TYPES.NEW]: (products) => {
        return [...products].sort((a, b) => b.createTime - a.createTime);
      },
      /**
       * 按价格降序排序（高到低）
       * @param {Array} products - 商品列表
       * @returns {Array} 排序后的商品列表
       */
      [SORT_TYPES.PRICE_DESC]: (products) => {
        return [...products].sort((a, b) => b.price - a.price);
      },
      /**
       * 按价格升序排序（低到高）
       * @param {Array} products - 商品列表
       * @returns {Array} 排序后的商品列表
       */
      [SORT_TYPES.PRICE_ASC]: (products) => {
        return [...products].sort((a, b) => a.price - b.price);
      }
    };
    const handleSortSelection = (payload) => {
      const sortType = payload.sortType;
      if (currentSortType.value === sortType)
        return;
      currentSortType.value = sortType;
      if (sortProducts[sortType]) {
        productList.value = sortProducts[sortType](productList.value);
      }
    };
    const navigationList = [
      {
        id: 1,
        text: "无限",
        path: "infinite",
        src: "../../static/nav-img/图层 4.png"
      },
      {
        id: 2,
        text: "热门",
        path: "hot",
        src: "../../static/nav-img/图层 5.png"
      },
      {
        id: 3,
        text: "盒中盒",
        path: "box",
        src: "../../static/nav-img/图层 6.png"
      },
      {
        id: 4,
        text: "闯关",
        path: "pass",
        src: "../../static/nav-img/图层 7.png"
      },
      {
        id: 5,
        text: "一番赏",
        path: "reward",
        src: "../../static/nav-img/图层 8.png"
      }
    ];
    const carouselData = common_vendor.ref([
      {
        id: 1,
        title: "轮播图1",
        imageUrl: "https://tse4-mm.cn.bing.net/th/id/OIP-C.QmHur5XIHx_hAyq12RQJ_wHaEH?cb=iwc2&rs=1&pid=ImgDetMain",
        linkUrl: "#",
        sortOrder: 1,
        isActive: true
      },
      {
        id: 2,
        title: "轮播图2",
        imageUrl: "https://tse1-mm.cn.bing.net/th/id/OIP-C.xGTInVTOkiPa4bx7tQWxzwHaEn?cb=iwc2&rs=1&pid=ImgDetMain",
        linkUrl: "#",
        sortOrder: 2,
        isActive: true
      },
      {
        id: 3,
        title: "轮播图3",
        imageUrl: "https://img1.baidu.com/it/u=3640869952,3948102950&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500",
        linkUrl: "#",
        sortOrder: 3,
        isActive: true
      },
      {
        id: 4,
        title: "轮播图4",
        imageUrl: "https://img2.baidu.com/it/u=2269872540,2964800185&fm=253&fmt=auto&app=120&f=JPEG?w=889&h=500",
        linkUrl: "#",
        sortOrder: 4,
        isActive: true
      }
    ]);
    const carouselSlides = common_vendor.computed(() => {
      const slides = carouselData.value;
      common_vendor.index.__f__("log", "at pages/Home/index.vue:298", "carouselSlides computed:", {
        slides,
        length: slides == null ? void 0 : slides.length,
        isArray: Array.isArray(slides),
        stringified: JSON.stringify(slides)
      });
      return slides;
    });
    common_vendor.index.__f__("log", "at pages/Home/index.vue:306", "carouselSlides computed:", carouselSlides.value);
    const carouselConfig = {
      switchMode: "slide",
      // 切换模式: fade | slide
      showIndicators: false,
      // 是否显示指示点
      autoplay: true,
      // 是否自动播放
      interval: 4e3,
      // 自动播放间隔时间(ms)
      duration: 600,
      // 切换动画持续时间(ms)
      circular: true,
      // 是否启用循环播放
      isshowcontrols: false
      // 是否显示控制按钮
    };
    const welfareCardList = [
      {
        id: "diy",
        title: "DIV赏",
        buttonText: "查看详情",
        buttonColor: "#6fa6f5",
        backgroundClass: "welfare-bg-diy",
        contentClass: "welfare-content welfare-content-diy",
        titleClass: "welfare-title welfare-title-diy"
      },
      {
        id: "exclusive",
        title: "专属福利",
        buttonText: "领取福利",
        buttonColor: "#e9918a",
        backgroundClass: "welfare-bg-exclusive",
        contentClass: "welfare-content welfare-content-exclusive",
        titleClass: "welfare-title welfare-title-exclusive"
      },
      {
        id: "roll",
        title: "ROLL房",
        buttonText: "参与活动",
        buttonColor: "#a295d9",
        backgroundClass: "welfare-bg-roll",
        contentClass: "welfare-content welfare-content-roll",
        titleClass: "welfare-title welfare-title-roll"
      }
    ];
    const componentInstance = common_vendor.ref(null);
    const navigationHeight = common_vendor.ref(0);
    const isNavigationFixed = common_vendor.ref(false);
    const scrollTop = common_vendor.ref(0);
    const scrollMask = common_vendor.computed(() => {
      return scrollTop.value >= 150;
    });
    const handleContentScroll = src_hooks_throttle.throttle((event) => {
      scrollTop.value = event.detail.scrollTop;
      isNavigationFixed.value = scrollTop.value > SCROLL_THRESHOLD;
    }, THROTTLE_DELAY.SCROLL);
    const calculateScrollViewHeight = () => {
      const windowInfo = common_vendor.index.getWindowInfo();
      return windowInfo.windowHeight - navigationHeight.value - statusBarHeight.value;
    };
    const handleNavigationClick = (navigationPath) => {
      common_vendor.index.__f__("log", "at pages/Home/index.vue:389", `导航点击: ${navigationPath.text}`);
    };
    const handleWelfareCardClick = (welfareItem) => {
      common_vendor.index.__f__("log", "at pages/Home/index.vue:398", `福利卡片点击于: ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}`, welfareItem.title);
    };
    const handleSwiperChange = (event) => {
    };
    const getInfinteClassList = async () => {
      try {
        const result = await fetchInfinteClassList({ page: 1, limit: 10 });
        productList.value = [...result];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/Home/index.vue:423", "获取无限列表数据失败:", error);
      }
    };
    common_vendor.onMounted(() => {
      initializeComponent();
      getInfinteClassList();
    });
    const initializeComponent = () => {
      var _a;
      componentInstance.value = (_a = common_vendor.getCurrentInstance()) == null ? void 0 : _a.proxy;
      setTimeout(() => {
        calculateNavigationHeight();
      }, 100);
    };
    const calculateNavigationHeight = () => {
      if (!componentInstance.value) {
        common_vendor.index.__f__("warn", "at pages/Home/index.vue:456", "组件实例未准备就绪");
        return;
      }
      const query = common_vendor.index.createSelectorQuery().in(componentInstance.value);
      query.selectAll(".navigation").boundingClientRect((data) => {
        if (data && data.length > 0) {
          common_vendor.index.__f__("log", "at pages/Home/index.vue:465", data[0], "data[0]");
          const result = data[0];
          navigationHeight.value = result.height;
          common_vendor.index.__f__("log", "at pages/Home/index.vue:468", "导航栏高度:", navigationHeight.value);
        } else {
          common_vendor.index.__f__("warn", "at pages/Home/index.vue:470", "未找到导航栏元素");
        }
      }).exec();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(common_vendor.unref(handleFilterToggle)),
        b: common_vendor.o(handleSortSelection),
        c: common_vendor.o(($event) => isFilterDropdownVisible.value = $event),
        d: common_vendor.p({
          currentSort: currentSortType.value,
          options: sortOptions.value,
          visible: isFilterDropdownVisible.value
        }),
        e: common_vendor.p({
          name: "search",
          color: "#fff",
          size: "22"
        }),
        f: common_vendor.p({
          name: "bell",
          color: "#fff",
          size: "22"
        }),
        g: common_vendor.o(handleStatusBarHeight),
        h: common_vendor.o(() => {
        }),
        i: common_vendor.unref(backgroundImage),
        j: common_vendor.o(handleNavigationClick),
        k: common_vendor.p({
          statusBarHeight: statusBarHeight.value,
          navigationList,
          isFixed: isNavigationFixed.value,
          scrollThreshold: 500,
          containerHeight: 220
        }),
        l: scrollMask.value
      }, scrollMask.value ? {} : {}, {
        m: common_vendor.o(handleSwiperChange),
        n: common_vendor.p({
          slide: carouselData.value,
          switchModeL: carouselConfig.switchMode,
          circular: carouselConfig.circular,
          showIndicators: carouselConfig.showIndicators,
          autoplay: carouselConfig.autoplay,
          interval: carouselConfig.interval,
          isshowcontrols: carouselConfig.isshowcontrols,
          duration: carouselConfig.duration
        }),
        o: common_vendor.o(handleWelfareCardClick),
        p: common_vendor.p({
          cards: welfareCardList
        }),
        q: common_vendor.p({
          productList: productList.value
        }),
        r: common_vendor.o((...args) => common_vendor.unref(handleContentScroll) && common_vendor.unref(handleContentScroll)(...args)),
        s: calculateScrollViewHeight() + "px",
        t: navigationHeight.value + "px",
        v: common_vendor.o((...args) => common_vendor.unref(handlePageClick) && common_vendor.unref(handlePageClick)(...args)),
        w: common_vendor.gei(_ctx, "")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c8f6c59c"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/index.js.map
