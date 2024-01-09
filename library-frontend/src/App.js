import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { BrowserRouter as Router, 
  Routes, Route, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()

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
        <Route path="/login" element={<Login setToken={setToken} />} />
      </Routes>
    </Router>
  )
}

export default App
