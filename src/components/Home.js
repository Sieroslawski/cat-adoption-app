import React from 'react'
import banner from '../images/banner.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import { NavLink } from 'react-router-dom'

function Home() {
  return (
    <div className="about-wrapper">
      <div className="paws">
        <FontAwesomeIcon icon={solid('paw')} size="4x" className="cat-icon"/>
        <FontAwesomeIcon icon={solid('paw')} size="4x" className="cat-icon"/>     
        <FontAwesomeIcon icon={solid('paw')} size="4x" className="cat-icon"/>     
        <FontAwesomeIcon icon={solid('paw')} size="4x" className="cat-icon"/>
        <FontAwesomeIcon icon={solid('paw')} size="4x" className="cat-icon"/>
        <FontAwesomeIcon icon={solid('paw')} size="4x" className="cat-icon"/>
        </div>
      <img src={banner} id="cat-img" alt="cat-img"></img>
      <div class="centered-btn"><NavLink to="/adoption" className={(navData => (navData.isActive ? "header-li" : 'none'))} id="btn1"><li>View Cats</li></NavLink></div>
      <div class="centered-btn1"> <NavLink to="/login" className={(navData => (navData.isActive ? "header-li" : 'none'))} id="btn2"><li>Login</li></NavLink></div>
    </div>
  )
}

export default Home