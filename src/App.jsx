import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './Home'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="about" element={<About />} /> */}
                <Route path="*" element={<h1>Not Found</h1>} /> 
            </Routes>
        </BrowserRouter>
    )
}

export default App
