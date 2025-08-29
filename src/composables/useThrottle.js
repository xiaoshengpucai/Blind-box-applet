/**
 * 节流函数组合式函数
 * @description 提供通用的节流功能，避免频繁调用函数
 */
import { ref } from 'vue';

/**
 * 创建节流函数
 * @param {Function} fn - 需要节流的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 节流后的函数
 */
export function useThrottle(fn, delay = 300) {
  const isThrottled = ref(false);
  
  return function(...args) {
    
    if (isThrottled.value) {
      return;
    }
    
    isThrottled.value = true;
    fn.apply(this, args);
    
    setTimeout(() => {
      isThrottled.value = false;
    }, delay);
  };
}

/**
 * 防抖函数
 * @param {Function} fn - 需要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function useDebounce(fn, delay = 300) {
  let timeoutId = null;
  
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * 可控制的节流Hook
 * @param {number} delay - 延迟时间
 * @returns {Object} 包含节流状态和控制方法
 */
export function useThrottleControl(delay = 300) {
  const isThrottled = ref(false);
  
  const throttle = (fn, ...args) => {
    if (isThrottled.value) return false;
    
    isThrottled.value = true;
    fn(...args);
    
    setTimeout(() => {
      isThrottled.value = false;
    }, delay);
    
    return true;
  };
  
  const reset = () => {
    isThrottled.value = false;
  };
  
  return {
    isThrottled,
    throttle,
    reset
  };
}
