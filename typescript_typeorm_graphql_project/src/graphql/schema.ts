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
    userRole : String!
}

type PostData {
    posts : [Post!]!
    totalPosts : Int!
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
    getPosts : PostData
    getPostById(id : ID!) : Post!
}

type RootMutation {
    createUser(userInput : UserInputData) : User!
    createPost(postInputData : PostInputData ) : Post!
    updatePost(id: ID!, postInput: PostInputData): Post!
    deletePost(id: ID!): Boolean
}

schema {
    query : RootQuery
    mutation : RootMutation
}

`);

export { graphqlSchema };
