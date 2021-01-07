import { GraphQLServer } from 'graphql-yoga'
const typeDefs = `
    type Query {
        hello:String! 
        name:String!
        location:String!
        bio:String!
    }
`
const resolvers = {
    Query:{
        hello(){
            return 'This  is my first query'
        },
        name(){
            return 'Tomasz Rojek'
        },
        location(){
            return 'Gliwice'
        },
        bio(){
            return 'Im beginner'
        },
    }
}

const server =  new GraphQLServer ({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('The server is up!')
})