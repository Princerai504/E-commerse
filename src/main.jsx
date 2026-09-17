import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'
import CartProvider from './context/CartContext'
import AuthProvider from './context/AuthContext'
import ProductProvider from './context/ProductContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <CartProvider>
        <AuthProvider>
          <ProductProvider>
            <App />
          </ProductProvider>
        </AuthProvider>
      </CartProvider>
    </ThemeProvider>
  </StrictMode>,
);