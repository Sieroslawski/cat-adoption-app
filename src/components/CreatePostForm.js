import { useState, useEffect } from 'react'
import { Button, TextField } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import * as amplify from './amplify'

export default function CreatePostForm() {

    const [catText, setCatText] = useState("")      
    const [file, setFile] = useState()
    const [posts, setPosts] = useState([])
    const [description, setDescription] = useState("")
    const [post, setPost] = useState({})

    const fileSelected = event => {
      const file = event.target.files[0]
          setFile(file)    
      }

      function refreshPage() {
        window.location.reload(false)
      }
  
    const createPost = async (e) => {        
        e.preventDefault()
        try {
            const post = await amplify.createPost(catText, file)
            const newPost = post
            newPost["imageUrl"] = await amplify.getImage(post.imageName)
            setPost({...newPost})           
            setPosts([newPost, ...posts])
            setDescription("")
            console.log("successfully created a cat")
            refreshPage()
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
        <h2>Post a cat! 🐱</h2>      
        <form onSubmit={createPost}>
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <TextField isMultiline={true} onChange={e => setCatText(e.target.value)} type="text" wrap="nowrap" direction="column" width="auto"/>           
        <Button type="submit" className="button" disabled={!catText}>Create Post</Button>    
        </form>
    </div>
  )
}