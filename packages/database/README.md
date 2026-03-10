# Database Package

> 纯数据库配置与 Prisma 定义包（不包含 NestJS 特定实现）

## 说明

此包包含项目的 Prisma 数据库配置与 schema 定义。

**注意**：Prisma 与 NestJS 的集成代码位于 `apps/api/src/prisma/`，而不是此包中。

## 文件结构

```
packages/database/
├── prisma/
│   ├── schema.prisma      # 数据库 schema 定义
│   ├── seed.ts            # 数据库 seed 脚本
│   └── migrations/        # Prisma 迁移文件
├── prisma.config.ts       # Prisma 配置（参考）
├── src/
│   └── index.ts           # 空导出（此包无代码）
└── package.json
```

## 用途

1. **Schema 版本管理**：集中管理所有数据库 schema 定义
2. **Seed 脚本**：初始数据导入脚本
3. **迁移记录**：所有数据库迁移历史

## 数据库操作

所有数据库相关命令都通过 `apps/api` 包执行：

```bash
pnpm db:generate   # 生成 Prisma 客户端
pnpm db:push       # 推送 schema 变更
pnpm db:migrate    # 创建和应用迁移
pnpm db:seed       # 执行 seed 脚本
```

## NestJS 集成

Prisma 在 NestJS 中的集成位于：

```
apps/api/src/prisma/
├── prisma.service.ts   # PrismaService - 全局数据库连接
├── prisma.module.ts    # PrismaModule - NestJS 模块
└── index.ts            # 导出
```

其中 `PrismaService` 扩展了 `@prisma/client` 的 `PrismaClient`，实现了 NestJS 的生命周期管理。
