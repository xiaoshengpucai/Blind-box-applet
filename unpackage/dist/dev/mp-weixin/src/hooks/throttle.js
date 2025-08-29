"use strict";
function throttle(func, delay = 200) {
  let lastTime = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastTime >= delay) {
      func.apply(this, args);
      lastTime = now;
    }
  };
}
exports.throttle = throttle;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/hooks/throttle.js.map
