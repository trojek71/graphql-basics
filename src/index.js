import { GraphQLServer } from 'graphql-yoga'
//import { removeAllListeners } from 'nodemon'

const users = [{
    id: '1',
    name: 'Tomek',
    email: 'tomek@email.com'
},{
    id: '2',
    name: 'Marcin',
    email: 'marcin@email.com',
    age: 22
},{
    id: 3,
    name: 'Kasia',
    email: 'kasia@email.com'
}]

const posts =[{
    id: '10',
    title: 'GraphQL 101',
    body: 'asdas asdasdas asdasdasd',
    published: true,
    author: '1'
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

const comments = [{
    id: '102',
    text: 'qweqweqwe, qweqweqwe,qweqweqwe'
    
},{
    id: '103',
    text: 'asdasd asdasdasdaasdasd'
},{
    id: '104',
    text: 'zxczx zxczxczxcx'
},{
    id: '105',
    text: 'tyutyio tyiutyityityi'
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

    type User {
        id: ID!
        name : String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }

    type Comment {
        id: ID!
        text: String!
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
    Post: {
        author(parent,args,ctx,ingo){
            return users.find((user)=>{
                return user.id === parent.author
            })
        }
    },
    User: {
        posts(parent, args, ctx, info){
            return posts.filter((post) =>{
                return post.author === parent.id
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