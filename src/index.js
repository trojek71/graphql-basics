import { GraphQLServer } from 'graphql-yoga'
import { v4 as uuid } from 'uuid'

let users = [{
    id: '1',
    name: 'Tomek',
    email: 'tomek@email.com'
},{
    id: '2',
    name: 'Marcin',
    email: 'marcin@email.com',
    age: 22
},{
    id: '3',
    name: 'Kasia',
    email: 'kasia@email.com'
}]

let posts =[{
    id: '10',
    title: 'GraphQL 101',
    body: 'asdas asdasdas asdasdasd',
    published: true,
    author: '1',
    
},{
    id: '11',
    title: 'Advance GrapqQL',
    body: '',
    published: false,
    author: '1'
},{
    id: '12',
    title: 'Programmming JS',
    body: 'asdas asdasdas asdasdasd',
    published: false,
    author: '2'
}]

let comments = [{
    id: '102',
    text: 'qweqweqwe, qweqweqwe,qweqweqwe',
    author: '1',
    post: '10'
    
},{
    id: '103',
    text: 'asdasd asdasdasdaasdasd',
    author: '1',
    post: '10'
},{
    id: '104',
    text: 'zxczx zxczxczxcx',
    author: '2',
    post: '11' 
},{
    id: '105',
    text: 'tyutyio tyiutyityityi',
    author: '3',
    post: '11'
},{
    id: '106',
    text: 'nie usuniety',
    author: '2',
    post: '12'
}

]

const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
        comments: [Comment!]!
      
    }

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!): User!
        createPost(data: CreatePostInput!):Post!
        deletePost(id: ID!):Post!
        createComment( data: CreateCommentInput!): Comment!
        deleteComment(id: ID!):Comment!
    }

    input CreateUserInput {
            name: String!
            email: String!
            age: Int
        }

    input CreatePostInput {
        title: String!
        body:String!
        published: Boolean!
        author: ID!
    }    
    
    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
    }

    type User {
        id: ID!
        name : String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post :Post!
    }
`
const resolvers = {
    Query:{
        users(parent, args, ctx, info){
            if (!args.query) {
                return users
            }
            return users.filter((user) =>{
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent,args,ctx,info){
            if (!args.query){
                return posts
            }
            return posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLocaleLowerCase().includes(args.query.toLowerCase())
                return isBodyMatch || isTitleMatch
            })
        },
        comments(parent, arg, ctx,info){
                    return comments
        },
        me() {
            return {
                id: '123498',
                name: 'Tomek',
                email: 'tomek@mail.com',                     
            }
        },      
    },

    Mutation:{
        createUser(parent, args, ctx, info){
            const emailTaken = users.some((user) => user.email === args.data.email)
           if (emailTaken) {
               throw new Error('Email taken')
           }
            const user ={
                id: uuid(),
                ...args.data
            }
            users.push(user)
            
            return user
        },
        deleteUser(parent, args, ctx, info){
            const userIndex = users.findIndex((user) => user.id === args.id)
                if(userIndex === -1){
                    throw new Error ('User not found')
                }
                    const deletedUsers = users.splice(userIndex, 1)
                        posts = posts.filter((post) => {
                            const match = post.author === args.id
                            
                            if (match) {
                                
                                comments = comments.filter((comment) => comment.post !== post.id )
                            }
                                return !match
                        })
                        
                            comments = comments.filter((comment) => comment.author !== args.id)



                    return deletedUsers[0]

        },
        createPost(parent, args, ctx, info){
            const userExist = users.some((user) => user.id === args.data.author)
                if (!userExist) {
                    throw new Error('User not found')
                }
                const post = {
                    id: uuid(),
                    ...args.data
                }
                posts.push(post)

                return post
        },
        deletePost(parent, args, ctx, info){
            const postIndex = posts.findIndex((post) => post.id = args.id)
                if (postIndex === -1){
                    throw new Error ('Post not found')
                }

                const deletedPosts = posts.splice(postIndex, 1)
                
                comments = comments.filter((comment) => comment.post !== args.id)
                
                  return deletedPosts[0]  
            },
        createComment(parent, args, ctx, info){
            const userExist = users.some((user) => user.id === args.data.author)
            const postExist = posts.some((post) => post.id === args.data.post && post.published)

            if (!userExist || !postExist){
                throw new Error('Unable to find user and post!!!')
            }
            const comment ={
                id: uuid(),
                ...args.data
            }

            comments.push(comment)

            return comment

        },

        deleteComment(parent, args, ctx, info){
            const commentIndex = comments.findIndex((comment) => comment.id = args.id)

                if(commentIndex === -1){
                    throw new Error ('Comment not found')
                }

                const deletedComments = comments.splice(commentIndex, 1)

                return deletedComments[0]
        },

    },
    Post: {
        author(parent, args, ctx, info){
            return users.find((user)=>{
                return user.id === parent.author
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    Comment :{
        author(parent, args, ctx, info){
            return users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, ctx, info){
            return posts.find((post) => {
                return post.id === parent.post
            })
        }
    },
    User: {
        posts(parent, args, ctx, info){
            return posts.filter((post) =>{
                return post.author === parent.id
            })
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    }
}

const server =  new GraphQLServer ({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})