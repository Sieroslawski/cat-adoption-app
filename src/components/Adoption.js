import React from 'react'
import * as amplify from './amplify'
import { Button, Card, TextField } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react'
import CreatePostForm from './CreatePostForm'
import PostModal from './PostModal'
import { BiEditAlt } from "react-icons/bi";
import { MdOutlineDeleteForever } from "react-icons/md";

function Adoption() {

  const [posts, setPosts] = useState([])
  const [post, setPost] = useState({})
  const [description, setDescription] = useState("")
  const [updatedDescription, setUpdatedDescription] = useState({})
  const [isUpdateOpen, setIsUpdateOpen] = useState({});
  const [isOpen, setIsOpen] = useState({});
  const [isFormOn, setIsFormOn] = useState(false)

  useEffect(() => {  
    getPosts()
  }, [])

  async function getPosts() {
    const posts = await amplify.getPosts()
    console.log(posts)
    setPosts(posts)
  }

  const deletePost = async (postId) => {    
      const result = await amplify.deletePost(postId)
      const newPosts = posts.filter(item => item.id !== postId)
      setPosts(newPosts)
      console.log(result)  
  }

  const updatePost = async (postId) => {
    const post = posts.find(post => post.id == postId)
    try {
      const updatedPost = await amplify.editPost(postId, updatedDescription[postId])
      post.description = updatedDescription[postId]
      console.log("post.description: " + post.description)
      console.log("updatedPost: " + updatedPost)
      setPosts([...posts])
    } catch (error) {
      console.log(error)
    }
  }

  const showUpdateModal = (postId) => {    
    const oldIsUpdateOpen = isUpdateOpen
    oldIsUpdateOpen[postId] = true
    setIsUpdateOpen({ ...oldIsUpdateOpen })
    console.log({...oldIsUpdateOpen})    
  }
  const hideUpdateModal = (postId) => {
    const oldIsUpdateOpen = isUpdateOpen
    oldIsUpdateOpen[postId] = false
    setIsUpdateOpen({ ...oldIsUpdateOpen })
  };

  const hideModal = (postId) => {
    const oldIsOpen = isOpen
    oldIsOpen[postId] = false
    setIsOpen({ ...oldIsOpen })
  };

  const inputDescription = (postId, e) => {
    const oldDescription = updatedDescription
    oldDescription[postId] = e.target.value
    setUpdatedDescription({ ...oldDescription })
  };

  return (
    
    <div className="App" createOn={() => setIsFormOn(true)} >
      <CreatePostForm></CreatePostForm>
      <section>
      {posts.map(post => (
          <><Card variation="elevated" key={post.id} display="flex" flex-direction="column" align-items="center" backgroundColor="azure" className="card">
          <p>Username: {post.PK.replace("USER#", "")}</p>
          <img src={post.imageUrl} alt="cat-img" className='cat-image' />
          <p>Description: {post.description}</p>
          <p>Like count: {post.likeCount}</p>
          <p>Comment count: {post.commentCount}</p>
          <div className='icons'>
            <BiEditAlt className='edit-icon' onClick={() => showUpdateModal(post.id)} size="50px"></BiEditAlt>
            <MdOutlineDeleteForever className='delete-icon' onClick={() => deletePost(post.id)} size="50px">Delete</MdOutlineDeleteForever>
          </div>
        </Card>
        <PostModal title="Update description" isOpen={isUpdateOpen[post.id]} hideModal={() => hideUpdateModal(post.id)}>
            <div>
              <div className='img-box'>
                <img src={post.imageUrl} alt="My pet"></img>
              </div>
              <TextField label="Description" isMultiline={true}
                onChange={e => inputDescription(post.id, e)}
                className='text-field'
                value={updatedDescription[post.id] || post.description} />
              <Button type="submit" className="submit-btn" onClick={() => updatePost(post.id)}>Update</Button>
            </div>
          </PostModal></>     
        ))}
         
      </section>
  </div> 
  )
}

export default Adoption