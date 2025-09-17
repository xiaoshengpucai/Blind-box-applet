<template>
	<view class="mall-page">
		<!-- Header -->
		<view class="header">
			<view class="header-left">
				<text class="title">商城</text>
				<text class="subtitle">星趣</text>
			</view>
			<view class="search-bar">
				<text class="search-icon">🔍</text>
				<input type="text" placeholder="娃三岁" class="search-input" />
			</view>
			<view class="header-right">
				<view class="icon-group">
					<view class="icon">...</view>
					<view class="icon">-</view>
					<view class="icon">O</view>
				</view>
			</view>
		</view>

		<!-- Content Area -->
		<view class="content-area">
			<!-- Tabs -->
			<MallTabs :tabs="tabs" @tab-change="handleTabChange" />

			<!-- Filter Bar -->
			<FilterBar @filter-change="handleFilterChange" />

			<!-- Product List -->
			<MallProductList :products="products" class="product-list-container" @product-click="handleProductClick" />
		</view>
	</view>
</template>

<script setup>
import { ref } from 'vue';
import MallTabs from '@/components/business/MallTabs.vue';
import FilterBar from '@/components/business/FilterBar.vue';
import MallProductList from '@/components/business/MallProductList.vue';

// Helper function to generate mock data
const generateMockProducts = (count, category) => {
  const products = [];
  for (let i = 1; i <= count; i++) {
    products.push({
      id: `product-${category}-${i}`,
      img: `https://picsum.photos/seed/${category}${i}/400/600`,
      image_url: `https://picsum.photos/seed/${category}${i}/400/600`,
      Title: `【商】模拟商品 ${i} (${category})`,
      category: `【商】模拟商品 ${i} (${category})`,
      price: (Math.random() * 500 + 50).toFixed(2),
    });
  }
  return products;
};

const products = ref([]);
const originalProducts = ref([]);

const tabs = ref([
	{ title: '全部' },
	{ title: '潮玩' },
	{ title: '周边' },
	{ title: '毛绒公仔' }
]);

const currentCategory = ref('全部');

// Initial data load
products.value = generateMockProducts(20, currentCategory.value);
originalProducts.value = [...products.value];


const handleTabChange = (index) => {
	const selectedCategory = tabs.value[index].title;
    currentCategory.value = selectedCategory;
	products.value = generateMockProducts(20, selectedCategory);
    originalProducts.value = [...products.value];
};

const handleFilterChange = (filterInfo) => {
	const { filter, sortOrder } = filterInfo;

	if (filter === 'price') {
		products.value.sort((a, b) => {
			const priceA = parseFloat(a.price);
			const priceB = parseFloat(b.price);
			return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
		});
	} else {
		// For 'comprehensive' and 'time', revert to the original, unsorted list
		products.value = [...originalProducts.value];
	}
};

const handleProductClick = (product) => {
    console.log('Product clicked:', product);
    // Navigate to product detail page or perform other actions
};

</script>

<style lang="scss" scoped>
.mall-page {
	display: flex;
	flex-direction: column;
	padding-top: var(--status-bar-height);
	height: calc(100vh - var(--tab-bar-height));
	padding-bottom: calc(50px + env(safe-area-inset-bottom));
	box-sizing: border-box;
	background-color: #f5f5f5;

	.header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx;
		background-color: #a0e9ff;
		position: sticky;
		top: 0;
		z-index: 10;
	}

	.header-left {
		.title {
			font-size: 36rpx;
			font-weight: bold;
		}

		.subtitle {
			font-size: 36rpx;
			font-weight: bold;
			color: #f2c202;
			margin-left: 5rpx;
		}
	}

	.search-bar {
		display: flex;
		align-items: center;
		background-color: #fff;
		border-radius: 30rpx;
		padding: 10rpx 20rpx;
		flex-grow: 1;
		margin: 0 20rpx;
		border: 1px solid #eee;


		.search-icon {
			margin-right: 10rpx;
			color: #999;
		}

		.search-input {
			font-size: 28rpx;
			width: 100%;
			color: #999;
		}
	}

	.header-right {
		display: flex;
		align-items: center;

		.icon-group {
			display: flex;
			align-items: center;
			border: 1px solid #333;
			border-radius: 30rpx;
			padding: 5rpx 10rpx;

			.icon {
				margin: 0 5rpx;
				font-size: 24rpx;
				color: #333;
			}
		}
	}

	.content-area {
		flex: 1;
		overflow-y: auto;
		height: 100%; /* Important for scrolling and getting height */
	}

	.product-list-container {
		padding: 0 20rpx;
	}
}
</style>
