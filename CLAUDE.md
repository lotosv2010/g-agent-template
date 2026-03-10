# CLAUDE.md

Claude 在本仓库执行任务时默认遵循 `AGENTS.md`。

## Claude 补充规则
- 默认中文输出，不切换英文。
- **数据库变更规范**：
  - Schema 变更必须更新 `packages/database/prisma/schema.prisma`。
  - 执行 `pnpm --filter @g-agent-template/database db:migrate` 创建迁移文件。
  - 执行 `pnpm --filter @g-agent-template/database db:generate` 生成 PrismaClient。
  - `packages/database` 包含所有 Prisma 相关内容，`apps/api` 只做业务逻辑。
- 涉及接口字段时，同步更新 `packages/shared` 与前端调用。
- Web 页面改动优先复用 shadcn 组件，不重复造轮子。
- 业务代码引入 Prisma 类型时，使用 `import type { ... } from '@g-agent-template/database'`。
- 业务代码注入 Prisma 服务时，使用 `import { PrismaService } from '../prisma.service'`（在api中）。
- 未执行项必须明确标注“未验证”。
