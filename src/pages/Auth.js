import React, { useState, useContext } from 'react'
import AuthContext from '../context/auth-context'
import './Auth.css'

const AuthPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const context = useContext(AuthContext)

  const handleSubmit = async e => {
    e.preventDefault()

    if (email.trim().length === 0 || password.trim().length === 0) {
      return
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email,
        password
      }
    }

    if (!isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      }
    }

    try {
      const response = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed!')
      }
      const resData = await response.json()
      if (resData.data.login.token) {
        context.login(
          resData.data.login.token,
          resData.data.login.userId,
          resData.data.login.tokenExpiration
        )
      }
    } catch (error) {
      console.log(error)
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div>
      <form className='auth-form' onSubmit={handleSubmit}>
        <div className='form-control'>
          <label htmlFor='email'>Email</label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className='form-control'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div className='form-actions'>
          <button type='submit'>Submit</button>
          <button type='button' onClick={() => setIsLogin(!isLogin)}>
            Switch to {isLogin ? 'Signup' : 'Login'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AuthPage
