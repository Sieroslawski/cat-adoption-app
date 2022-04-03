const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const database = require('./database')

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

app.post('/posts', async (req, res) => {
  const description = req.body.description
  const imageName = req.body.imageName
  const completed = req.body.completed
  
  try {
    const authUser = await getAuthUser(req)
    const result = await database.createPost(authUser.Username, description, imageName, completed)
    result.id = result.SK.replace("POST#", "")
    res.send(result)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
});

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

module.exports = app