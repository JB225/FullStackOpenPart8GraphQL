import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, ALL_GENRES } from '../graphql/queries'

const Books = () => {

  const [filter, setFilter] = useState('')
  const genres = new Set([])
  const allGenres = useQuery(ALL_GENRES)
  const books = useQuery(ALL_BOOKS, { variables: { genre: filter } })

  const filterBooks = (event) => {
    event.preventDefault()
    if (event.target.id === 'all') {
      setFilter('')
    } else {
      setFilter(event.target.id)
    }
  }

  if (books.loading || allGenres.loading) {
    return (<div>loading...</div>)
  }

  return (
    <div>
      <h2>books</h2>
      in genre <b>{filter}</b>
      <br></br>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map((a) => {
            // if (filter === 'all' || a.genres.includes(filter)) {
            return <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
            // }
          })}
        </tbody>
      </table>
      <br></br>
      {allGenres.data.allBooks.map((a) => (
        a.genres.map(g => {
          if (!genres.has(g)) {
            genres.add(g)
            return <button key={g} id={g} onClick={filterBooks}>{g}</button>
          }
        })
      ))}
      <button id={'all'} onClick={filterBooks}>All Genres</button>
    </div>
  )
}

export default Books
