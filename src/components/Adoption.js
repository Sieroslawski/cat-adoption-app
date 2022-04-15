import React from 'react'
import * as amplify from './amplify'
import { Button, Card, Divider, TextField, Flex } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react'
import CreatePostForm from './CreatePostForm'
import PostModal from './PostModal'
import "bootstrap/dist/css/bootstrap.min.css";
import { BiEditAlt } from "react-icons/bi";
import { MdOutlineDeleteForever } from "react-icons/md";

function Adoption() {

  const [posts, setPosts] = useState([])
  const [post, setPost] = useState({})
  const [description, setDescription] = useState("")
  const [comment, setComment] = useState({})
  const [comments, setComments] = useState({})
  const [updatedDescription, setUpdatedDescription] = useState({})
  const [isUpdateOpen, setIsUpdateOpen] = useState({});
  const [isOpen, setIsOpen] = useState({});
  const [isFormOn, setIsFormOn] = useState(false)
  const [text, setText] = useState({})

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

  const inputText = (postId, e) => {
    const oldText = text
    oldText[postId] = e.target.value
    setText({...oldText})
  }

  const createComment = async(postId) => {
    try {
      const result = await amplify.createComment(postId, text[postId])
      console.log(result)
      const oldComment = comment
      oldComment[postId] = result
      console.log(oldComment)
      setComment({...oldComment})
      const post = posts.find(post => post.id == postId)
      post.commentCount += 1
      setPosts([...posts])
      setText({})
    } catch {
      console.log("You cannot comment.")
    }
  }

  const getComments = async(postId) => {
    const result = await amplify.getComments(postId)
    console.log(result)
    const oldComments = comments
    oldComments[postId] = result
    setComments({...oldComments})
    const oldIsOpen = isOpen
    oldIsOpen[postId] = true
    setIsOpen({...oldIsOpen})
  }

  const inputDescription = (postId, e) => {
    const oldDescription = updatedDescription
    oldDescription[postId] = e.target.value
    setUpdatedDescription({ ...oldDescription })
  };

  return (
    
    <div className="App" createOn={() => setIsFormOn(true)} >
      <CreatePostForm></CreatePostForm>
      <section>
      {posts.map((post) => <div key={post.id} className="cat-card">
          <><Card variation="elevated" key={post.id} display="flex" flex-direction="column" align-items="center" backgroundColor="azure" className="card">
          <div className='edit-delete-btns'>
          <BiEditAlt className='edit-icon' onClick={() => showUpdateModal(post.id)} size="50px" id="edit"></BiEditAlt>
          <MdOutlineDeleteForever className='delete-icon' onClick={() => deletePost(post.id)} size="50px" id="delete">Delete</MdOutlineDeleteForever>
          </div>
          <p>Username: {post.PK.replace("USER#", "")}</p>
          <img src={post.imageUrl} alt="cat-img" className='cat-image' />
          <p>Description: {post.description}</p>         
          <p>Comment count: {post.commentCount}</p>
          {post.commentCount > 0 && <Button variation='link' onClick={() => getComments(post.id)}>View {post.commentCount} Comments</Button>}
          <Flex>
              <TextField label="Default" labelHidden={true} placeholder="Add a comment"
              onChange={e => inputText(post.id, e)} value={text[post.id] || ""}
              outerEndComponent={<Button onClick={() => createComment(post.id)} disabled={!text[post.id]}>Comment</Button>}/>
          </Flex>
          <div className='icons'>           
          </div>
        </Card>
        <PostModal title="Update your post" isOpen={isUpdateOpen[post.id]} hideModal={() => hideUpdateModal(post.id)}>
            <div>
              <div className='img-box'>
                <img src={post.imageUrl} alt="My pet"></img>
              </div>
              <TextField label="Description" isMultiline={true}
                onChange={e => inputDescription(post.id, e)}
                className='text-field'
                value={updatedDescription[post.id] || ""} />
              <Button type="submit" className="submit-btn" onClick={() => updatePost(post.id)}>Update</Button>
              
            </div>                    
          </PostModal>                                 
          <PostModal title="See all comments" isOpen={isOpen[post.id]} hideModal={() => hideModal(post.id)}>
            {comments[post.id] && comments[post.id].map((comment, index) => 
            <><p key={index}>{comment.username}: {comment.text}</p><Divider size="small" /></>
            )}
          </PostModal>           
          </>
          </div>
        )}         
      </section>
  </div> 
  )
}

export default Adoption