const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const jwt = require('jsonwebtoken')
const config = require('./utils/config')

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    bookCount: async () => Book.collection.countDocuments(),
    allAuthors: async () => {
      const authors = await Author.find({})
      const books = await Book.find({})

      const idBookCount = books.map((book) => book.author.toString())
        .reduce((books, id) => { 
          books[id] = (books[id] || 0) + 1
          return books
        }, [])

      return authors.map((author) => { 
        return { 
          id: author._id, 
          name: author.name, 
          born: author.born, 
          bookCount: (idBookCount[author._id.toString()] || 0)
        }})
    },
    allBooks: async (root, args) =>  {
      if (!args.author && !args.genre) {
        return Book.find({})
      }
  
      if (args.author) {
        const author = await Author.findOne({ name: { $eq: args.author } })
        return Book.find({ author: {$eq: author._id }})
      }
  
      return Book.find({ genres: args.genre })
    },
    me: async (root, args, context) => context.currentUser
  },
  Book: {
    author: async (root) => {
      return Author.findOne({ _id: root.author })
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      let authorObj = await Author.findOne({ name: {$eq: args.author } })
      if (!authorObj) {
        authorObj = new Author({ name: args.author })
        try {
          await authorObj.save()
        } catch (error) {
          throw new GraphQLError('Saving author failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        }      
      }
  
      const book = new Book({ ...args, author: authorObj })
  
      try {
        await book.save().catch
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },
    addAuthor: async (root, args) => {
      const author = new Author({ ...args})
        
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
  
      return author
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }
      author.born = args.setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
  
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: [args.username, args.favoriteGenre],
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if (!user || args.password !== '1111') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
  
      const userForToken = {
        username: user.username,
        id: user._id
      }
  
      return { value: jwt.sign(userForToken, config.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers