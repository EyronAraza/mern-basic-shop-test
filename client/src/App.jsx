import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Signup from './Signup'
import Login from './Login'
import Home from './Home'
import Cart from './Cart'
import NoPage from './NoPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GlobalProvider } from './components/GlobalContext'

function App() {
  // Write HTML code here
  return (
    <GlobalProvider>
      <BrowserRouter>
        {/* Creating routes, basically the going to the pages, element parameter represents jsx files of pages */}
        <Routes>
          {/* To go to these pages, type "http://localhost:5173/register" after running the server, next to the local host url, just type the path for example "/register" */}
          <Route index element={<Login />}></Route>
          <Route path='/register' element={<Signup />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/home' element={<Home />}></Route>
          <Route path='/cart' element={<Cart />}></Route>
          <Route path='*' element={<NoPage />}></Route>
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  )
}

export default App
