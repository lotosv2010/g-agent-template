# 运维手册

## 开发流程

### 初始化环节
1. **安装依赖**：`pnpm install` - 安装所有工作区依赖
2. **配置环境**：
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp .env.example .env
   ```
3. **启动数据库**：`cd infra/docker && docker compose up -d && cd ../..` - 使用Docker启动PostgreSQL（仅首次需要）
4. **初始化数据库**：
   ```bash
   pnpm db:generate    # 生成Prisma客户端
   pnpm db:push        # 推送schema到数据库
   pnpm db:seed        # （可选）填充初始数据
   ```

### 开发启动
- 启动开发服务器：`pnpm dev` - 并行启动前端和后端开发服务器
- 代码检查：`pnpm lint && pnpm typecheck && pnpm test` - 运行代码检查、类型检查和测试

### 开发中的数据库操作
- 修改 schema 后：`pnpm db:migrate` - 创建新的迁移并应用到开发数据库
- 重置数据库：`pnpm db:push --force-reset` - 删除所有数据并重新推送schema（谨慎操作）

## 打包与部署流程

### 构建前准备
1. **代码检查**：`pnpm lint && pnpm typecheck` - 确保代码质量
2. **生成数据库客户端**：`pnpm db:generate` - 必须在构建前执行

### 构建
- 构建项目：`pnpm build` - 使用Turbo并行构建所有应用和包
  - 自动执行 `pnpm db:generate` 作为前置条件
- 清理缓存：`pnpm clean` - 清理构建产物

### 生产部署
1. **数据库迁移**：`pnpm db:migrate` - 应用待处理的迁移（如果有新迁移）
2. **启动生产服务**：`pnpm --filter @g-agent-template/api start:prod` - 启动生产模式的API服务
3. **验证服务**：访问 `http://localhost:3000/health` 检查API健康状态

## 环境变量策略
- Prisma 与 API 优先读取 `apps/api/.env`。
- 若 `apps/api/.env` 不存在，则回退根目录 `.env`。

## 常见问题
- `P1001`：数据库未启动，先检查 Docker 与 5432 端口。
- `P1010`：数据库拒绝访问，通常是用户名/密码/数据库名不匹配，或复用了旧 Docker 卷。
  - 先确认 `DATABASE_URL` 与当前数据库实例一致（例如 `robin:robin123456@ai_test`）。
  - 若历史卷导致账号不一致，可在 `infra/docker` 执行 `docker compose down -v && docker compose up -d` 重建。
  - 重建后执行 `pnpm db:generate && pnpm db:push`。
- `DATABASE_URL not found`：确认根目录或 `apps/api/.env` 存在。
- 前端请求失败：确认 `NEXT_PUBLIC_API_URL` 指向 API。
- Hydration 警告：若出现浏览器插件注入属性导致的 mismatch，先禁用插件复测。
- `next/font` 拉取失败：离线网络环境下可能出现 `fonts.googleapis.com` 解析失败。

## 回滚建议
- 代码：回退提交。
- 数据库：开发环境可 `pnpm db:migrate` 或重建库后 `pnpm db:push`。
