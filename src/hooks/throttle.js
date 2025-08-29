// 节流函数（原生实现），函数名可更具通用性
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

export default throttle;