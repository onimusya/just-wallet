//import '@telegram-apps/telegram-ui/dist/styles.css'
import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AppRoot } from '@telegram-apps/telegram-ui'

//import { setBackgroundAsSecondary } from './lib/setBackgroundAsSecondary'

//setBackgroundAsSecondary();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      <App />
    
  </StrictMode>,
)
