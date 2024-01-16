import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
query {
  allAuthors {
    name,
    bookCount,
    born
  }
}`

export const ALL_BOOKS = gql`
query AllBooks($genre: String) {
  allBooks(genre: $genre) {
    title
    author {
      name
    }
    genres
    published
  }
}`

export const ALL_GENRES = gql`
query AllBooks {
  allBooks {
    genres
  }
}`

export const CURRENT_USER = gql`
query Me {
    me {
      favoriteGenre
    }
  }`

export const BOOK_ADDED = gql`
  subscription Subscription {
    bookAdded {
      title
      genres
      author {
        name
      }
      published
    }
  }`