import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type UserCreateCardProps = {
  createName: string;
  pending: boolean;
  onCreateNameChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function UserCreateCard({ createName, pending, onCreateNameChange, onSubmit }: UserCreateCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>新增用户</CardTitle>
        <CardDescription>输入名称并提交。</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={onSubmit}>
          <Input onChange={(event) => onCreateNameChange(event.target.value)} placeholder="例如：Robin" value={createName} />
          <Button disabled={pending} type="submit">
            创建
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
