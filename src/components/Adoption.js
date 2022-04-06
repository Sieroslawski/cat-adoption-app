import React from 'react'
import * as amplify from './amplify'
import { Button, Card } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react'
import CreatePostForm from './CreatePostForm'

function Adoption() {

  const [posts, setPosts] = useState([])

  useEffect(() => {  
    getPosts()
  }, [])

  async function getPosts() {
    const posts = await amplify.getPosts()
    console.log(posts)
    setPosts(posts)
  }

  const deletePost = async (post) => {
    await amplify.deletePost(post)
    await getPosts()
  }

  return (
    <div className="App">
      <CreatePostForm></CreatePostForm>
     {posts.map(post => (
        <Card variation="elevated" key={post.id} display="flex" flex-direction="column" align-items="center" backgroundColor="azure" className="card">        
          <p>Username: {post.PK.replace("USER#", "")}</p>
          <img src={post.imageUrl} alt ="cat-img"/>
          <p>Description: {post.description}</p>  
          <p>Like count: {post.likeCount}</p>
          <p>Comment count: {post.commentCount}</p>                    
          <Button onClick={() => deletePost(post.id)}>🗑️</Button>
        </Card> 
      ))}             
  </div>
  )
}

export default Adoption