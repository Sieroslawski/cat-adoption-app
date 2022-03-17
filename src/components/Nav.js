import React from 'react'
import { NavLink } from 'react-router-dom'


function Nav() {
  return (
    <div className='header-wrapper'>
         <nav>
    <ul>    
        <NavLink to="/" ><li>Home</li></NavLink>
        <NavLink to="/about"><li>About Us</li></NavLink>
        <NavLink to="/adoption"><li>Adoption</li></NavLink>
    </ul>
    </nav>
    </div>
  )
}

export default Nav