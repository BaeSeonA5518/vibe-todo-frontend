import { useCallback, useEffect, useState } from 'react'
import {
  createTodo,
  deleteTodo,
  fetchTodos,
  updateTodo,
} from './api/todos'
// .env VITE_API_BASE_URL (호스트만 또는 .../todos). 실제 todo 요청은 TODOS_API_ROOT
import { API_BASE_URL } from './apiBaseUrl'
import './App.css'

function formatDate(iso) {
  if (!iso) return ''
  try {
    const d = new Date(iso)
    return d.toLocaleString('ko-KR', {
      dateStyle: 'short',
      timeStyle: 'short',
    })
  } catch {
    return ''
  }
}

export default function App() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newTitle, setNewTitle] = useState('')
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const loadTodos = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const list = await fetchTodos()
      setTodos(Array.isArray(list) ? list : [])
    } catch (e) {
      setError(e.message || '목록을 불러오지 못했습니다.')
      setTodos([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTodos()
  }, [loadTodos])

  async function handleAdd(e) {
    e.preventDefault()
    const title = newTitle.trim()
    if (!title || saving) return
    setSaving(true)
    setError(null)
    try {
      const created = await createTodo(title)
      setTodos((prev) => [created, ...prev])
      setNewTitle('')
    } catch (e) {
      setError(e.message || '추가하지 못했습니다.')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(todo) {
    setEditingId(todo._id)
    setEditTitle(todo.title ?? '')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditTitle('')
  }

  async function handleSaveEdit(id) {
    const title = editTitle.trim()
    if (!title) {
      setError('제목을 입력하세요.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const updated = await updateTodo(id, title)
      setTodos((prev) =>
        prev.map((t) => (t._id === id ? { ...t, ...updated } : t)),
      )
      cancelEdit()
    } catch (e) {
      setError(e.message || '수정하지 못했습니다.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('이 할 일을 삭제할까요?')) return
    setError(null)
    try {
      await deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t._id !== id))
      if (editingId === id) cancelEdit()
    } catch (e) {
      setError(e.message || '삭제하지 못했습니다.')
    }
  }

  return (
    <div className="app" data-api-base={API_BASE_URL}>
      <h1>할 일</h1>

      {error ? (
        <div className="banner error" role="alert">
          {error}
        </div>
      ) : null}

      <form className="form-add" onSubmit={handleAdd}>
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="새 할 일"
          aria-label="새 할 일"
          autoComplete="off"
        />
        <button type="submit" disabled={saving || !newTitle.trim()}>
          추가
        </button>
      </form>

      {loading ? (
        <p className="loading">불러오는 중…</p>
      ) : todos.length === 0 ? (
        <p className="empty">할 일이 없습니다. 위에서 추가해 보세요.</p>
      ) : (
        <ul className="list">
          {todos.map((todo) => (
            <li key={todo._id} className="item">
              {editingId === todo._id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    aria-label="할 일 수정"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') cancelEdit()
                      if (e.key === 'Enter') handleSaveEdit(todo._id)
                    }}
                  />
                  <div className="edit-actions">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => handleSaveEdit(todo._id)}
                      disabled={saving}
                    >
                      저장
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={cancelEdit}
                      disabled={saving}
                    >
                      취소
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="item-title">
                    {todo.title}
                    {todo.createdAt ? (
                      <div className="item-meta">
                        {formatDate(todo.createdAt)}
                      </div>
                    ) : null}
                  </div>
                  <div className="item-actions">
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => startEdit(todo)}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      className="btn-ghost btn-danger"
                      onClick={() => handleDelete(todo._id)}
                    >
                      삭제
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
