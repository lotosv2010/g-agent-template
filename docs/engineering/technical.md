# 技术文档

## Monorepo 结构
- `apps/api`：NestJS API + Prisma 集成
- `apps/web`：Next.js App Router + shadcn/ui + Tailwind CSS
- `packages/database`：纯 Prisma 配置与 schema（无 NestJS 依赖）
- `packages/shared`：共享 DTO、类型定义和工具函数（`es-toolkit`）

## 后端架构
- `AppModule` 组合 `PrismaModule` 与 `UsersModule`。
- `PrismaModule` 在 `src/prisma/` 中定义，提供全局 `PrismaService`。
- `UsersController` 提供 `/users` REST 接口，`id` 参数使用 `ParseIntPipe`。
- `UsersService` 使用 Prisma Client 访问数据库。
- `AppController` 提供 `/` 与 `/health`。

## 数据库与 Prisma
- Prisma 版本：`7.x`，数据库驱动：`@prisma/adapter-pg`。
- 配置：
  - Schema 定义于 `apps/api/prisma/schema.prisma`。
  - Prisma 配置文件：`apps/api/prisma.config.ts`。
  - NestJS 集成：`apps/api/src/prisma/prisma.service.ts` 与 `prisma.module.ts`。
- 环境变量读取策略：
  - 优先 `apps/api/.env`
  - 回退根目录 `.env`
- 用户模型（`users`）：
  - `id: Int @id @default(autoincrement())`
  - `createdAt: DateTime @map("create_time")`
  - `name: String`

## 前端架构
- 路由：
  - `/`：欢迎页
  - `/user`：用户 CRUD（列表、详情、创建、编辑、删除）
- UI 组件目录：`apps/web/src/components/ui`（shadcn/ui 风格）
- API 调用封装：`apps/web/src/lib/api.ts`


## 编码约束
- TypeScript 严格模式。
- 命名：文件 `kebab-case`，函数 `camelCase`，类型 `PascalCase`。
- 变更链路：shared -> api -> web -> docs。
