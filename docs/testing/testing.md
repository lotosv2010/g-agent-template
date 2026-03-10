# 测试文档

## 最低验证
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`

## 数据库相关验证
- `pnpm db:generate`
- `pnpm db:push`

## 回归建议
- 接口回归：
  - `GET /users`
  - `GET /users/:id`
  - `POST /users`
  - `PATCH /users/:id`
  - `DELETE /users/:id`
- 页面回归：
  - `/` 可正常进入 `/user`
  - `/user` 创建、编辑、删除、查看详情可用
  - 错误信息可见且不会阻塞后续正常请求
- 契约回归：
  - `User.id` 为 `number` 时，API、shared、Web 类型保持一致
