import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { About, Cart, FarmerProducts, Home, LoginForm, Orders, ProductForm, ProductPage, SignUpForm, WeatherPage } from './Index.js'
import { Provider } from 'react-redux'
import store from './store/Store.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
     {
      path: '/',
      element: <Home />
     },
      {
        path: '/add-product',
        element: <ProductForm />
      },
      {
        path: '/product/:productID',
        element: <ProductPage />
      },
      {
        path: '/my-products',
        element: <FarmerProducts />
      },
      {
        path: '/cart',
        element: <Cart />
      },
      {
        path : '/orders',
        element: <Orders />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/weather',
        element: <WeatherPage />
      }
    ]
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/signup-form',
    element: <SignUpForm />
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>,
)
