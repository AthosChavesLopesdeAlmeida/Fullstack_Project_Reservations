export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token')
  return fetch(path, {
  ...options,
  headers: {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  }
})
}