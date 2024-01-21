import { gql } from '@apollo/client'

export const LOGIN = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }`

export const CREATE_BOOK = gql`
mutation($title: String!, $published: Int!, $author: String!, $genres: [String!]!) {
  addBook(
    title: $title, 
    published: $published, 
    author: $author, 
    genres: $genres) {
      title
      published
      genres
      author {
        name
      }
  }
}`

export const UPDATE_BORN = gql`mutation ($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name,
      born
    }
  }`