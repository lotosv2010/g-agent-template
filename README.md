# 一人全流程全栈项目（中文协作版）

本项目用于单人负责产品、设计、开发、测试、运维的全栈实践。

技术栈：
- `TypeScript + pnpm + Turbo Monorepo`
- `Next.js App Router + shadcn/ui + Tailwind CSS`
- `NestJS + Prisma 7 + PostgreSQL`

## 当前架构
- `apps/web`：Next.js 前端
  - `/`：欢迎页
  - `/user`：用户 CRUD 页面（增删改查）
- `apps/api`：NestJS 业务应用层
  - `/users`：用户 CRUD 接口
  - `/health`：健康检查
  - 包含 PrismaService 和 PrismaModule，从 `@g-agent-template/database` 导入 Prisma 客户端和适配器
- `packages/database`：Prisma 数据库封装层（框架无关）
  - `prisma/`：Prisma schema、migrations、seed
  - `src/`：Prisma 客户端和适配器导出
  - 导出 PrismaClient、PrismaPg、Prisma 类型
- `packages/shared`：前后端共享 DTO、类型与工具函数
  - `dtos/`：数据传输对象（CreateUserDto 等）
  - `types/`：共享类型定义
  - 导出工具函数（dedupeById 等）

## 环境变量
Prisma 启动优先读取 `packages/database/.env`，不存在时回退根目录 `.env`；
API 启动优先读取 `apps/api/.env`，不存在时回退根目录 `.env`。

推荐在本地维护：
- `packages/database/.env`：Prisma 运行配置
- `apps/api/.env`：API 运行配置
- `.env`：可选根目录回退配置

示例见：
- `apps/api/.env.example`
- `.env.example`

## 快速启动
```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp .env.example .env
cd infra/docker && docker compose up -d && cd ../..
pnpm db:generate
pnpm db:push
pnpm dev
```

如果你使用非 Docker 的本地 PostgreSQL，请把 `DATABASE_URL` 改成你的实例连接串。

## 常用命令
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm db:generate
pnpm db:push
pnpm db:migrate
pnpm db:seed
```

## 文档导航
- 产品：`docs/product/product.md`
- 设计：`docs/design/design.md`
- 技术：`docs/engineering/technical.md`
- 测试：`docs/testing/testing.md`
- 运维：`docs/ops/runbook.md`
- Agent 规范：`AGENTS.md` / `CLAUDE.md` / `CODEX.md` / `KIMI.md` / `CODEBUDDY.md`
