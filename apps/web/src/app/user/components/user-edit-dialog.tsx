import type { User } from '@g-agent-template/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type UserEditDialogProps = {
  open: boolean;
  user: User | null;
  pending: boolean;
  editingName: string;
  onOpenChange: (open: boolean) => void;
  onNameChange: (value: string) => void;
  onCancel: () => void;
  onSave: () => void;
};

export function UserEditDialog({
  open,
  user,
  pending,
  editingName,
  onOpenChange,
  onNameChange,
  onCancel,
  onSave,
}: UserEditDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>编辑用户</DialogTitle>
          <DialogDescription>修改名称并保存。</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {user ? <Badge variant="secondary">ID: {user.id}</Badge> : null}
          <Input
            className="h-10"
            onChange={(event) => onNameChange(event.target.value)}
            placeholder="请输入用户名"
            value={editingName}
          />
        </div>
        <DialogFooter>
          <Button onClick={onCancel} type="button" variant="outline">
            取消
          </Button>
          <Button disabled={pending || !user} onClick={onSave} type="button">
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
