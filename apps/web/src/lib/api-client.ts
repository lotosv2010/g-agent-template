import type { CreateUserDto, User } from '@g-agent-template/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

/**
 * API 错误响应类型
 */
interface ApiErrorResponse {
  message?: string | string[];
}

/**
 * 从响应中提取错误信息
 */
async function getErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const payload = (await response.json()) as ApiErrorResponse;

    if (Array.isArray(payload.message)) {
      return payload.message.join('; ');
    }

    if (typeof payload.message === 'string') {
      return payload.message;
    }

    return fallback;
  } catch {
    return fallback;
  }
}

/**
 * 通用 fetch 包装器
 * @param url - 请求路径（相对于 API_BASE_URL）
 * @param options - fetch 选项
 * @param errorMessage - 错误时的提示信息
 */
async function fetchApi<T>(
  url: string,
  options?: RequestInit,
  errorMessage: string = 'request failed'
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response, errorMessage));
  }

  // 处理 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

// ==================== API 端点 ====================

/**
 * 获取 API 信息
 */
export async function fetchApiInfo(): Promise<Record<string, unknown>> {
  return fetchApi<Record<string, unknown>>('/', undefined, 'failed to fetch api info');
}

/**
 * 获取所有用户
 */
export async function fetchUsers(): Promise<User[]> {
  return fetchApi<User[]>('/users', undefined, 'failed to fetch users');
}

/**
 * 获取单个用户
 */
export async function fetchUser(id: number): Promise<User> {
  return fetchApi<User>(`/users/${id}`, undefined, 'failed to fetch user');
}

/**
 * 创建用户
 */
export async function createUser(payload: CreateUserDto): Promise<User> {
  return fetchApi<User>(
    '/users',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
    'failed to create user'
  );
}

/**
 * 更新用户
 */
export async function updateUser(id: number, payload: Partial<CreateUserDto>): Promise<User> {
  return fetchApi<User>(
    `/users/${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
    'failed to update user'
  );
}

/**
 * 删除用户
 */
export async function deleteUser(id: number): Promise<void> {
  return fetchApi<void>(
    `/users/${id}`,
    {
      method: 'DELETE',
    },
    'failed to delete user'
  );
}
