const AWS = require('aws-sdk')

const { ulid } = require('ulid')
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
          ComparisonOperator: 'EQ',
          AttributeValueList: ["USER#" + username]
        }
      }
    }

    const result = await dynamodb.query(params).promise()
    console.log(result)
  }
exports.getUserWithUsername = getUserWithUsername

async function createPost(username, description, imageName, postCount) {
  const Item = {
    PK: "USER#" + username,
    SK: "POST#" + ulid(),
    description,
    imageName,
    postCount,
    created: new Date().toISOString(),   
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

async function deletePost(username, postId) {
  let params = {
    TableName: tableName,
    Key: {
      PK: "USER#" + username,
      SK: "POST#" + postId
    }
  }
  let updateParams = {
    TableName: tableName,
    Key: {
      PK: "USER#" + username,
      SK: "USER#" + username,
    },
    UpdateExpression: "SET postCount = postCount - :inc",
    ExpressionAttributeValues: {
        ":inc": 1
    }
  }
    const result = await dynamodb.delete(params).promise()
    await dynamodb.update(updateParams).promise()
    return result
}
exports.deletePost = deletePost


async function updatePost(username, postId, description) {
  let params = {
    TableName: tableName,
    Key: {
      PK: "USER#" + username,
      SK: "POST#" + postId
    },
    UpdateExpression: "SET description = :r",
    ExpressionAttributeValues: {
        ":r": description
    },
    ReturnValues:"UPDATED_NEW"  
  }   
  dynamodb.update(params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
});
}

exports.updatePost = updatePost
