# 架构设计文档

## 总体架构

本项目采用 **关注点分离** 的 Monorepo 架构，分为三层：

```
┌─────────────────────────────────────────┐
│    应用层（apps/）                      │
│  - apps/web    (Next.js 前端)          │
│  - apps/api    (NestJS 业务逻辑)       │
└─────────────────────────────────────────┘
            ↓  导入
┌─────────────────────────────────────────┐
│    能力层（packages/）                  │
│  - @g-agent-template/database          │
│  - @g-agent-template/shared            │
└─────────────────────────────────────────┘
            ↓  支撑
┌─────────────────────────────────────────┐
│    基础设施（infra/）                   │
│  - ci/配置化流程                         │
│  - docker/容器化运行环境                 │
│  - scripts/初始化脚本                    │
└─────────────────────────────────────────┘
```

## 分层设计

### 1. 应用层（apps/）

#### apps/web - 前端应用
- **职责**：UI 表现层，用户交互
- **技术栈**：Next.js 15 + shadcn/ui + Tailwind CSS
- **依赖**：@g-agent-template/shared
- **路由**：
  - `/` - 欢迎页
  - `/user` - 用户 CRUD 管理页

#### apps/api - 业务应用层
- **职责**：业务逻辑处理，包含 NestJS 集成
- **技术栈**：NestJS 10
- **依赖**：
  - @g-agent-template/shared - 接口契约和工具
  - @g-agent-template/database - 数据库能力
- **代码结构**：
  ```
  src/
    prisma/        ← Prisma NestJS 集成
    users/         ← 业务模块
      users.service.ts
      users.controller.ts
      users.module.ts
    app.module.ts
    main.ts
  ```
- **关键特性**：
  - 包含 `PrismaService` 和 `PrismaModule`
  - 从 `@g-agent-template/database` 导入 `PrismaClient` 和 `PrismaPg`
  - 业务服务注入 `PrismaService` 处理数据操作
  - 无 Prisma schema/配置/迁移的职责

### 2. 能力层（packages/）

#### @g-agent-template/database - 数据库能力包
- **职责**：数据库能力封装（ORM、连接管理、模式定义）
- **技术栈**：Prisma 7 + PostgreSQL
- **导出内容**：
  ```typescript
  // re-export Prisma client 和所有类型
  export * from '@prisma/client';
  
  // 导出适配器
  export { PrismaPg } from '@prisma/adapter-pg';
  ```
- **结构**：
  ```
  packages/database/
    prisma/
      schema.prisma      ← 数据模型定义
      migrations/        ← 数据库迁移历史
      seed.ts           ← 数据初始化脚本
    src/
      index.ts          ← 公共导出
    prisma.config.ts    ← Prisma 配置（DB 连接、环保读取等）
    package.json
  ```
- **命令**：
  ```bash
  pnpm --filter @g-agent-template/database db:generate  # 生成 PrismaClient
  pnpm --filter @g-agent-template/database db:migrate   # 创建迁移
  pnpm --filter @g-agent-template/database db:push      # 推送 schema
  pnpm --filter @g-agent-template/database db:seed      # 执行 seed
  ```

#### @g-agent-template/shared - 共享能力包
- **职责**：前后端共享的类型、DTO 和工具函数
- **技术栈**：TypeScript + Zod
- **导出内容**：
  ```typescript
  // DTO 和类型
  export * from './dtos/user.dto';
  export * from './types/user.type';
  
  // 工具函数
  export * from 'es-toolkit';
  ```
- **结构**：
  ```
  packages/shared/
    src/
      dtos/
        user.dto.ts     ← 数据传输对象
      types/
        user.type.ts    ← 类型定义
      index.ts          ← 公共导出
    package.json
  ```


### 3. 基础设施层（infra/）
- Docker Compose 配置
- CI/CD 流程
- 初始化脚本

## 解耦原则

### ✅ 正确做法
```typescript
// apps/api/src/users/users.service.ts
import { PrismaService } from '@g-agent-template/database';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  
  async findAll() {
    return this.prisma.user.findMany(); // 用就行，不关心配置
  }
}
```

### ❌ 错误做法
```typescript
// ❌ app/api 直接依赖 Prisma
import { PrismaClient } from '@prisma/client';

// ❌ app/api 导入 schema 定义
import schema from '../../prisma/schema.prisma';

// ❌ app/api 管理迁移
import migration from '../../prisma/migrations/xxx';
```

## 变更流程

### 变更数据模型
1. 修改 `packages/database/prisma/schema.prisma`
2. 执行 `pnpm --filter @g-agent-template/database db:migrate "add_xxx_field"`
3. 自动生成 PrismaClient 类型
4. `apps/api` 的业务代码立即收益新类型

### 变更 API 接口签名
1. 更新 `packages/shared/src/dtos/user.dto.ts`
2. `apps/api` 的控制器/服务自动获得类型推导
3. `apps/web` 刷新导入自动同步类型

### 添加新业务模块
1. 在 `apps/api/src/` 创建新模块目录
2. 导入 `PrismaService` 使用数据库
3. PrismaModule 已在 AppModule 全局导入，无需重复

## 环境变量

### 加载优先级

**Prisma 连接字符串** (`prisma.config.ts`)：
```
1. packages/database/.env
2. .env (根目录)
```

**API 配置** (ConfigModule)：
```
1. apps/api/.env
2. .env (根目录)
```

### 必需变量
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
```

## 质量保证

每次变更后执行：
```bash
pnpm lint       # 代码规范检查
pnpm typecheck  # 类型检查
pnpm test       # 单元测试
```

涉及数据库变更还需：
```bash
pnpm db:generate  # 生成最新的 PrismaClient 类型
```

## 依赖关系图 (允许的导入方向)

### 当前实际架构
```
apps/web  ──→ packages/shared

apps/api  ──→ packages/shared
apps/api  ──→ packages/database（仅导入 PrismaService/Module）

packages/database  ──→ (无上游)
packages/shared    ──→ (无上游)
```

**禁止的方向**：
- ❌ apps/api → apps/web
- ❌ apps/web → apps/api
- ❌ packages/* → apps/*
- ❌ apps/api → @prisma/client（必须通过 @g-agent-template/database）
