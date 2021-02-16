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
    id: '3',
    name: 'Kasia',
    email: 'kasia@email.com'
}]

const posts =[{
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

const comments = [{
    id: '102',
    text: 'qweqweqwe, qweqweqwe,qweqweqwe',
    author: '3',
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
    author: '1',
    post: '12'
},{
    id: '106',
    text: 'nie usuniety',
    author: '2',
    post: '12'
}]

const db ={
    users,
    posts,
    comments
}

export {db as default}