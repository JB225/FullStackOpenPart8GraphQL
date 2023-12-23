import { gql, useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'

const ALL_AUTHORS = gql`
query {
  allAuthors {
    name,
    bookCount,
    born
  }
}`

const UPDATE_BORN = gql`mutation ($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name,
    born
  }
}`

const Authors = () => {
  const [name, setName] = useState('')
  const [setBornTo, setBorn] = useState('')

  const authors = useQuery(ALL_AUTHORS)
  const [updateBirthdate] = useMutation(UPDATE_BORN, { refetchQueries: [ { query: ALL_AUTHORS }]})

  if (authors.loading) {
    return (<div>loading...</div>)
  }

  const updateAuthor = async (event) => {
    event.preventDefault()
    updateBirthdate(({ variables: {name, setBornTo}}))

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br></br>
      <form onSubmit={updateAuthor}>
        <div>
          Name: 
          <select value={name} onChange={({ target }) => setName(target.value)}>
            {authors.data.allAuthors.map((a) => (
              <option key={a.name} value={a.name}>{a.name}</option>
            ))}          
          </select>
        </div>
        <div>
          Born: 
          <input value={setBornTo} onChange={({ target }) => setBorn(parseInt(target.value))}/>
        </div>
        <div>
          <button type="submit">Update Author</button>
        </div>

      </form>
    </div>
  )
}

export default Authors
