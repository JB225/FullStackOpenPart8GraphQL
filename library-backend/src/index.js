const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const config = require('./utils/config')

const Book = require('./models/book')
const Author = require('./models/author')
const mongoose = require('mongoose')

console.log('connecting to', config.MONGODB_URI)

mongoose.set('strictQuery',false)
mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allAuthors: [Author!]!
    allBooks(author: String, genre: String): [Book!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book,
    addAuthor(
      name: String!
      born: Int
    ): Author,
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`

const resolvers = {
  Query: {
    authorCount: () => Author.collection.countDocuments,
    bookCount: () => Book.collection.countDocuments,
    allAuthors: async () => { Author.find({}) },
    allBooks: (root, args) =>  {
      return books
        .filter(b => args.author == null || b.author === args.author)
        .filter(b => args.genre == null || b.genres.includes(args.genre))
    }
  },
  Author: {
    bookCount: (root) => {
      return books.filter(b => b.author === root.name).length
    }
  },
  Mutation: {
    addBook: (root, args) => {
      const book = { ...args, id: uuid() }
      if (!authors.map(a => a.name).includes(args.author)) {
        const author = { name: args.author, id: uuid() }
        authors = authors.concat(author)      
      }
      books = books.concat(book)
      return book
    },
    addAuthor: (root, args) => {
      const author = new Author({ ...args })
      return author.save()

      // const author = { ...args, id: uuid() }
      // authors = authors.concat(author)
      // return author
    },
    editAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      if (!author) {
        return null
      }
      const updatedAuthor = {...author, born: args.setBornTo}
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: config.PORT },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})