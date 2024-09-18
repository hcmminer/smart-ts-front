import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"

import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <BrowserRouter>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
              <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
                  <App/>
              </GoogleOAuthProvider>
          </ThemeProvider>
      </BrowserRouter>
  </StrictMode>,
)
