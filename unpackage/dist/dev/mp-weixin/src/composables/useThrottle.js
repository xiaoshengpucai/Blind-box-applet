"use strict";
const common_vendor = require("../../common/vendor.js");
function useThrottle(fn, delay = 300) {
  const isThrottled = common_vendor.ref(false);
  return function(...args) {
    if (isThrottled.value)
      return;
    isThrottled.value = true;
    fn.apply(this, args);
    setTimeout(() => {
      isThrottled.value = false;
    }, delay);
  };
}
exports.useThrottle = useThrottle;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/composables/useThrottle.js.map
