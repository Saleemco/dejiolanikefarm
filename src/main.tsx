// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { Toaster } from 'sonner'
// import './index.css'
// import App from './App'  // Changed from './HomePage' to './App'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//     <Toaster position="top-center" richColors />
//   </StrictMode>,
// )


import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('🚀 App starting...');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)