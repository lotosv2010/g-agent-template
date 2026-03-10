import type { User } from '@g-agent-template/shared';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type UsersTableCardProps = {
  users: User[];
  loading: boolean;
  pending: boolean;
  error: string | null;
  onView: (id: number) => void;
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
  formatDate: (createdAt: string) => string;
};

export function UsersTableCard({
  users,
  loading,
  pending,
  error,
  onView,
  onEdit,
  onDelete,
  formatDate,
}: UsersTableCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>用户列表</CardTitle>
        <CardDescription>{loading ? '正在加载...' : `共 ${users.length} 条记录`}</CardDescription>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
        ) : null}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>名称</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell className="text-muted-foreground" colSpan={4}>
                  暂无用户数据
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button onClick={() => onView(user.id)} size="sm" type="button" variant="secondary">
                      查看
                    </Button>
                    <Button onClick={() => onEdit(user)} size="sm" type="button" variant="outline">
                      编辑
                    </Button>
                    <Button
                      disabled={pending}
                      onClick={() => onDelete(user.id)}
                      size="sm"
                      type="button"
                      variant="destructive"
                    >
                      删除
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
