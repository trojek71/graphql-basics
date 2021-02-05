const Query = {
    
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
    }
export {Query as default}