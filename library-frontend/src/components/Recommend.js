import { gql, useQuery } from '@apollo/client'

const ALL_BOOKS = gql`
query {
  allBooks {
    author {
      name
    },
    genres,
    published,
    title
  } 
}`

const CURRENT_USER = gql`
query Me {
    me {
      favoriteGenre
    }
  }`

const Recommend = () => {

  const books = useQuery(ALL_BOOKS)
  const user = useQuery(CURRENT_USER)

  if (books.loading || user.loading) {
    return (<div>loading...</div>)
  }

  return (
    <div>
      <h2>books</h2>
          books in your favorite genre <b>{user.data.me.favoriteGenre}</b>
      <br></br>
      <br></br>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map((a) => {
            if (a.genres.includes(user.data.me.favoriteGenre)) {
              return <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            }
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend