"use strict";
const common_vendor = require("../../common/vendor.js");
function useLazyLoad(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = "50px",
    placeholder = "",
    errorImage = "",
    enableRetry = true,
    maxRetries = 3
  } = options;
  const loading = common_vendor.ref(false);
  const loaded = common_vendor.ref(false);
  const error = common_vendor.ref(false);
  const currentSrc = common_vendor.ref(placeholder);
  const retryCount = common_vendor.ref(0);
  let observer = null;
  let imageElement = null;
  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        loading.value = false;
        loaded.value = true;
        error.value = false;
        currentSrc.value = src;
        resolve(img);
      };
      img.onerror = () => {
        loading.value = false;
        error.value = true;
        if (enableRetry && retryCount.value < maxRetries) {
          retryCount.value++;
          setTimeout(() => {
            loadImage(src).then(resolve).catch(reject);
          }, 1e3 * retryCount.value);
        } else {
          currentSrc.value = errorImage || placeholder;
          reject(new Error("图片加载失败"));
        }
      };
      img.src = src;
    });
  };
  const load = async (src) => {
    if (!src || loaded.value)
      return;
    loading.value = true;
    try {
      await loadImage(src);
    } catch (err) {
      common_vendor.index.__f__("warn", "at src/composables/useLazyLoad.js:81", "图片加载失败:", src, err);
    }
  };
  const retry = (src) => {
    retryCount.value = 0;
    error.value = false;
    load(src);
  };
  const reset = () => {
    loading.value = false;
    loaded.value = false;
    error.value = false;
    retryCount.value = 0;
    currentSrc.value = placeholder;
  };
  const createObserver = (src) => {
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      common_vendor.index.__f__("warn", "at src/composables/useLazyLoad.js:115", "LazyLoad: 当前环境不支持IntersectionObserver，直接加载图片");
      load(src);
      return;
    }
    try {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              load(src);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold,
          rootMargin
        }
      );
    } catch (error2) {
      common_vendor.index.__f__("warn", "at src/composables/useLazyLoad.js:136", "LazyLoad: 创建IntersectionObserver失败，直接加载图片", error2);
      load(src);
    }
  };
  const observe = (element, src) => {
    if (!element || !src)
      return;
    let actualElement = element;
    if (element && typeof element === "object" && element.$el) {
      actualElement = element.$el;
    }
    if (!actualElement || !actualElement.nodeType || actualElement.nodeType !== Node.ELEMENT_NODE) {
      common_vendor.index.__f__("warn", "at src/composables/useLazyLoad.js:159", "LazyLoad: 提供的元素不是有效的DOM元素，直接加载图片");
      load(src);
      return;
    }
    imageElement = actualElement;
    if (!observer) {
      createObserver(src);
    }
    if (observer) {
      observer.observe(actualElement);
    }
  };
  const unobserve = () => {
    if (observer && imageElement) {
      observer.unobserve(imageElement);
      observer.disconnect();
      observer = null;
      imageElement = null;
    }
  };
  common_vendor.onUnmounted(() => {
    unobserve();
  });
  return {
    // 状态
    loading,
    loaded,
    error,
    currentSrc,
    retryCount,
    // 方法
    load,
    retry,
    reset,
    observe,
    unobserve
  };
}
exports.useLazyLoad = useLazyLoad;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/composables/useLazyLoad.js.map
