import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { BrowserRouter as Router, 
  Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'

const App = () => {
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  return (
    <Router>
      <div>
        <Link to="/authors"><button>authors</button></Link>
        <Link to="/books"><button>books</button></Link>
        <Link to="/add"><button>add book</button></Link>
        <Link to="/login"><button>Login</button></Link>
      </div>

      <Routes>
        <Route path="/" element={<Authors/>}/>
        <Route path="/authors" element={<Authors />} />
        <Route path="/books" element={<Books />} />
        <Route path="/add" element={<NewBook />} />
        <Route path="/login" element={<Login setToken={setToken} setError={setErrorMesage} />} />
      </Routes>
    </Router>
  )
}

export default App
