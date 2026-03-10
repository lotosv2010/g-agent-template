'use client';

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-16">
      <Card className="w-full border-2 border-primary/20 bg-card/90 backdrop-blur">
        <CardHeader className="space-y-4">
          <Badge className="w-fit" variant="secondary">
            欢迎使用
          </Badge>
          <CardTitle className="text-4xl font-black tracking-tight sm:text-5xl">
            Solo Fullstack Demo
          </CardTitle>
          <CardDescription className="max-w-2xl text-base leading-7">
            这是首页欢迎页。用户管理功能已迁移到独立路由，你可以在用户页面完成增删改查。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="destructive" onClick={() => router.push('/user')} size="lg" type="button">
            进入用户管理
          </Button>
          <Button
            onClick={() => window.open('http://localhost:3001/health', '_blank')}
            size="lg"
            type="button"
            variant="outline"
          >
            查看 API 健康检查
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
