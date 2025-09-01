"use strict";
const common_vendor = require("./common/vendor.js");
const src_hooks_throttle = require("./src/hooks/throttle.js");
if (!Array) {
  const _easycom_up_icon2 = common_vendor.resolveComponent("up-icon");
  _easycom_up_icon2();
}
const _easycom_up_icon = () => "./node-modules/uview-plus/components/u-icon/u-icon.js";
if (!Math) {
  (_easycom_up_icon + common_vendor.unref(StatusBar) + common_vendor.unref(Swiper) + common_vendor.unref(TrendyTabVue))();
}
const StatusBar = () => "./components/status-bar.js";
const Swiper = () => "./pages/Home/componets/swiper.js";
const TrendyTabVue = () => "./pages/Home/componets/trendy-tab2.js";
const BACKGROUND_IMAGE_URL = "https://pica.zhimg.com/100/v2-211f3f93123fafec7b424efa838fe542_r.jpg";
const SCROLL_THRESHOLD = 500;
const _sfc_main = {
  __name: "index",
  setup(__props) {
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
    const backgroundImage = BACKGROUND_IMAGE_URL;
    const handlePageClick = src_hooks_throttle.throttle(() => {
      if (!isFilterDropdownVisible.value)
        return;
      hideFilterDropdown();
    }, THROTTLE_DELAY.PAGE_CLICK);
    const statusBarHeight = common_vendor.ref(0);
    const handleStatusBarHeight = (height) => {
      statusBarHeight.value = height;
    };
    const isFilterDropdownVisible = common_vendor.ref(false);
    const currentSortType = common_vendor.ref("");
    const filterDropdownStyle = common_vendor.computed(() => ({
      transform: isFilterDropdownVisible.value ? "rotateX(0deg)" : "rotateX(-90deg)",
      opacity: isFilterDropdownVisible.value ? "1" : "0"
    }));
    const filterTextStyle = common_vendor.computed(() => ({
      color: currentSortType.value === "" ? "#fff" : currentSortType.value === SORT_TYPES.NEW ? "#fff" : "#bd9731"
    }));
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
    const generateUniqueId = () => {
      return `${Date.now()}_${Math.floor(Math.random() * 1e4)}`;
    };
    const initialProductData = [
      {
        id: generateUniqueId(),
        title: "三丽鸥公仔系列",
        price: 6.1,
        // 使用数字类型，便于排序
        imageUrl: "https://img1.baidu.com/it/u=1299369810,3742035215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1082",
        createTime: Date.now()
      },
      {
        id: generateUniqueId(),
        title: "全景运动相机",
        price: 2,
        imageUrl: "https://img2.baidu.com/it/u=1455518479,3144936783&fm=253&fmt=auto&app=120&f=PNG?w=500&h=1065",
        createTime: Date.now() + 1
      },
      {
        id: generateUniqueId(),
        title: "富士拍拍",
        price: 28.9,
        imageUrl: "https://img2.baidu.com/it/u=3360815703,3321978180&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1111",
        createTime: Date.now() + 2
      },
      {
        id: generateUniqueId(),
        title: "UNiQUE ART雕像",
        price: 15.1,
        imageUrl: "https://img0.baidu.com/it/u=3700946987,2207883969&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1114",
        createTime: Date.now() + 3
      },
      {
        id: generateUniqueId(),
        title: "少女乐队的呐喊",
        price: 12,
        imageUrl: "https://img1.baidu.com/it/u=894955063,4138614589&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1083",
        createTime: Date.now() + 4
      },
      {
        id: generateUniqueId(),
        title: "阴阳师",
        price: 18.8,
        imageUrl: "https://img0.baidu.com/it/u=3318815481,675612407&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889",
        createTime: Date.now() + 5
      },
      {
        id: generateUniqueId(),
        title: "胜利女生",
        price: 12,
        imageUrl: "https://img1.baidu.com/it/u=1297405382,3279217087&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1426",
        createTime: Date.now() + 6
      },
      {
        id: generateUniqueId(),
        title: "崩坏：星穹铁道",
        price: 1.9,
        imageUrl: "https://img2.baidu.com/it/u=3969315328,3300096298&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1091",
        createTime: Date.now() + 7
      },
      {
        id: generateUniqueId(),
        title: "FuFu大家庭",
        price: 9.9,
        imageUrl: "https://img0.baidu.com/it/u=1965100551,3593283040&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1081",
        createTime: Date.now() + 8
      },
      {
        id: generateUniqueId(),
        title: "赛博朋克",
        price: 8.8,
        imageUrl: "https://img2.baidu.com/it/u=3570987437,1081851385&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1083",
        createTime: Date.now() + 9
      },
      {
        id: generateUniqueId(),
        title: "流星花园",
        price: 18.8,
        imageUrl: "https://img2.baidu.com/it/u=3896495679,3732936033&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889",
        createTime: Date.now() + 10
      },
      {
        id: generateUniqueId(),
        title: "诡秘之主",
        price: 78.8,
        imageUrl: "https://img0.baidu.com/it/u=1974539446,523763973&fm=253&fmt=auto?w=800&h=1745",
        createTime: Date.now() + 11
      }
    ];
    const productList = common_vendor.ref([...initialProductData]);
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
    const handleSortSelection = (event) => {
      const sortType = event.target.dataset.type;
      common_vendor.index.__f__("log", "at pages/Home/index.vue:326", sortType, "排序类型----------------");
      if (currentSortType.value === sortType)
        return;
      currentSortType.value = sortType;
      if (sortProducts[sortType]) {
        productList.value = sortProducts[sortType](productList.value);
        common_vendor.index.__f__("log", "at pages/Home/index.vue:336", `商品已按${getSortTypeName(sortType)}排序`);
      }
      hideFilterDropdown();
    };
    const getSortTypeName = (sortType) => {
      const sortNames = {
        [SORT_TYPES.NEW]: "最新发布",
        [SORT_TYPES.PRICE_DESC]: "价格从高到低",
        [SORT_TYPES.PRICE_ASC]: "价格从低到高"
      };
      return sortNames[sortType] || "未知排序";
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
      common_vendor.index.__f__("log", "at pages/Home/index.vue:437", "carouselSlides computed:", {
        slides,
        length: slides == null ? void 0 : slides.length,
        isArray: Array.isArray(slides),
        stringified: JSON.stringify(slides)
      });
      return slides;
    });
    common_vendor.index.__f__("log", "at pages/Home/index.vue:445", "carouselSlides computed:", carouselSlides.value);
    const carouselConfig = {
      switchMode: "slide",
      // 切换模式: fade | slide
      indicatorDots: true,
      // 是否显示指示点
      autoplay: true,
      // 是否自动播放
      interval: 4e3,
      // 自动播放间隔时间(ms)
      duration: 600,
      // 切换动画持续时间(ms)
      circular: true
      // 是否启用循环播放
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
    const isScrollMask = common_vendor.ref(false);
    const calculateNavigationItemTop = (index) => {
      return isNavigationFixed.value ? 20 : index % 2 === 0 ? 30 : 10;
    };
    const scrollTop = common_vendor.ref(0);
    const scrollMask = common_vendor.computed(() => {
      return scrollTop.value >= 150;
    });
    const handleContentScroll = src_hooks_throttle.throttle((event) => {
      scrollTop.value = event.detail.scrollTop;
      isNavigationFixed.value = scrollTop.value > SCROLL_THRESHOLD;
      isScrollMask.value = scrollTop.value >= 150;
    }, THROTTLE_DELAY.SCROLL);
    const calculateScrollViewHeight = () => {
      const windowInfo = common_vendor.index.getWindowInfo();
      return windowInfo.windowHeight - navigationHeight.value - statusBarHeight.value;
    };
    const handleNavigationClick = (navigationPath) => {
      common_vendor.index.__f__("log", "at pages/Home/index.vue:537", `导航点击: ${navigationPath}`);
    };
    const handleWelfareCardClick = (welfareItem) => {
      common_vendor.index.__f__("log", "at pages/Home/index.vue:546", `福利卡片点击: ${welfareItem.title}`);
    };
    const handleSwiperChange = (event) => {
    };
    common_vendor.onMounted(() => {
      initializeComponent();
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
        common_vendor.index.__f__("warn", "at pages/Home/index.vue:588", "组件实例未准备就绪");
        return;
      }
      const query = common_vendor.index.createSelectorQuery().in(componentInstance.value);
      query.selectAll(".navigation-item").boundingClientRect((data) => {
        if (data && data.length > 0) {
          navigationHeight.value = data[0].height;
        }
      }).exec();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          name: "list-dot",
          color: "#fff",
          size: "22"
        }),
        b: common_vendor.s(filterTextStyle.value),
        c: common_vendor.o((...args) => common_vendor.unref(handleFilterToggle) && common_vendor.unref(handleFilterToggle)(...args)),
        d: common_vendor.p({
          name: "search",
          color: "#fff",
          size: "22"
        }),
        e: common_vendor.p({
          name: "bell",
          color: "#fff",
          size: "22"
        }),
        f: currentSortType.value === "new" ? 1 : "",
        g: currentSortType.value === "priceDesc" ? 1 : "",
        h: currentSortType.value === "priceAsc" ? 1 : "",
        i: common_vendor.o(handleSortSelection),
        j: common_vendor.s(filterDropdownStyle.value),
        k: common_vendor.o(handleStatusBarHeight),
        l: common_vendor.o(() => {
        }),
        m: common_vendor.unref(backgroundImage),
        n: common_vendor.f(navigationList, (navItem, index, i0) => {
          return {
            a: calculateNavigationItemTop(index) + "px",
            b: common_vendor.o(($event) => handleNavigationClick(navItem.text), navItem.id),
            c: navItem.src,
            d: navItem.id,
            e: common_vendor.n(`nav-item-${index}`),
            f: calculateNavigationItemTop(index) + "px",
            g: index * 0.2 + "s"
          };
        }),
        o: statusBarHeight.value + "px",
        p: common_vendor.o(() => {
        }),
        q: scrollMask.value
      }, scrollMask.value ? {} : {}, {
        r: common_vendor.o(handleSwiperChange),
        s: common_vendor.p({
          slide: carouselData.value,
          switchModeL: carouselConfig.switchMode,
          circular: carouselConfig.circular,
          indicatorDots: carouselConfig.indicatorDots,
          autoplay: carouselConfig.autoplay,
          interval: carouselConfig.interval,
          duration: carouselConfig.duration
        }),
        t: common_vendor.f(welfareCardList, (welfareItem, k0, i0) => {
          return {
            a: common_vendor.n(welfareItem.backgroundClass),
            b: common_vendor.t(welfareItem.title),
            c: common_vendor.n(welfareItem.titleClass),
            d: common_vendor.t(welfareItem.buttonText),
            e: welfareItem.buttonColor,
            f: "c8f6c59c-5-" + i0,
            g: common_vendor.p({
              name: "play-right-fill",
              size: "10",
              color: welfareItem.buttonColor
            }),
            h: common_vendor.n(welfareItem.contentClass),
            i: welfareItem.id,
            j: common_vendor.o(($event) => handleWelfareCardClick(welfareItem), welfareItem.id)
          };
        }),
        v: common_vendor.p({
          productList: productList.value
        }),
        w: common_vendor.o((...args) => common_vendor.unref(handleContentScroll) && common_vendor.unref(handleContentScroll)(...args)),
        x: calculateScrollViewHeight() + "px",
        y: navigationHeight.value + "px",
        z: common_vendor.o((...args) => common_vendor.unref(handlePageClick) && common_vendor.unref(handlePageClick)(...args)),
        A: common_vendor.gei(_ctx, "")
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c8f6c59c"]]);
exports.MiniProgramPage = MiniProgramPage;
//# sourceMappingURL=../.sourcemap/mp-weixin/index.js.map
