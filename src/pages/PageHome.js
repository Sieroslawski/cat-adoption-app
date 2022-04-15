import React from 'react'
import Home from '../components/Home';
import Nav from '../components/Nav'
import Footer from '../components/Footer';

function PageHome() {
  return (
    <div className='app'>
        <Nav/>
        <Home/>
        <Footer/>
    </div>
  )
}

export default PageHome