import { useState, useEffect } from 'react'
import { Button, TextField } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import * as amplify from './amplify'

export default function CreatePostForm() {

    const [catText, setCatText] = useState("")      

    const [file, setFile] = useState()
    // const [imgUrl, setImgUrl] = useState([localStorage.getItem('imgUrl')])
      
    // useEffect(() => {
    // //   localStorage.setItem('imgUrl', imgUrl)
    // })
             
    const fileSelected = event => {
      const file = event.target.files[0]
          setFile(file)    
      }
  
    const createPost = async (e) => {        
        e.preventDefault()
        try {
            const post = await amplify.createPost(catText, file)
            console.log("successfully created a cat")
            // redirect to the other page with al the cats or something maybe
            // tell the other ccomponent this was succefssfull
        } catch (error) {
            console.log("error uploading a cat", error)
        }
        // const url = await amplify.getImage(result.key)      
        // setImgUrl(url)             
      }

    return (
    <div className='form'>
        <form onSubmit={createPost}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <TextField onChange={e => setCatText(e.target.value)} type="text" wrap="nowrap" direction="column" descriptiveText="Enter a post" width="auto"/>           
        <Button type="submit" className="button">Create Post</Button>    
        </form>
    </div>
  )
}