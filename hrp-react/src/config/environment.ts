const API_BASE_URL = import.meta.env.MODE === 'production'
  ? '/api'  // Use absolute path in production
  : '/api'  // Vite proxy handles routing in development

const CLIENT_BASE_URL = import.meta.env.MODE === 'production'
  ? window.location.origin
  : 'http://localhost:5173'

const SERVER_BASE_URL = import.meta.env.MODE === 'production'
  ? '/api'
  : 'http://localhost:5000'

export const config = {
  apiBaseUrl: API_BASE_URL,
  clientBaseUrl: CLIENT_BASE_URL,
  serverBaseUrl: SERVER_BASE_URL,
  isDevelopment: import.meta.env.MODE === 'development',
  isProduction: import.meta.env.MODE === 'production',
  env: import.meta.env.MODE,
}
