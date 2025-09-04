"use strict";
const common_vendor = require("../../common/vendor.js");
function useSwiper(componentProps) {
  const {
    slides,
    autoplay,
    interval,
    duration,
    circular,
    mode: switchMode
  } = common_vendor.toRefs(componentProps);
  const currentIndex = common_vendor.ref(circular.value && switchMode.value === "slide" ? 1 : 0);
  const isInitialized = common_vendor.ref(false);
  const isTransitioning = common_vendor.ref(false);
  const transitionStyle = common_vendor.ref(`transform ${duration.value}ms ease`);
  const fadeLeavingIndex = common_vendor.ref(null);
  const fadeEnteringIndex = common_vendor.ref(null);
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
    if (switchMode.value !== "slide" || !circular.value) {
      return slideList;
    }
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
    if (switchMode.value === "fade") {
      return currentIndex.value;
    }
    if (!circular.value) {
      return currentIndex.value;
    }
    const slideCount = slides.value.length;
    if (slideCount === 0)
      return 0;
    if (currentIndex.value === 0) {
      return slideCount - 1;
    }
    if (currentIndex.value === displaySlides.value.length - 1) {
      return 0;
    }
    return currentIndex.value - 1;
  });
  const dynamicTransform = common_vendor.computed(() => {
    const baseOffset = currentIndex.value * 100;
    const dragPercentage = isDragging.value && !isSeamlessJumping.value && containerWidth.value > 0 ? dragOffset.value / containerWidth.value * 100 : 0;
    const transformValue = `translateX(-${baseOffset + dragPercentage}%)`;
    return transformValue;
  });
  const dynamicTransition = common_vendor.computed(() => {
    if (isDragging.value || isSeamlessJumping.value) {
      return "none";
    }
    return transitionStyle.value;
  });
  const goToSlide = (index, withTransition = true) => {
    if (isTransitioning.value && withTransition) {
      return;
    }
    if (switchMode.value === "fade") {
      if (withTransition) {
        fadeLeavingIndex.value = realIndex.value;
        fadeEnteringIndex.value = index;
      }
      currentIndex.value = index;
      if (withTransition) {
        isTransitioning.value = true;
        setTimeout(() => {
          fadeLeavingIndex.value = null;
          fadeEnteringIndex.value = null;
          isTransitioning.value = false;
        }, 1200);
      }
      return;
    }
    const minIndex = 0;
    const maxIndex = displaySlides.value.length - 1;
    const clampedIndex = Math.max(minIndex, Math.min(index, maxIndex));
    transitionStyle.value = withTransition ? `transform ${duration.value}ms ease` : "none";
    currentIndex.value = clampedIndex;
    if (withTransition && duration.value > 0) {
      isTransitioning.value = true;
      setTimeout(() => {
        isTransitioning.value = false;
      }, duration.value);
      setTimeout(() => {
        if (isTransitioning.value) {
          isTransitioning.value = false;
        }
      }, Math.max(duration.value + 100, 1e3));
    } else {
      isTransitioning.value = false;
    }
  };
  const resetTransitionState = () => {
    isTransitioning.value = false;
    isSeamlessJumping.value = false;
    fadeLeavingIndex.value = null;
    fadeEnteringIndex.value = null;
  };
  const next = () => {
    if (isTransitioning.value) {
      return;
    }
    if (!slides.value || slides.value.length === 0) {
      return;
    }
    if (switchMode.value === "fade") {
      const nextRealIndex = (realIndex.value + 1) % slides.value.length;
      goToRealIndex(nextRealIndex);
      return;
    }
    const nextIndex = currentIndex.value + 1;
    if (circular.value && nextIndex === displaySlides.value.length - 1) {
      goToSlide(nextIndex);
      setTimeout(() => {
        isSeamlessJumping.value = true;
        goToSlide(1, false);
        common_vendor.nextTick$1(() => {
          isSeamlessJumping.value = false;
        });
      }, duration.value);
    } else {
      goToSlide(nextIndex);
    }
    resetAutoplay();
  };
  const prev = () => {
    if (isTransitioning.value) {
      return;
    }
    if (!slides.value || slides.value.length === 0) {
      return;
    }
    if (switchMode.value === "fade") {
      const prevRealIndex = (realIndex.value - 1 + slides.value.length) % slides.value.length;
      goToRealIndex(prevRealIndex);
      return;
    }
    const prevIndex = currentIndex.value - 1;
    if (circular.value && prevIndex === 0) {
      goToSlide(prevIndex);
      setTimeout(() => {
        isSeamlessJumping.value = true;
        goToSlide(displaySlides.value.length - 2, false);
        common_vendor.nextTick$1(() => {
          isSeamlessJumping.value = false;
        });
      }, duration.value);
    } else {
      goToSlide(prevIndex);
    }
    resetAutoplay();
  };
  const goToRealIndex = (realIndex2) => {
    if (isTransitioning.value || isSeamlessJumping.value) {
      resetTransitionState();
      if (isTransitioning.value || isSeamlessJumping.value) {
        return;
      }
    }
    if (switchMode.value === "fade") {
      goToSlide(realIndex2);
    } else {
      const targetIndex = circular.value ? realIndex2 + 1 : realIndex2;
      goToSlide(targetIndex);
    }
    resetAutoplay();
  };
  const startAutoplay = () => {
    if (!autoplay.value || slides.value.length <= 1)
      return;
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      next();
    }, interval.value);
  };
  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  };
  const resetAutoplay = () => {
    if (!autoplay.value)
      return;
    stopAutoplay();
    startAutoplay();
  };
  const SWIPE_THRESHOLD = 50;
  const handleTouchStart = (e) => {
    if (!e || isTransitioning.value || isSeamlessJumping.value) {
      return;
    }
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
    if (!e || !isDragging.value && !mouseDown.value) {
      return;
    }
    if (isSeamlessJumping.value) {
      return;
    }
    const touch = e.touches ? e.touches[0] : e;
    touchCurrentX.value = touch.clientX;
    touchEndX.value = touch.clientX;
    dragOffset.value = -(touchCurrentX.value - touchStartX.value);
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
  };
  const handleTouchEnd = () => {
    if (!isDragging.value && !mouseDown.value) {
      return;
    }
    if (Math.abs(dragOffset.value) <= 150) {
      isDragging.value = false;
      mouseDown.value = false;
      dragOffset.value = 0;
      return;
    }
    if (isTransitioning.value) {
      resetTransitionState();
    }
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
  const initializeSwiper = () => {
    if (isInitialized.value)
      return;
    isTransitioning.value = false;
    isSeamlessJumping.value = false;
    if (circular.value && slides.value && slides.value.length > 0) {
      currentIndex.value = 1;
    } else {
      currentIndex.value = 0;
    }
    isInitialized.value = true;
  };
  common_vendor.onMounted(() => {
    initializeSwiper();
    startAutoplay();
  });
  common_vendor.watch(() => slides.value, (newSlides) => {
    if (newSlides && newSlides.length > 0) {
      isInitialized.value = false;
      initializeSwiper();
    }
  }, { immediate: true });
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
    // Fade 模式过渡状态
    fadeLeavingIndex,
    fadeEnteringIndex,
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
    resetTransitionState,
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
