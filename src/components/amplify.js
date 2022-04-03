import Amplify, { API, Storage } from "aws-amplify"
import awsExports from "./aws-exports"

Amplify.configure(awsExports)

const apiName = 'projectAPI'

function randomString(bytes = 16) {
  return Array.from(crypto.getRandomValues(new Uint8Array(bytes))).map(b => b.toString(16)).join("")
}

export async function getPosts() {
  const path = '/posts' 
  const result = await API.get(apiName, path)
  return await Promise.all(result.Items.map(async item => {
    const imageUrl = await Storage.get(item.imageName);
    return {
      ...item,
      imageUrl
    }
  }))
}

export async function getComments(postId) {
  const path = `/posts/${postId}/comments`
  const comments = await API.get(apiName, path)
  return comments.Items
}

export async function createPost(description, file) {
  const { key } = await Storage.put(randomString(), file);
  const path = '/posts' 
  const result = await API.post(apiName, path, {
    body: { 
      imageName: key,
      description
    }
  })
  console.log(result)
  return result
}

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