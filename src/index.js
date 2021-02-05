import { GraphQLServer } from 'graphql-yoga'
import db from './db'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Comment from './resolvers/Comment'
import User from './resolvers/User'
import Post from './resolvers/Post'



const server =  new GraphQLServer ({
    typeDefs : './src/schema.graphql',
    resolvers :{
        Query,
        Mutation,
        Comment,
        User,
        Post
    },
    context: {
        db
    }
})

server.start(() => {
    console.log('The server is up!')
})