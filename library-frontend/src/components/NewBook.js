import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS } from '../graphql/queries'
import { CREATE_BOOK } from '../graphql/mutations'
import { uniqByTitle } from '../utils/utilityMethods'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, 
    { update: (cache, response) => { 
      cache.updateQuery({query: ALL_BOOKS, variables: { genre: '' } }, (data) => {
        if (data && data.allBooks) {
          return {
            allBooks: uniqByTitle(data.allBooks.concat(response.data.addBook))
          }
        }
      })}})

  const submit = async (event) => {
    event.preventDefault()

    createBook({ variables: {title, published, author, genres}})

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <br></br>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(parseInt(target.value))}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook