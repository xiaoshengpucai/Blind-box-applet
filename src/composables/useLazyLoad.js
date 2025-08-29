/**
 * 图片懒加载组合式函数
 * @description 提供高性能的图片懒加载功能
 */
import { ref, onMounted, onUnmounted } from 'vue';

/**
 * 图片懒加载Hook
 * @param {Object} options - 配置选项
 * @returns {Object} 懒加载相关状态和方法
 */
export function useLazyLoad(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    placeholder = '',
    errorImage = '',
    enableRetry = true,
    maxRetries = 3
  } = options;

  // ==================== 状态管理 ====================
  const loading = ref(false);
  const loaded = ref(false);
  const error = ref(false);
  const currentSrc = ref(placeholder);
  const retryCount = ref(0);
  
  let observer = null;
  let imageElement = null;

  // ==================== 核心方法 ====================
  /**
   * 加载图片
   * @param {string} src - 图片地址
   * @returns {Promise} 加载Promise
   */
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
          }, 1000 * retryCount.value); // 递增延迟重试
        } else {
          currentSrc.value = errorImage || placeholder;
          reject(new Error('图片加载失败'));
        }
      };
      
      img.src = src;
    });
  };

  /**
   * 开始加载图片
   * @param {string} src - 图片地址
   */
  const load = async (src) => {
    if (!src || loaded.value) return;
    
    loading.value = true;
    
    try {
      await loadImage(src);
    } catch (err) {
      console.warn('图片加载失败:', src, err);
    }
  };

  /**
   * 重试加载
   * @param {string} src - 图片地址
   */
  const retry = (src) => {
    retryCount.value = 0;
    error.value = false;
    load(src);
  };

  /**
   * 重置状态
   */
  const reset = () => {
    loading.value = false;
    loaded.value = false;
    error.value = false;
    retryCount.value = 0;
    currentSrc.value = placeholder;
  };

  // ==================== Intersection Observer ====================
  /**
   * 创建观察器
   * @param {string} src - 图片地址
   */
  const createObserver = (src) => {
    // 检查运行环境
    if (typeof window === 'undefined' || !window.IntersectionObserver) {
      // 不支持 Intersection Observer（如uni-app某些平台），直接加载
      console.warn('LazyLoad: 当前环境不支持IntersectionObserver，直接加载图片');
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
    } catch (error) {
      console.warn('LazyLoad: 创建IntersectionObserver失败，直接加载图片', error);
      load(src);
    }
  };

  /**
   * 观察元素
   * @param {Element} element - DOM元素
   * @param {string} src - 图片地址
   */
  const observe = (element, src) => {
    if (!element || !src) return;
    
    // 在uni-app中，element可能是组件实例，需要获取实际的DOM元素
    let actualElement = element;
    
    // 如果是uni-app组件实例，尝试获取DOM元素
    if (element && typeof element === 'object' && element.$el) {
      actualElement = element.$el;
    }
    
    // 检查是否为有效的DOM元素
    if (!actualElement || !actualElement.nodeType || actualElement.nodeType !== Node.ELEMENT_NODE) {
      console.warn('LazyLoad: 提供的元素不是有效的DOM元素，直接加载图片');
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

  /**
   * 停止观察
   */
  const unobserve = () => {
    if (observer && imageElement) {
      observer.unobserve(imageElement);
      observer.disconnect();
      observer = null;
      imageElement = null;
    }
  };

  // ==================== 生命周期 ====================
  onUnmounted(() => {
    unobserve();
  });

  // ==================== 返回API ====================
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

/**
 * 图片预加载Hook
 * @param {Array} imageUrls - 图片URL数组
 * @returns {Object} 预加载相关状态和方法
 */
export function useImagePreload(imageUrls = []) {
  const loadedImages = ref(new Set());
  const failedImages = ref(new Set());
  const loading = ref(false);
  const progress = ref(0);

  /**
   * 预加载单张图片
   * @param {string} src - 图片地址
   * @returns {Promise}
   */
  const preloadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      
      img.onload = () => {
        loadedImages.value.add(src);
        resolve({ success: true, src });
      };
      
      img.onerror = () => {
        failedImages.value.add(src);
        resolve({ success: false, src });
      };
      
      img.src = src;
    });
  };

  /**
   * 预加载所有图片
   * @param {Array} urls - 图片URL数组
   */
  const preloadAll = async (urls = imageUrls) => {
    if (!urls.length) return;
    
    loading.value = true;
    progress.value = 0;
    
    const promises = urls.map(async (url, index) => {
      const result = await preloadImage(url);
      progress.value = ((index + 1) / urls.length) * 100;
      return result;
    });
    
    const results = await Promise.all(promises);
    loading.value = false;
    
    return results;
  };

  /**
   * 清除缓存
   */
  const clearCache = () => {
    loadedImages.value.clear();
    failedImages.value.clear();
    progress.value = 0;
  };

  return {
    loadedImages,
    failedImages,
    loading,
    progress,
    preloadImage,
    preloadAll,
    clearCache
  };
}
