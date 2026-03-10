import type { User } from '@g-agent-template/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type UserViewDialogProps = {
  open: boolean;
  user: User | null;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  formatDate: (createdAt: string) => string;
};

export function UserViewDialog({ open, user, onOpenChange, onClose, formatDate }: UserViewDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>用户详情</DialogTitle>
          <DialogDescription>查看单个用户的最新信息。</DialogDescription>
        </DialogHeader>
        {user ? (
          <div className="space-y-2">
            <Badge variant="secondary">ID: {user.id}</Badge>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-muted-foreground">创建时间：{formatDate(user.createdAt)}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">暂无详情数据。</p>
        )}
        <DialogFooter>
          <Button onClick={onClose} type="button" variant="outline">
            关闭
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
