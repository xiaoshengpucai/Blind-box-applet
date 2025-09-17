import Mock from "better-mock";
// 判断当前环境是否为小程序
// const isMiniProgram = typeof wx !== 'undefined' && typeof wx.request === 'function';

// Mock.mock('http://localhost:8080/api/T-Tlist', 'get', DATA_LIST)

// mock('/api/list', DATA_LIST);
// mock('http://localhost:8080/api/T-Tlist', DATA_LIST)


const DATA_LIST = {
	"code": 200,
	"msg": "success",
	"data": {
		"list": [{
			"id": new Date().getTime() + Math.floor(Math.random() * 1000),
			"Title": "三丽鸥公仔系列",
			"price": 6.10,
			"img": "https://img1.baidu.com/it/u=1299369810,3742035215&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1082"
		}, {
			"id": new Date().getTime() + Math.floor(Math.random() * 1000),
			"Title": "全景运动相机",
			"price": 2.00,
			"img": "https://img2.baidu.com/it/u=1455518479,3144936783&fm=253&fmt=auto&app=120&f=PNG?w=500&h=1065"
		}, {
			"id": new Date().getTime() + Math.floor(Math.random() * 1000),
			"Title": "富士拍拍",
			"price": 28.90,
			"img": "https://img2.baidu.com/it/u=3360815703,3321978180&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1111"
		}, {
			"id": new Date().getTime() + Math.floor(Math.random() * 1000),
			"Title": "UNiQUE ART雕像",
			"price": 15.10,
			"img": "https://img0.baidu.com/it/u=3700946987,2207883969&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1114"
		}, {
			"id": new Date().getTime() + Math.floor(Math.random() * 1000),
			"Title": "少女乐队的呐喊",
			"price": 12.00,
			"img": "https://img1.baidu.com/it/u=894955063,4138614589&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1083"
		}, {
			"id": new Date().getTime() + Math.floor(Math.random() * 1000),
			"Title": "阴阳师",
			"price": 18.80,
			"img": "https://img0.baidu.com/it/u=3318815481,675612407&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889"
		}, {
			"id": new Date().getTime() + Math.floor(Math.random() * 1000),
			"Title": "胜利女生",
			"price": 12.00,
			"img": "https://img1.baidu.com/it/u=1297405382,3279217087&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=1426"
		}, {
			"id": new Date().getTime() + Math.floor(Math.random() * 1000),
			"Title": "崩坏：星穹铁道",
			"price": 1.90,
			"img": "https://img2.baidu.com/it/u=3969315328,3300096298&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1091"
		}, {
			"id": new Date().getTime() + Math.floor(Math.random() * 1000),
			"Title": "FuFu大家庭",
			"price": 9.90,
			"img": "https://img0.baidu.com/it/u=1965100551,3593283040&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=1081"
		}, {
			"id": new Date().getTime() + Math.floor(Math.random() * 1000),
			"Title": "赛博朋克",
			"price": 8.80,
			"img": "https://img2.baidu.com/it/u=3570987437,1081851385&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=1083"
		}, {
			"id": new Date().getTime() + Math.floor(Math.random() * 1000),
			"Title": "流星花园",
			"price": 18.80,
			"img": "https://img2.baidu.com/it/u=3896495679,3732936033&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889"
		}, {
			"id": new Date().getTime() + Math.floor(Math.random() * 1000),
			"Title": "诡秘之主",
			"price": 78.80,
			"img": "https://img0.baidu.com/it/u=1974539446,523763973&fm=253&fmt=auto?w=800&h=1745"
		}]
	}
}

const DETAIL_DATA_LIST = {
	"code": 200,
	"msg": "success",
	"data": [{
			listId: 1,
			title: '少女乐队的呐喊',
			price: '1100',
			level: '传说',
			chance: 0.5,
			src: 'https://q0.itc.cn/q_70/images03/20240819/15e51341a9364d7b8c9f631b458fb8b5.jpeg'
		},
		{
			listId: 2,
			title: '炽焰x笙歌 原神 女仆浴室共鸣系列 雷电将军',
			price: '2599',
			level: '超神',
			chance: 0.5,
			src: 'https://img1.baidu.com/it/u=3937103606,3676897764&fm=253&fmt=auto&app=120&f=JPEG?w=502&h=500'
		},
		{
			listId: 3,
			title: '原神 可莉·火花骑士Ver.1/7静态手办',
			price: '2599',
			level: '传说',
			chance: 1,
			src: 'https://img1.baidu.com/it/u=1636141268,890026111&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
		},
		{
			listId: 4,
			title: '集美殿堂 进击的巨人 艾伦耶格尔vs女巨人',
			price: '7158',
			level: '传说',
			chance: 1,
			src: 'https://img2.baidu.com/it/u=1357007271,1071071103&fm=253&fmt=auto&app=120&f=JPEG?w=503&h=500'
		},
		{
			listId: 5,
			title: 'coolbear studio三周年 尼尔机械纪元2B 豪华版',
			price: '4680',
			level: '传说',
			chance: 2,
			src: 'https://img0.baidu.com/it/u=478380046,1227329794&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500'
		}, {
			listId: 6,
			title: '魔法少女贴纸',
			price: '10',
			level: '普通',
			chance: 25,
			src: 'https://img2.baidu.com/it/u=188958811,1450173967&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
		}, {
			listId: 7,
			title: '原神贴纸',
			price: '5',
			level: '普通',
			chance: 70,
			src: 'https://img0.baidu.com/it/u=2809378840,1099363868&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
		}
	]
};

Mock.mock(/^http:\/\/[^\/]+\/api\/class\/sublist/, 'get', DETAIL_DATA_LIST)

// Add mock handler for the product list
Mock.mock(/^http:\/\/[^\/]+\/api\/class\/(无限赏|热门推荐|盒中盒|闯关|一番赏|全部|潮玩|周边|毛绒公仔)/, 'get', (options) => {
    console.log('Mock API hit:', options.url);
    // You can return different data based on the category (options.url) if needed
    const response = {
      code: 200,
      msg: "success",
      data: DATA_LIST.data.list
    };
    return response;
});