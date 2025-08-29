/**
 * 格式化价格为 ￥XX.00 格式
 * @param {string|number} price - 原始价格（数字或数字文本）
 * @return {string} 格式化后的价格字符串
 */

export function formatPrice(price, options = {}) {
	const {
		currency = '',
			decimal = 2,
			useThousand = false,
	} = options

	if (!price && price !== 0) return `${currency}0.${'0'.repeat(decimal)}`

	const num = Number(price)
	if (isNaN(num)) return `${currency}0.${'0'.repeat(decimal)}`

	//处理千分位
	let result = num.toFixed(decimal)
	if (useThousand) {
		result = result.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}
	return `${currency}${result}`
}