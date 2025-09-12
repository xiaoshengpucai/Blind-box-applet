import {
	computed
} from 'vue';

export function useTagColors() {
	const tagColors = {
		'超神': '#53F1E3',
		'传说': '#B3F5C0',
		'普通': '#CAA8E5'
	};

	function hexToRgba(hex, opacity) {
		if (!hex) {
			hex = '#CCCCCC';
		}
		hex = hex.replace('#', '');
		const r = parseInt(hex.substring(0, 2), 16);
		const g = parseInt(hex.substring(2, 4), 16);
		const b = parseInt(hex.substring(4, 6), 16);
		return `rgba(${r},${g},${b},${opacity})`;
	}

	const getTagColor = (grade) => {
		const color = tagColors[grade] || '#CCCCCC';
		return {
			Color: hexToRgba(color, 1),
			bgColor: `linear-gradient(to bottom, ${hexToRgba(color, .5)} 0%, #fff 25%)`,
			recolor: `${hexToRgba(color, 0.2)}`
		};
	};

	return {
		tagColors,
		getTagColor
	};
}
