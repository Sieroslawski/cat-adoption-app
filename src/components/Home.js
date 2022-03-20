import React from 'react'
import banner from '../images/banner.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'
import styled from "styled-components";

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
    </div>
  )
}

export default Home