import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './Login'
import Admin from './Admin'
import Guest from './Guest'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/guest" element={<Guest />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
