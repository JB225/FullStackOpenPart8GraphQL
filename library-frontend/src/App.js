import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'
import Login from './components/Login'

import { BrowserRouter as Router, 
  Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import { ALL_BOOKS, BOOK_ADDED } from './graphql/queries'

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log()
      window.alert('A new book has been added')

      const bookAdded = data.data.bookAdded
      console.log(data)
      console.log(bookAdded)

      client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
        return {
          allBooks: allBooks.concat(bookAdded)
        }
      })
    }
  })

  useEffect(() => { 
    const loggedUserToken = window.localStorage.getItem('user-token')
    if (loggedUserToken) {
      setToken(loggedUserToken)
    }
  }, [])

  const logoutHandler = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <Router>
      <div>
        <Link to="/authors"><button>authors</button></Link>
        <Link to="/books"><button>books</button></Link>
        { token ? 
          <span>
            <Link to="/add"><button>add book</button></Link>
            <Link to="/recommend"><button>recommend</button></Link>
            <Link to="/"><button onClick={logoutHandler}>logout</button></Link>
          </span> 
          : <Link to="/login"><button>Login</button></Link>
        }
      </div>

      <Routes>
        <Route path="/" element={<Authors/>}/>
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
      </Routes>
    </Router>
  )
}

export default App
