import { buildSchema, GraphQLOutputType } from "graphql";

const graphqlSchema = buildSchema(`

type Post {
    id : ID!
    title : String!
    content : String!
    imageUrl : String!
    creator : User!
}

type User {
    id : ID!
    name : String!
    email : String!
    password : String!
    role : String!
    posts : [Post!]!
}

type AuthData {
    token : String!
    userId : String!
    userRoe : String!
}

input UserInputData {
    name : String!
    email : String!
    password : String!
    role : String!
}

input PostInputData {
    title : String!
    content : String!
    imageUrl : String!
}

type RootQuery {
    login(email : String!, password : String!) : AuthData!
}

type RootMutation {
    createUser(userInput : UserInputData) : User!
}

schema {
    query : RootQuery
    mutation : RootMutation
}

`);

export { graphqlSchema };
