'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@g-agent-template/shared';
import { dedupeById } from '@g-agent-template/shared';
import { UserCreateCard } from './components/user-create-card';
import { UserEditDialog } from './components/user-edit-dialog';
import { UserPageHeader } from './components/user-page-header';
import { UserViewDialog } from './components/user-view-dialog';
import { UsersTableCard } from './components/users-table-card';
import { createUser, deleteUser, fetchUser, fetchUsers, updateUser } from '@/lib/api-client';

function formatDate(createdAt: string) {
  try {
    return new Date(createdAt).toLocaleString();
  } catch {
    return createdAt;
  }
}

export default function UserPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [createName, setCreateName] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingName, setEditingName] = useState('');
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshHint, setRefreshHint] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void refreshUsers();
  }, []);

  async function refreshUsers() {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(dedupeById(data));
      setError(null);
      return true;
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '加载用户失败');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    setRefreshing(true);
    const success = await refreshUsers();
    const time = new Date().toLocaleTimeString();
    setRefreshHint(success ? `已刷新：${time}` : `刷新失败：${time}`);
    setRefreshing(false);
  }

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = createName.trim();

    if (!name) {
      setError('用户名不能为空');
      return;
    }

    try {
      setPending(true);
      const created = await createUser({ name });
      setUsers((prev) => dedupeById([created, ...prev]));
      setCreateName('');
      setError(null);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : '创建失败');
    } finally {
      setPending(false);
    }
  }

  function startEdit(user: User) {
    setEditingUser(user);
    setEditingName(user.name);
    setError(null);
  }

  function cancelEdit() {
    setEditingUser(null);
    setEditingName('');
  }

  async function saveEdit() {
    if (!editingUser) {
      return;
    }

    const name = editingName.trim();

    if (!name) {
      setError('用户名不能为空');
      return;
    }

    try {
      setPending(true);
      const updated = await updateUser(editingUser.id, { name });
      setUsers((prev) => prev.map((item) => (item.id === editingUser.id ? updated : item)));
      if (viewingUser?.id === updated.id) {
        setViewingUser(updated);
      }
      cancelEdit();
      setError(null);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : '更新失败');
    } finally {
      setPending(false);
    }
  }

  async function removeUser(id: number) {
    try {
      setPending(true);
      await deleteUser(id);
      setUsers((prev) => prev.filter((item) => item.id !== id));
      if (viewingUser?.id === id) {
        setViewingUser(null);
        setViewOpen(false);
      }
      if (editingUser?.id === id) {
        cancelEdit();
      }
      setError(null);
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : '删除失败');
    } finally {
      setPending(false);
    }
  }

  async function viewUser(id: number) {
    try {
      const detail = await fetchUser(id);
      setUsers((prev) => prev.map((item) => (item.id === id ? detail : item)));
      setViewingUser(detail);
      setViewOpen(true);
      setError(null);
    } catch (detailError) {
      setError(detailError instanceof Error ? detailError.message : '读取详情失败');
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <UserPageHeader
        onBack={() => router.push('/')}
        onRefresh={() => void handleRefresh()}
        refreshHint={refreshHint}
        refreshing={refreshing}
      />

      <UserCreateCard
        createName={createName}
        onCreateNameChange={setCreateName}
        onSubmit={handleCreate}
        pending={pending}
      />

      <UsersTableCard
        error={error}
        formatDate={formatDate}
        loading={loading}
        onDelete={(id) => void removeUser(id)}
        onEdit={startEdit}
        onView={(id) => void viewUser(id)}
        pending={pending}
        users={users}
      />

      <UserViewDialog
        formatDate={formatDate}
        onClose={() => {
          setViewOpen(false);
          setViewingUser(null);
        }}
        onOpenChange={(open) => {
          setViewOpen(open);
          if (!open) {
            setViewingUser(null);
          }
        }}
        open={viewOpen}
        user={viewingUser}
      />

      <UserEditDialog
        editingName={editingName}
        onCancel={cancelEdit}
        onNameChange={setEditingName}
        onOpenChange={(open) => {
          if (!open) {
            cancelEdit();
          }
        }}
        onSave={() => void saveEdit()}
        open={Boolean(editingUser)}
        pending={pending}
        user={editingUser}
      />
    </main>
  );
}
