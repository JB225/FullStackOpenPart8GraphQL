import { useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Notification from './Notification'
import { LOGIN } from '../graphql/mutations'

const Login = ({setToken}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setError] = useState(null)

  const navigate = useNavigate()

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
      setTimeout(() => { setError(null)}, 2000) }
  })

  useEffect(() => {
    if( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('user-token', token)
      navigate('/authors')
    }
  }, [result.data])

  const submit = async (event) => {
    event.preventDefault()
    login({ variables: {username, password}})

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <br></br>
      <Notification message={errorMessage}/>
      <form onSubmit={submit}>
        <div>
            Username: 
          <input 
            value={username} 
            onChange={({target}) => setUsername(target.value)}/>
        </div>
        <div>
            Password: 
          <input 
            value={password} 
            onChange={({target}) => setPassword(target.value)}/>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login