# AGENTS.md（统一主规范）

本文件适用于 Claude Code、Codex、Kimi、CodeBuddy 等所有 Agent。

## 1. 语言与输出规则（强制）
- 所有分析、说明、提交备注、文档更新必须使用中文。
- 新增文档默认放在 `docs/` 对应目录并使用中文标题。
- 若用户未特别指定语言，默认中文回复。

## 2. 项目边界
- 前端：`apps/web`（Next.js 15 + shadcn/ui + Tailwind CSS）
- 后端：`apps/api`（NestJS 10 + Prisma 集成）
- 共享资源：`packages/shared`（包含共享类型、DTO 和工具函数）
- 数据库能力：`packages/database`（Prisma 7 + PostgreSQL 配置）
- 基础设施：`infra/`（Docker、CI/CD、脚本）

### 包结构说明
```
apps/
├── web/          # Next.js 前端应用
└── api/          # NestJS 业务应用层（包含 PrismaService/Module）

packages/
├── database/     # Prisma 配置、Schema、迁移、Seed 脚本（框架无关）
└── shared/       # 前后端共享的类型、DTO 和工具函数
```

**注意**: 文档中提到的 `packages/contracts` 和 `packages/utils` 尚未创建，暂由 `packages/shared` 承担其职责。

## 3. 架构规则

### 3.1 依赖关系（严格遵循）
```
apps/web  ──→ @g-agent-template/shared
apps/api  ──→ @g-agent-template/shared
apps/api  ──→ @g-agent-template/database（仅导入 PrismaService/Module）

packages/database  ──→（无上游）
packages/shared    ──→（无上游）
```

**禁止的依赖方向**：
- ❌ `apps/api` → `apps/web` 或 `apps/web` → `apps/api`
- ❌ `packages/*` → `apps/*`
- ❌ `apps/api` → `@prisma/client`（必须通过 `@g-agent-template/database`）

### 3.2 数据库层规则
- **框架无关**：`packages/database` 包含 Prisma 配置、Schema、迁移、Seed 脚本、客户端和适配器导出。
- **NestJS 集成**：`apps/api` 包含 `PrismaService` 和 `PrismaModule`，从 `@g-agent-template/database` 导入 Prisma 客户端和适配器。
- **Prisma Schema 源头唯一**：`packages/database/prisma/schema.prisma`。
- **Prisma 配置唯一**：`packages/database/prisma.config.ts`（Prisma 7）。
- **禁止直接使用 @prisma/client**：API 层必须通过 `@g-agent-template/database` 导入。

### 3.3 API 设计规则
- **路由约定**：
  - `apps/web`：`/` 欢迎页，`/user` 用户 CRUD 页
  - `apps/api`：`/users` 用户 CRUD 接口，`/health` 健康检查
- **字段变更同步**：接口字段变更必须同步 `shared`、API、Web 与文档。
- **类型一致性**：`User.id` 当前为 `number`，禁止在链路中回退为字符串类型。
- **DateTime 序列化**：数据库返回 `DateTime`，前端使用 `string`，保持类型兼容。

### 3.4 UI 开发规则
- **组件优先级**：优先复用 `apps/web/src/components/ui` 的 shadcn 组件。
- **API 调用**：通过 `apps/web/src/lib/api.ts` 封装的函数调用后端 API。
- **状态管理**：简单状态使用 React State，复杂状态考虑引入 Zustand。

### 3.5 新增 Package 规则
- 新增 package 必须具备明确复用价值和清晰的职责边界。
- 避免过度拆分，优先考虑在现有包中扩展。
- 必须包含完整的 `package.json`、`tsconfig.json` 和必要的文档。

## 4. 质量门禁

### 4.1 每次变更后必须执行
```bash
pnpm lint       # 代码规范检查（oxlint）
pnpm typecheck  # 类型检查
pnpm test       # 单元测试
```

### 4.2 涉及数据库变更时额外执行
```bash
pnpm db:generate  # 生成 PrismaClient 类型
pnpm db:push      # 推送 schema 变更（开发环境）
pnpm db:migrate   # 创建迁移（生产环境）
```

### 4.3 提交前检查
- 确保 `pnpm check`（= lint + typecheck + test）全部通过
- 确保没有新的 TypeScript 错误
- 确保没有新的 lint 警告

### 4.4 Lint 规则说明
- 使用 **oxlint** 作为主要 linter（高性能）
- 规则配置在各子包的 `.oxlintrc.json` 中
- API 层：`no-console: off`，允许使用 console
- Web 层：`no-console: warn`，React Hooks 规则开启

## 5. 交付模板

所有变更必须遵循以下交付模板：

```md
## 变更摘要
- [变更内容 1]
- [变更内容 2]

## 验证记录
- pnpm lint: ✅ 通过
- pnpm typecheck: ✅ 通过
- pnpm test: ✅ 通过
- [涉及数据库时] pnpm db:generate: ✅ 通过

## 风险与回滚
- 风险：[描述潜在风险]
- 回滚：[回滚步骤或回滚方案]
```

## 6. 环境配置规范

### 6.1 环境变量文件优先级
- **Prisma 连接**（`packages/database/prisma.config.ts`）：
  1. `packages/database/.env`
  2. `apps/api/.env`
  3. `.env`（根目录）
- **API 配置**（`apps/api`）：
  1. `apps/api/.env`
  2. `.env`（根目录）

### 6.2 必需环境变量
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
API_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

### 6.3 安全规范
- **禁止将 `.env` 文件提交到版本控制**
- 确保 `.gitignore` 包含所有 `.env` 文件
- 使用 `.env.example` 作为环境变量模板

## 7. 常用命令速查

### 开发命令
```bash
pnpm dev           # 并行启动所有服务
pnpm build         # 构建所有包
pnpm dev:web       # 仅启动 web
pnpm dev:api       # 仅启动 api
```

### 质量检查
```bash
pnpm lint          # 代码规范检查
pnpm typecheck     # 类型检查
pnpm test          # 单元测试
pnpm check         # 执行所有检查
pnpm spellcheck    # 拼写检查
```

### 数据库操作
```bash
pnpm db:generate   # 生成 PrismaClient
pnpm db:push       # 推送 schema（开发环境）
pnpm db:migrate    # 创建迁移
pnpm db:seed       # 执行 seed 脚本
```

### 清理
```bash
pnpm clean         # 清理所有构建产物
```

## 8. 已知问题与待优化

### 8.1 架构层面
- `tests/` 目录下测试用例为空

### 8.2 功能层面
- API 缺少认证授权机制
- API 缺少统一的错误处理
- 前端缺少加载和错误状态管理
- 缺少 API 文档（Swagger/OpenAPI）

### 8.3 DevOps 层面
- CI/CD 配置为空
- Docker 配置不完整（仅数据库）
- 缺少 Pre-commit Hooks（husky + lint-staged）

### 8.4 依赖管理
- 缺少依赖更新策略