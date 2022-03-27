export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "catpostsbackendaa147ab5": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "function": {
        "catPostCats": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "catpostsbackendcatPostDatabase": {
            "Arn": "string"
        }
    },
    "storage": {
        "catadoptionDB": {
            "Name": "string",
            "Arn": "string",
            "StreamArn": "string",
            "PartitionKeyName": "string",
            "PartitionKeyType": "string",
            "SortKeyName": "string",
            "SortKeyType": "string",
            "Region": "string"
        }
    },
    "api": {
        "catPosts": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    }
}