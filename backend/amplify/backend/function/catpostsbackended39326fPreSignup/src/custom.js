/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
 const database = require("/opt/database.js");

 exports.handler = async (event) => {
   const userName = event.userName
   const databaseUser = await database.getUserWithUsername(userName)
   if(!databaseUser){
     await database.createUser(userName)
   }
 
   return event 
 }