import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PageHome from '../pages/PageHome';
import PageAbout from '../pages/PageAbout';
import PageAdoption from '../pages/PageAdoption';
import PageError from '../pages/PageError';
import PageLogin from '../pages/PageLogin';


function AppRouter() {
  return (
    <BrowserRouter>
    <Routes> 
        <Route path="/" element={<PageHome/>}/>
        <Route path="/about" element={<PageAbout/>}/>
        <Route path="/adoption" element={<PageAdoption/>}/>
        <Route path="/login" element={<PageLogin/>}/>
        <Route path="*" element={<PageError/>}/>        
    </Routes>
    </BrowserRouter>
  )
}

export default AppRouter