/**
 * 轮播图组合式函数
 * @description 提供轮播图的核心逻辑，支持自动播放、手势控制等
 */
import { ref, computed, nextTick,watch, onMounted, onUnmounted } from 'vue';

/**
 * 轮播图Hook
 * @param {Object} options - 配置选项
 * @returns {Object} 轮播图相关状态和方法
 */
export function useSwiper(options = {}) {
  const {
    slides = [],
    autoplay = true,
    interval = 3000,
    duration = 500,
    circular = true,
    switchMode = 'slide'
  } = options;

  // ==================== 状态管理 ====================
  const currentIndex = ref(circular ? 1 : 0);
  const isInitialized = ref(false);
  const isTransitioning = ref(false);
  const leavingIndex = ref(null);
  const transitionStyle = ref(`transform ${duration}ms ease`);
  


  // 触摸相关状态
  const touchStartX = ref(0);
  const touchEndX = ref(0);
  const touchCurrentX = ref(0);
  const isDragging = ref(false);
  const mouseDown = ref(false);
  const dragOffset = ref(0);
  const containerWidth = ref(0);
  const isSeamlessJumping = ref(false);
  
  // 自动播放定时器
  let autoplayTimer = null;
  let seamlessJumpTimer = null;

  // ==================== 计算属性 ====================
  /**
   * 显示的轮播图列表（包含循环复制项）
   */
  const displaySlides = computed(() => {
    const slideList = slides.value || [];
    if (!slideList.length) return [];
    
    if (!circular) return slideList;
    
    // 为无缝轮播复制首尾项
    const displayList = [
      slideList[slideList.length - 1], // 复制最后一张
      ...slideList,                    // 原始轮播图
      slideList[0]                     // 复制第一张
    ];
    
    return displayList;
  });

  /**
   * 当前真实索引（去除复制项的影响）
   */
  const realIndex = computed(() => {
    if (!circular) return currentIndex.value;
    
    // 处理边界情况
    if (currentIndex.value === 0) return slides.value.length - 1;
    if (currentIndex.value === displaySlides.value.length - 1) return 0;
    
    // 正常情况：减去复制项的影响
    const realIdx = currentIndex.value - 1;
    return realIdx;
  });

  /**
   * 动态transform值（包含拖拽偏移）
   */
  const dynamicTransform = computed(() => {
    const baseOffset = currentIndex.value * 100;
    // 在无缝跳转期间，不应用拖拽偏移
    const dragPercentage = (isDragging.value && !isSeamlessJumping.value && containerWidth.value > 0) ? 
      (dragOffset.value / containerWidth.value) * 100 : 0;
    
    const transformValue = `translateX(-${baseOffset + dragPercentage}%)`;

    return transformValue;
  });

  /**
   * 动态过渡样式
   */
  const dynamicTransition = computed(() => {
    // 无缝跳转或拖拽时不使用过渡动画
    if (isDragging.value || isSeamlessJumping.value) {
      return 'none';
    }
    
    // 使用transitionStyle的值，这样可以控制无缝跳转时的动画
    return transitionStyle.value;
  });

  // ==================== 核心方法 ====================
    /**
   * 切换到指定索引
   * @param {number} index - 目标索引
   * @param {boolean} withTransition - 是否使用过渡动画
   */
  const goToSlide = (index, withTransition = true) => {
    if (isTransitioning.value && withTransition) {
      return;
    }
    
    // 限制索引范围
    const minIndex = 0;
    const maxIndex = displaySlides.value.length - 1;
    const clampedIndex = Math.max(minIndex, Math.min(index, maxIndex));
    
    transitionStyle.value = withTransition ? `transform ${duration}ms ease` : 'none';
    currentIndex.value = clampedIndex;
    
    if (withTransition && duration > 0) {
      isTransitioning.value = true;
      // 确保只在过渡结束后重置状态
      setTimeout(() => {
        isTransitioning.value = false;
      }, duration);
      
      // 额外的安全检查：如果duration太长，设置一个最大超时
      setTimeout(() => {
        if (isTransitioning.value) {
          isTransitioning.value = false;
        }
      }, Math.max(duration + 100, 1000)); // 最大1秒
    } else {
      // 如果没有过渡动画或duration为0，立即重置状态
      isTransitioning.value = false;
    }
  };

  /**
   * 清理定时器
   */
  const clearSeamlessTimer = () => {
    if (seamlessJumpTimer) {
      clearTimeout(seamlessJumpTimer);
      seamlessJumpTimer = null;
    }
  };
  /**
   * 强制重置过渡状态
   */
  const resetTransitionState = () => {
    isTransitioning.value = false;
    isSeamlessJumping.value = false;
  };

  /**
   * 下一张
   */
  const next = () => {
    if (isTransitioning.value) {
      return;
    }
    
    if (!slides.value || slides.value.length === 0) {
      return;
    }
    
    const nextIndex = currentIndex.value + 1;

    
    // 检查是否需要无缝跳转
    if (circular && nextIndex === displaySlides.value.length - 1) {
   
      // 先执行正常的切换动画
      goToSlide(nextIndex);
      
      // 动画完成后执行无缝跳转
      setTimeout(() => {
        isSeamlessJumping.value = true;
        goToSlide(1, false); // 无动画跳转到真实的第一张
  
        // 等待DOM更新后恢复动画
        nextTick(() => {
          isSeamlessJumping.value = false;
        });
      }, duration);
    } else {
      // 正常切换
      goToSlide(nextIndex);
    }
    
    resetAutoplay();
  };

  /**
   * 上一张
   */
  const prev = () => {
    if (isTransitioning.value) {
      return;
    }
    
    if (!slides.value || slides.value.length === 0) {
      return;
    }
    
    const prevIndex = currentIndex.value - 1;

    
    // 检查是否需要无缝跳转
    if (circular && prevIndex === 0) {
 
      // 先执行正常的切换动画
      goToSlide(prevIndex);
      
      // 动画完成后执行无缝跳转
      setTimeout(() => {
        isSeamlessJumping.value = true;
        goToSlide(displaySlides.value.length - 2, false); // 无动画跳转到真实的最后一张
     
        // 等待DOM更新后恢复动画
        nextTick(() => {
          isSeamlessJumping.value = false;
        });
      }, duration);
    } else {
      // 正常切换
      goToSlide(prevIndex);
    }
    
    resetAutoplay();
  };

  /**
   * 跳转到指定真实索引
   * @param {number} realIndex - 真实索引
   */
  const goToRealIndex = (realIndex) => {
    if (isTransitioning.value || isSeamlessJumping.value) {
      resetTransitionState();
      // 重新检查状态
      if (isTransitioning.value || isSeamlessJumping.value) {
        return;
      }
    }
    
    // 清除之前的无缝跳转定时器
    clearSeamlessTimer();
    
    const targetIndex = circular ? realIndex + 1 : realIndex;
    
    // 直接调用goToSlide，不使用startTransition
    goToSlide(targetIndex);
    resetAutoplay();
  };

  // ==================== 自动播放控制 ====================
  /**
   * 开始自动播放
   */
  const startAutoplay = () => {
    if (!autoplay || slides.value.length <= 1) return;
    
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      next();
    }, interval);
  };

  /**
   * 停止自动播放
   */
  const stopAutoplay = () => {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
    // 同时清理无缝跳转定时器
    clearSeamlessTimer();
  };

  /**
   * 重置自动播放
   */
  const resetAutoplay = () => {
    if (!autoplay) return;
    stopAutoplay();
    startAutoplay();
  };

  // ==================== 触摸事件处理 ====================
  const SWIPE_THRESHOLD = 50; // 滑动阈值

  /**
   * 触摸开始
   */
  const handleTouchStart = (e) => {
    if (isTransitioning.value || isSeamlessJumping.value) {
      return;
    }
    
    const touch = e.touches ? e.touches[0] : e;
    touchStartX.value = touch.clientX;
    touchCurrentX.value = touch.clientX;
    isDragging.value = true;
    mouseDown.value = true;
    dragOffset.value = 0;
    
    // 获取容器宽度（用于计算百分比）
    const target = e.currentTarget;
    if (target) {
      containerWidth.value = target.offsetWidth || target.clientWidth || 375;
    }
    
    stopAutoplay();
  };

  /**
   * 触摸移动
   */
  const handleTouchMove = (e) => {
    if (!isDragging.value && !mouseDown.value) {
      return;
    }
    
    if (isSeamlessJumping.value) {
      return; // 无缝跳转时不处理触摸移动
    }
    
    const touch = e.touches ? e.touches[0] : e;
    touchCurrentX.value = touch.clientX;
    touchEndX.value = touch.clientX;
    
    // 计算拖拽偏移量
    dragOffset.value = -(touchCurrentX.value - touchStartX.value);
    
    // 防止默认滚动行为
    e.preventDefault();
  };

    /**
   * 触摸结束
   */
  const handleTouchEnd = () => {
   // 如果没有拖拽或鼠标按下，说明只是点击，不处理
    if (!isDragging.value || !mouseDown.value) {
      return;
    }

    // 只要dragOffset在[-100, 100]区间内，认为只是点击，不执行任何操作
    if (Math.abs(dragOffset.value) <= 200) {
      isDragging.value = false;
      mouseDown.value = false;
      dragOffset.value = 0;
      return;
    }

    // 如果状态被阻塞，强制重置
    if (isTransitioning.value) {
     resetTransitionState();
    }
    
    const touchDiff = touchEndX.value - touchStartX.value;
    
    // 检查是否有足够的滑动距离
    if (Math.abs(touchDiff) > SWIPE_THRESHOLD) {
      if (touchDiff > 0) {
        prev(); // 向右滑动，显示上一张
      } else {
        next(); // 向左滑动，显示下一张
      }
    } else {
      resetAutoplay(); // 滑动距离不够，重置自动播放
    }

    // 重置拖拽状态
    isDragging.value = false;
    mouseDown.value = false;

    // 延迟重置拖拽偏移，确保动画完成
    nextTick(() => {
      dragOffset.value = 0;
    });
  };

  // ==================== 初始化方法 ====================
  /**
   * 初始化轮播图
   */
  const initializeSwiper = () => {
    if (isInitialized.value) return;
    
   
    // 确保初始状态正确
    isTransitioning.value = false;
    isSeamlessJumping.value = false;
    
    // 确保初始索引正确
    if (circular && slides.value && slides.value.length > 0) {
      currentIndex.value = 1; // 循环模式下从复制的第一张开始
    } else {
      currentIndex.value = 0; // 非循环模式下从第一张开始
    }
    
    isInitialized.value = true;
  };

  // ==================== 生命周期 ====================
  onMounted(() => {
    initializeSwiper();
    startAutoplay();
  });

  // 监听slides变化，重新初始化
  watch(() => slides.value, (newSlides) => {
    if (newSlides && newSlides.length > 0) {
      isInitialized.value = false;
      initializeSwiper();
    }
  }, { immediate: true });

  onUnmounted(() => {
    stopAutoplay();
    clearSeamlessTimer();
  });

  // ==================== 返回API ====================
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
