import React from 'react'
import { NavLink } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import styled from "styled-components";

const NavUnlisted = styled.li`
  .header-li {     
    li {
     text-decoration: underline;
     text-decoration-thickness: 5px;     
     color: white;  
    }
  }
`;


function Nav() {
  return (
    <div className='header-wrapper'>
    <NavUnlisted>
    <nav>        
    <ul>
        <div className='icon-and-name'>
        <FontAwesomeIcon icon={solid('shield-cat')} size="2x" className="cat-icon"/>
        <li>Adopt Me-ow</li>
        </div>
        <div className='links'>
        <NavLink to="/" className={(navData => (navData.isActive ? "header-li" : 'none'))}><li>Home</li></NavLink>       
        <NavLink to="/adoption" className={(navData => (navData.isActive ? "header-li" : 'none'))}><li>Adoption</li></NavLink>
        <NavLink to="/about" className={(navData => (navData.isActive ? "header-li" : 'none'))}><li>About Us</li></NavLink>
        </div>        
    </ul>
    </nav>
    </NavUnlisted>
    </div>
  )
}

export default Nav