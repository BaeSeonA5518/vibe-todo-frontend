/** 기본: Render 호스트. .env의 VITE_API_BASE_URL은 호스트만 또는 .../todos 까지 모두 가능 */
const DEPLOYED_API_BASE = 'https://vibe-todo-backend-nwuh.onrender.com'

const raw = String(
  import.meta.env.VITE_API_BASE_URL || DEPLOYED_API_BASE,
).replace(/\/+$/, '')

/** 화면·디버그용: .env에 넣은 값(끝 슬래시 제거) */
export const API_BASE_URL = raw

/** 실제 /todos 요청 prefix — 이미 .../todos 로 끝나면 그대로, 아니면 /todos 붙임 */
export const TODOS_API_ROOT = raw.endsWith('/todos') ? raw : `${raw}/todos`
