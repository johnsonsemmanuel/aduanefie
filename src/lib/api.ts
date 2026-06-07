const API_BASE = import.meta.env.VITE_API_URL || 'https://aduanefie-backend-production.up.railway.app/api'

interface RequestOptions {
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('aduanefie_token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: res.statusText }))
    throw new ApiError(data.error || 'Request failed', res.status)
  }

  return res.json()
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body }),
  patch: <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH', body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}

export interface UserDto {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

export interface AuthResponse {
  token: string
  user: UserDto
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),

  register: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post<AuthResponse>('/auth/register', data),

  me: () => api.get<UserDto>('/auth/me'),
}

export interface CommodityDto {
  id: string
  name: string
  category: string
  unit: string
  image?: string
}

export const commodityApi = {
  list: () => api.get<CommodityDto[]>('/commodities'),
  get: (id: string) => api.get<CommodityDto>(`/commodities/${id}`),
}

export interface OpportunityDto {
  id: string
  type: 'buy' | 'sell'
  quantity: string
  unit: string
  price: string
  totalValue: string
  location: string
  deliveryDate?: string
  status: string
  quality?: string
  description?: string
  createdAt: string
  userId: string
  commodityId: string
  user: { id: string; name: string; avatar?: string }
  commodity: { id: string; name: string; category: string; image?: string }
}

export const opportunityApi = {
  list: (params?: { type?: string; status?: string }) => {
    const query = new URLSearchParams()
    if (params?.type) query.set('type', params.type)
    if (params?.status) query.set('status', params.status)
    const qs = query.toString()
    return api.get<OpportunityDto[]>(`/opportunities${qs ? `?${qs}` : ''}`)
  },
  get: (id: string) => api.get<OpportunityDto>(`/opportunities/${id}`),
  create: (data: {
    commodityId: string
    type: 'buy' | 'sell'
    quantity: number
    unit: string
    price: number
    location: string
    description?: string
    quality?: string
    deliveryDate?: string
  }) => api.post<OpportunityDto>('/opportunities', data),
}

export interface OrderDto {
  id: string
  orderNumber: string
  quantity: string
  unit: string
  price: string
  total: string
  status: string
  paymentStatus: string
  deliveryDate?: string
  createdAt: string
}

export const orderApi = {
  list: () => api.get<OrderDto[]>('/orders'),
  get: (id: string) => api.get<OrderDto>(`/orders/${id}`),
  create: (data: { opportunityId: string; quantity: number }) =>
    api.post<OrderDto>('/orders', data),
  updateStatus: (id: string, status: string) =>
    api.patch<OrderDto>(`/orders/${id}/status`, { status }),
}
