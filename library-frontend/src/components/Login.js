import { gql, useMutation } from '@apollo/client'
import { useEffect, useState } from 'react'

const LOGIN = gql`
    mutation Login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }`

const Login = ({setToken, setError}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, result ] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)
    }
  })

  useEffect(() => {
    if( result.data ) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('user-token', token)
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