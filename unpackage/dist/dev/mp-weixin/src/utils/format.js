"use strict";
function formatPrice(price, options = {}) {
  const {
    currency = "",
    decimal = 2,
    useThousand = false
  } = options;
  if (!price && price !== 0)
    return `${currency}0.${"0".repeat(decimal)}`;
  const num = Number(price);
  if (isNaN(num))
    return `${currency}0.${"0".repeat(decimal)}`;
  let result = num.toFixed(decimal);
  if (useThousand) {
    result = result.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return `${currency}${result}`;
}
exports.formatPrice = formatPrice;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/src/utils/format.js.map
