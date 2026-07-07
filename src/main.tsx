import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { autoGenerateIcons } from './utils/generateIcons'

// تلقائياً توليد أيقونات الهاتف المحمول عند التطوير
if (import.meta.env.DEV) {
  autoGenerateIcons();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

