"use strict";
const common_vendor = require("../../common/vendor.js");
function useSwiper(options = {}) {
  const {
    slides = [],
    autoplay = true,
    interval = 3e3,
    duration = 500,
    circular = true,
    switchMode = "slide"
  } = options;
  const currentIndex = common_vendor.ref(circular ? 1 : 0);
  const isTransitioning = common_vendor.ref(false);
  common_vendor.ref(null);
  const transitionStyle = common_vendor.ref(`transform ${duration}ms ease`);
  const touchStartX = common_vendor.ref(0);
  const touchEndX = common_vendor.ref(0);
  const touchCurrentX = common_vendor.ref(0);
  const isDragging = common_vendor.ref(false);
  const mouseDown = common_vendor.ref(false);
  const dragOffset = common_vendor.ref(0);
  const containerWidth = common_vendor.ref(0);
  const isSeamlessJumping = common_vendor.ref(false);
  let autoplayTimer = null;
  const displaySlides = common_vendor.computed(() => {
    const slideList = slides.value || [];
    if (!slideList.length)
      return [];
    if (!circular)
      return slideList;
    return [
      slideList[slideList.length - 1],
      // 复制最后一张
      ...slideList,
      // 原始轮播图
      slideList[0]
      // 复制第一张
    ];
  });
  const realIndex = common_vendor.computed(() => {
    if (!circular)
      return currentIndex.value;
    if (currentIndex.value === 0)
      return slides.value.length - 1;
    if (currentIndex.value === displaySlides.value.length - 1)
      return 0;
    return currentIndex.value - 1;
  });
  const dynamicTransform = common_vendor.computed(() => {
    const baseOffset = currentIndex.value * 100;
    const dragPercentage = isDragging.value && !isSeamlessJumping.value && containerWidth.value > 0 ? dragOffset.value / containerWidth.value * 100 : 0;
    return `translateX(-${baseOffset + dragPercentage}%)`;
  });
  const dynamicTransition = common_vendor.computed(() => {
    if (isDragging.value || isSeamlessJumping.value) {
      return "none";
    }
    return `transform ${duration}ms ease`;
  });
  const goToSlide = (index, withTransition = true) => {
    if (isTransitioning.value && withTransition)
      return;
    transitionStyle.value = withTransition ? `transform ${duration}ms ease` : "none";
    currentIndex.value = index;
    if (withTransition) {
      isTransitioning.value = true;
      setTimeout(() => {
        isTransitioning.value = false;
      }, duration);
    }
  };
  const next = () => {
    if (isTransitioning.value)
      return;
    const nextIndex = currentIndex.value + 1;
    common_vendor.index.__f__("log", "at src/composables/useSwiper.js:118", "Next切换:", {
      currentIndex: currentIndex.value,
      nextIndex,
      totalSlides: displaySlides.value.length,
      isLastSlide: nextIndex === displaySlides.value.length - 1,
      circular
    });
    goToSlide(nextIndex);
    if (circular && nextIndex === displaySlides.value.length - 1) {
      common_vendor.index.__f__("log", "at src/composables/useSwiper.js:129", "执行无缝跳转: 从索引", nextIndex, "跳转到索引 1");
      setTimeout(() => {
        isSeamlessJumping.value = true;
        goToSlide(1, false);
        common_vendor.index.__f__("log", "at src/composables/useSwiper.js:134", "无缝跳转完成，当前索引:", currentIndex.value);
        common_vendor.nextTick$1(() => {
          isSeamlessJumping.value = false;
        });
      }, duration);
      return;
    }
    resetAutoplay();
  };
  const prev = () => {
    if (isTransitioning.value)
      return;
    const prevIndex = currentIndex.value - 1;
    goToSlide(prevIndex);
    if (circular && prevIndex === 0) {
      setTimeout(() => {
        isSeamlessJumping.value = true;
        goToSlide(slides.value.length, false);
        common_vendor.nextTick$1(() => {
          isSeamlessJumping.value = false;
        });
      }, duration);
      return;
    }
    resetAutoplay();
  };
  const goToRealIndex = (realIndex2) => {
    const targetIndex = circular ? realIndex2 + 1 : realIndex2;
    goToSlide(targetIndex);
    resetAutoplay();
  };
  const startAutoplay = () => {
    if (!autoplay || slides.value.length <= 1)
      return;
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      next();
    }, interval);
  };
  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };
  const resetAutoplay = () => {
    if (!autoplay)
      return;
    stopAutoplay();
    startAutoplay();
  };
  const SWIPE_THRESHOLD = 50;
  const handleTouchStart = (e) => {
    if (isTransitioning.value)
      return;
    const touch = e.touches ? e.touches[0] : e;
    touchStartX.value = touch.clientX;
    touchCurrentX.value = touch.clientX;
    isDragging.value = true;
    mouseDown.value = true;
    dragOffset.value = 0;
    const target = e.currentTarget;
    if (target) {
      containerWidth.value = target.offsetWidth || target.clientWidth || 375;
    }
    stopAutoplay();
  };
  const handleTouchMove = (e) => {
    if (!isDragging.value && !mouseDown.value)
      return;
    const touch = e.touches ? e.touches[0] : e;
    touchCurrentX.value = touch.clientX;
    touchEndX.value = touch.clientX;
    dragOffset.value = -(touchCurrentX.value - touchStartX.value);
    e.preventDefault();
  };
  const handleTouchEnd = () => {
    if (!isDragging.value && !mouseDown.value)
      return;
    const touchDiff = touchEndX.value - touchStartX.value;
    if (Math.abs(touchDiff) > SWIPE_THRESHOLD) {
      if (touchDiff > 0) {
        prev();
      } else {
        next();
      }
    } else {
      resetAutoplay();
    }
    isDragging.value = false;
    mouseDown.value = false;
    common_vendor.nextTick$1(() => {
      dragOffset.value = 0;
    });
  };
  common_vendor.onMounted(() => {
    startAutoplay();
  });
  common_vendor.onUnmounted(() => {
    stopAutoplay();
  });
  return {
    // 状态
    currentIndex,
    realIndex,
    displaySlides,
    isTransitioning,
    transitionStyle,
    // 动态样式
    dynamicTransform,
    dynamicTransition,
    isDragging,
    dragOffset,
    // 方法
    next,
    prev,
    goToSlide,
    goToRealIndex,
    // 自动播放控制
    startAutoplay,
    stopAutoplay,
    resetAutoplay,
    // 触摸事件
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
}
exports.useSwiper = useSwiper;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/composables/useSwiper.js.map
