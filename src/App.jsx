import React,{ useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { Footer, Header } from './Index'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
    <Header />
    <Outlet />
    <Footer />
    </>
  )
}

export default App
