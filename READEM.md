uniapp-project/
├── pages/                # 页面目录
│   ├── home/             # 首页模块
│   │   ├── index.vue     # 首页主页面
│   │   ├── components/   # 首页局部组件
│   │   │   ├── slider.vue    # 轮播图组件
│   │   │   └── tab-bar.vue   # 标签栏组件
│   │   └── sub-page.vue  # 首页子页面
│   ├── user/             # 用户模块
│   │   ├── center.vue    # 用户中心页面
│   │   └── login.vue     # 登录页面
│   └── order/            # 订单模块
│       ├── list.vue      # 订单列表页
│       └── detail.vue    # 订单详情页
├── components/           # 公共组件目录
│   ├── common-button/    # 通用按钮组件
│   │   └── common-button.vue
│   ├── product-card/     # 商品卡片组件
│   │   └── product-card.vue
│   └── nav-bar/          # 导航栏组件
│       └── nav-bar.vue
├── static/               # 静态资源（图片、字体等）
├── App.vue               # 应用入口组件
├── main.js               # 应用入口JS
├── manifest.json         # 应用配置
├── pages.json            # 页面路由配置
└── uni.scss              # 全局样式