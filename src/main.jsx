import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"

import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

                  <App/>

          </ThemeProvider>
      </BrowserRouter>
  </StrictMode>,
)
