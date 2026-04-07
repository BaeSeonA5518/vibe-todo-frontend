import { API_BASE_URL } from '../apiBaseUrl.js'

async function handleResponse(res) {
  if (res.status === 204) return null
  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      throw new Error(text || 'Invalid response')
    }
  }
  if (!res.ok) {
    throw new Error(data?.error || `요청 실패 (${res.status})`)
  }
  return data
}

export function getTodosUrl(path = '') {
  return `${API_BASE_URL}/todos${path}`
}

export async function fetchTodos() {
  const res = await fetch(getTodosUrl())
  return handleResponse(res)
}

export async function createTodo(title) {
  const res = await fetch(getTodosUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  return handleResponse(res)
}

export async function updateTodo(id, title) {
  const res = await fetch(getTodosUrl(`/${id}`), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  return handleResponse(res)
}

export async function deleteTodo(id) {
  const res = await fetch(getTodosUrl(`/${id}`), {
    method: 'DELETE',
  })
  return handleResponse(res)
}
