import Amplify, { API, Storage } from "aws-amplify"
import awsExports from "./aws-exports"

Amplify.configure(awsExports)

const apiName = 'catPosts'

function randomString(bytes = 16) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes))).map(b => b.toString(16)).join("")
}

// For Images -----

export async function uploadImage(file) {
  const result = await Storage.put(randomString(), file);
  console.log("upload image result: " +  result)
  return result
  }

export async function getImage(name) {
  const url = await Storage.get(name);
  console.log("get image result: " + url);
  return url;
  }
  
//For posts -----
//Get all posts
export async function getPosts() {
  const path = '/posts' 
  const result = await API.get(apiName, path)
  return await Promise.all(result.Items.map(async item => {
    const imageUrl = await Storage.get(item.imageName);
    return {
      ...item,
      imageUrl,
    }
  }))
}
//Get all comments
export async function getComments(postId) {
  const path = `/posts/${postId}/comments`
  const comments = await API.get(apiName, path)
  return comments.Items
}

//Create a post
export async function createPost(catText, file) {
  const { key } = await Storage.put(randomString(), file);
  const path = '/posts' 
  const result = await API.post(apiName, path, {
    body: { 
      imageName: key,
      catText
    }
  })
  console.log(result)
  return result
}
//Create a comment
export async function createComment(postId, text) {
  const path = `/posts/${postId}/comments`
  const result = await API.post(apiName, path, {
    body: { 
      text
    }
  })
  console.log(result)
  return result
}

//Edit a post
export async function editPost(postId, description) {
  const path = `/posts/${postId}`
  console.log(path)
  const result = await API.patch(apiName,path, {
    body: {postId, description}
  })
  console.log(result)
  return result.description
}

//Edit a comment
export async function editComment(postId, text) {
  const path = `/posts/${postId}/comments`
  console.log(path)
  const result = await API.patch(apiName,path, {
    body: {postId, text}
  })
  console.log(result)
  return result.text
}

//Delete a post
export async function deletePost(postId) {
  const path = `/posts/${postId}`
  console.log("Path: " + path)
  const result = await API.del(apiName,path)
  console.log("Delete result: " + result)
  return result
}

//Delete a comment
export async function deleteComment(postId) {
  const path = `/posts/${postId}/comments`
  const result = await API.del(apiName,path, {
    body: {postId}
  })  
  return result
}