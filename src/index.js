import { GraphQLServer } from 'graphql-yoga'
import { v4 as uuid } from 'uuid'
import db from './db'



const resolvers = {
    Query:{
        users(parent, args, {db}, info){
            if (!args.query) {
                return db.users
            }
            return db.users.filter((user) =>{
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        posts(parent, args, {db},info){
            if (!args.query){
                return db.posts
            }
            return db.posts.filter((post) => {
                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLocaleLowerCase().includes(args.query.toLowerCase())
                return isBodyMatch || isTitleMatch
            })
        },
        comments(parent, args, {db}, info){
                    return db.comments
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
        createUser(parent, args, {db}, info){
            const emailTaken = db.users.some((user) => user.email === args.data.email)
           if (emailTaken) {
               throw new Error('Email taken')
           }
            const user ={
                id: uuid(),
                ...args.data
            }
            db.users.push(user)
            
            return user
        },
        deleteUser(parent, args, {db}, info){
            const userIndex = db.users.findIndex((user) => user.id === args.id)
                if(userIndex === -1){
                    throw new Error ('User not found')
                }
                    const deletedUsers = db.users.splice(userIndex, 1)
                        db.posts = db.posts.filter((post) => {
                            const match = post.author === args.id
                            
                            if (match) {
                                
                                db.comments = db.comments.filter((comment) => comment.post !== post.id )
                            }
                                return !match
                        })
                        
                            db.comments = db.comments.filter((comment) => comment.author !== args.id)



                    return deletedUsers[0]

        },
        createPost(parent, args, {db}, info){
            const userExist =db.users.some((user) => user.id === args.data.author)
                if (!userExist) {
                    throw new Error('User not found')
                }
                const post = {
                    id: uuid(),
                    ...args.data
                }
                db.posts.push(post)

                return post
        },
        deletePost(parent, args, {db}, info){
            const postIndex = db.posts.findIndex((post) => post.id = args.id)
                if (postIndex === -1){
                    throw new Error ('Post not found')
                }

                const deletedPosts = posts.splice(postIndex, 1)
                
                db.comments = db.comments.filter((comment) => comment.post !== args.id)
                
                  return deletedPosts[0]  
            },
        createComment(parent, args, {db}, info){
            const userExist = db.users.some((user) => user.id === args.data.author)
            const postExist = db.posts.some((post) => post.id === args.data.post && post.published)

            if (!userExist || !postExist){
                throw new Error('Unable to find user and post!!!')
            }
            const comment ={
                id: uuid(),
                ...args.data
            }

            db.comments.push(comment)

            return comment

        },

        deleteComment(parent, args, {db}, info){
            const commentIndex = db.comments.findIndex((comment) => comment.id = args.id)

                if(commentIndex === -1){
                    throw new Error ('Comment not found')
                }

                const deletedComments = db.comments.splice(commentIndex, 1)

                return deletedComments[0]
        },

    },
    Post: {
        author(parent, args, {db}, info){
            return db.users.find((user)=>{
                return user.id === parent.author
            })
        },
        comments(parent, args, {db}, info) {
            return db.comments.filter((comment) => {
                return comment.post === parent.id
            })
        }
    },
    Comment :{
        author(parent, args, {db}, info){
            return db.users.find((user) => {
                return user.id === parent.author
            })
        },
        post(parent, args, {db}, info){
            return db.posts.find((post) => {
                return post.id === parent.post
            })
        }
    },
    User: {
        posts(parent, args, {db}, info){
            return db.posts.filter((post) =>{
                return post.author === parent.id
            })
        },
        comments(parent, args, {db}, info) {
            return db.comments.filter((comment) => {
                return comment.author === parent.id
            })
        }
    }
}

const server =  new GraphQLServer ({
    typeDefs : './src/schema.graphql',
    resolvers,
    context: {
        db
    }
})

server.start(() => {
    console.log('The server is up!')
})