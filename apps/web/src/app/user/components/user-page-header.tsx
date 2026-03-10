import { Button } from '@/components/ui/button';

type UserPageHeaderProps = {
  onBack: () => void;
  onRefresh: () => void;
  refreshing: boolean;
  refreshHint: string | null;
};

export function UserPageHeader({ onBack, onRefresh, refreshing, refreshHint }: UserPageHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">用户管理</h1>
        <p className="mt-1 text-sm text-muted-foreground">基于 shadcn/ui 的用户增删改查页面。</p>
        {refreshHint ? <p className="mt-1 text-xs text-muted-foreground">{refreshHint}</p> : null}
      </div>
      <div className="flex gap-2">
        <Button onClick={onBack} type="button" variant="outline">
          返回首页
        </Button>
        <Button disabled={refreshing} onClick={onRefresh} type="button" variant="secondary">
          {refreshing ? '刷新中...' : '刷新列表'}
        </Button>
      </div>
    </header>
  );
}
