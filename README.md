# 轻记 - 体重追踪应用

一个清新现代的移动端体重追踪 PWA 应用。

## 功能特点

- 📱 **移动端优先** - 专为手机设计，支持添加到主屏幕
- 🎯 **目标管理** - 设定减重目标，追踪进度
- 📊 **数据可视化** - 趋势图表、统计分析
- 💪 **激励系统** - 每日励志语句、里程碑庆祝
- 🔄 **离线支持** - PWA 离线缓存
- 🔐 **安全登录** - JWT 持久登录状态

## 技术栈

- **前端**: Vue 3 + TypeScript + Vite
- **UI**: Vant 4 + UnoCSS
- **图表**: ECharts
- **状态管理**: Pinia
- **后端**: Cloudflare Workers
- **数据库**: Cloudflare D1
- **部署**: Cloudflare Pages

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署

### 1. 创建 D1 数据库

```bash
wrangler d1 create qingji-db
```

更新 `wrangler.toml` 中的 `database_id`。

### 2. 初始化数据库

```bash
wrangler d1 execute qingji-db --file=./workers/schema.sql
```

### 3. 部署 Workers

```bash
wrangler deploy
```

### 4. 部署前端到 Cloudflare Pages

连接 GitHub 仓库，自动部署。

## 目录结构

```
qingji/
├── src/                # 前端源码
│   ├── views/         # 页面组件
│   ├── components/    # 通用组件
│   ├── stores/        # Pinia 状态
│   ├── api/           # API 封装
│   ├── utils/         # 工具函数
│   └── types/         # TypeScript 类型
├── workers/           # Cloudflare Workers
│   └── api/          # API 路由
└── public/           # 静态资源
```

## License

MIT