import React from 'react'
import * as amplify from './amplify'
import { useEffect, useState } from 'react'

function Adoption() {
  const [file, setFile] = useState()
  const [imgUrl, setImgUrl] = useState(localStorage.getItem('imgUrl'))

  useEffect(() => {
    localStorage.setItem('imgUrl', imgUrl)
  })

  
  const uploadImage = async event => {
    event.preventDefault()
    const result = await amplify.uploadImage(file)
    const url = await amplify.getImage(result.key)    
    setImgUrl(url)
  }

  
  const fileSelected = event => {
    const file = event.target.files[0]
		setFile(file)    
	}


  return (
    <div className="App">
    <form onSubmit={uploadImage}>
    <input onChange={fileSelected} type="file" accept="image/*"></input>
      <button type="submit">Upload</button>
    </form>
    <div className='cat-img'>    
    {imgUrl && <img src={imgUrl}/>}
    </div>
  </div>
  )
}

export default Adoption