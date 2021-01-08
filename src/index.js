import { GraphQLServer } from 'graphql-yoga'
const typeDefs = `
    type Query {
        me: User!
    }

    type User {
        id: ID!
        name : String!
        email: String!
        age: Int
    }
`
const resolvers = {
    Query:{
        me() {
            return {
                id: '123498',
                name: 'Tomek',
                email: 'tomek@mail.com',
                
                
            }
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