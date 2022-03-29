const AWS = require('aws-sdk')

const { ulid } = require('ulid');
AWS.config.update({ region: 'us-west-1' });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "catadoptionDB";
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const partitionKeyName = "PK"
const sortKeyName = "SK"
const invertIndex = "invertedIndex"

async function createUser(username) {
  const Item = {
    username: username,
    PK: "USER#" + username,
    SK: "USER#" + username,  
    postCount: 0,
    created: new Date().toISOString()
  }
  let params = {
    TableName: tableName,
    Item
  }
  await dynamodb.put(params).promise()
  return Item
}
exports.createUser = createUser

async function getUserWithUsername(username) { 
  let params = {
    TableName: tableName,
    KeyConditions: {
      PK: {
        ComparisonOperator: 'EQ',
        AttributeValueList: ["USER#" + username]
      },
      SK: {
        ComparisonOperator:'EQ',
        AttributeValueList: ["USER#" + username]
      }
    },
    ScanIndexForward: false
  }
  const result = await dynamodb.query(params).promise()
  return result
}

exports.getUserWithUsername = getUserWithUsername


async function createPost(username, description, imageName) {
  const Item = {
    PK: "USER#" + username,
    SK: "POST#" + ulid(),
    description,
    imageName,
    created: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  }

  let createParams = {
    TableName: tableName,
    Item: Item
  }

  let updateParams = {
    TableName: tableName,
    Key: {
      PK: "USER#" + username,
      SK: "USER#" + username,
    },
    UpdateExpression: "SET postCount = postCount+ :inc",
    ExpressionAttributeValues: {
        ":inc": 1
    }
  }

  await dynamodb.put(createParams).promise()
  await dynamodb.update(updateParams).promise()

  return Item
}
exports.createPost = createPost

async function createComment(username, postId, text) {
  const Item = {
    PK: "POST#" + postId,
    SK: "COMMENT#" + ulid(),
    username,
    text,
    created: new Date().toISOString(),
  }
  let params = {
    TableName: tableName,
    Item
  }

  let updateParams = {
    TableName: tableName,
    Key: {
      PK: "USER#" + username,
      SK: "POST#" + postId,
    },
    UpdateExpression: "SET commentCount = commentCount+ :inc",
    ExpressionAttributeValues: {
        ":inc": 1
    }
  }

  await dynamodb.put(params).promise()
  await dynamodb.update(updateParams).promise()

  return Item
}
exports.createComment = createComment

async function getPost(username, postId) {
  let params = {
    TableName: tableName,
    Key: {
      PK: "USER#" + username,
      SK: "POST#" + postId
    }
  }
  
  const result = await dynamodb.get(params).promise()
  return result
}
exports.getPost = getPost

async function getPosts(username) {
  let params = {
    TableName: tableName,
    KeyConditions: {
      PK: {
        ComparisonOperator: 'EQ',
        AttributeValueList: ["USER#" + username]
      },
      SK: {
        ComparisonOperator: 'BEGINS_WITH', // [IN, NULL, BETWEEN, LT, NOT_CONTAINS, EQ, GT, NOT_NULL, NE, LE, BEGINS_WITH, GE, CONTAINS]
        AttributeValueList: ["POST#"]
      }
    },
    ScanIndexForward: false
  }

  const result = await dynamodb.query(params).promise()
  return result
}
exports.getPosts = getPosts

async function getComments(postId) {
  let params = {
    TableName: tableName,
    KeyConditions: {
      PK: {
        ComparisonOperator: 'EQ',
        AttributeValueList: ["POST#" + postId]
      },
      SK: {
        ComparisonOperator: 'BEGINS_WITH', // [IN, NULL, BETWEEN, LT, NOT_CONTAINS, EQ, GT, NOT_NULL, NE, LE, BEGINS_WITH, GE, CONTAINS]
        AttributeValueList: ["COMMENT#"]
      }
    },
    ScanIndexForward: false
  }

  const result = await dynamodb.query(params).promise()
  return result
}
exports.getComments = getComments