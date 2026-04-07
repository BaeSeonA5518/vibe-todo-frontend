/** 기본: Render 배포 주소. 로컬 백엔드는 .env에 VITE_API_BASE_URL=http://localhost:5000 */
const DEPLOYED_API_BASE = 'https://vibe-todo-backend-nwuh.onrender.com'

export const API_BASE_URL = String(
  import.meta.env.VITE_API_BASE_URL || DEPLOYED_API_BASE,
).replace(/\/$/, '')
