/* Amplify Params - DO NOT EDIT
	AUTH_CATPOSTSBACKENDED39326F_USERPOOLID
	ENV
	REGION
	STORAGE_CATADOPTIONDB_ARN
	STORAGE_CATADOPTIONDB_NAME
	STORAGE_CATADOPTIONDB_STREAMARN
Amplify Params - DO NOT EDIT */const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const database = require('/opt/database')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

const AWS = require('aws-sdk')

async function getAuthUser(req) {
  const authProvider = req.apiGateway.event.requestContext.identity.cognitoAuthenticationProvider
  console.log({authProvider})
  if (!authProvider) {
    return
  }
  const parts = authProvider.split(':');
  const poolIdParts = parts[parts.length - 3];
  if (!poolIdParts) {
    return 
  }
  const userPoolIdParts = poolIdParts.split('/');

  const userPoolId = userPoolIdParts[userPoolIdParts.length - 1];
  const userPoolUserId = parts[parts.length - 1];

  const cognito = new AWS.CognitoIdentityServiceProvider();
  const listUsersResponse = await cognito.listUsers({
      UserPoolId: userPoolId,
      Filter: `sub = "${userPoolUserId}"`,
      Limit: 1,
    }).promise();

  const user = listUsersResponse.Users[0];
  return user
}

//Get all posts
app.get('/posts', async (req, res) => {
  // Add your code here
  try {
    const authUser = await getAuthUser(req)
    let posts = await database.getPosts(authUser.Username)
    posts.Items = posts.Items.map(post => {
      return {
        ...post,
        id: post.SK.replace("POST#", "")
      }
    })
    res.send(posts)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
});

//Get all comments
app.get('/posts/:id/comments', async (req, res) => {
  const postId = req.params.id   
  try {
    let comments = await database.getComments(postId)
    comments.Items = comments.Items.map(comment => {
      return {
        ...comment,
        id: comment.SK.replace("COMMENT#", "")
      }
    })
    res.send(comments)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
});
//Create a post
app.post('/posts', async (req, res) => {
  const description = req.body.catText
  const imageName = req.body.imageName 

  try {
    const authUser = await getAuthUser(req)
    const result = await database.createPost(authUser.Username, description, imageName)
    result.id = result.SK.replace("POST#", "")
    res.send(result)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
});

//Create a comment
app.post('/posts/:id/comments', async (req, res) => {
  const postId = req.params.id 
  const text = req.body.text

  try {
    const authUser = await getAuthUser(req)
    const result = await database.createComment(authUser.Username, postId, text)
    result.id = result.SK.replace("COMMENT#", "")
    res.send(result)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
})

//Edit a post
app.patch('/posts/:id', async function(req, res) {  
  const postId = req.params.id;
  const description = req.body.description
  console.log("post id: " + postId)
  console.log("post description:: " + description)
  try {
    const authUser = await getAuthUser(req)
    const post = await database.getPost(authUser.Username, postId)
    console.log(post)
    if(Object.keys(post).length === 0) {
      res.status(403).send({error: "Cannot edit"}) 
  } else {
      const result = await database.updatePost(authUser.Username, postId, description)
      console.log("Result: " + JSON.stringify(result))
      res.send({message: "edited successfully", postId: postId})
  }
} catch(error) {
  console.log(error)
  res.status(500).send(error)
}   
});

//Edit a comment
app.patch('/posts/:id/comments', async function(req, res) {  
  const authUser = await getAuthUser(req)
  if(authUser) { 
  const postId = req.params.id 
  const text = req.body.description
  const task = await database.editComment(postId, text)
  res.send({task})
  }
});

//Delete a post
app.delete('/posts/:id', async function(req, res) {
  const postId = req.params.id;
  console.log("post id: " + postId)
  try {
    const authUser = await getAuthUser(req)
    const post = await database.getPost(authUser.Username, postId)
    console.log(post)
    if(Object.keys(post).length === 0) {
      res.status(403).send({error: "Cannot delete"})
    } else {
      const result = await database.deletePost(authUser.Username, postId)
      console.log("Result: " + JSON.stringify(result))
      res.send({message: "deleted successfully", postId: postId})
    }
  } catch(error) {
    console.log(error)
    res.status(500).send(error)
  } 
});

//Delete a comment
app.delete('/posts/:id/comments', async function(req, res) {
  const authUser = await getAuthUser(req)
  if(authUser) { 
  const postId = req.params.id 
  await database.deleteComment(postId)
  res.end()
  }
});
module.exports = app