import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import AuthPage from './pages/Auth'
import BookingsPage from './pages/Bookings'
import EventsPage from './pages/Events'
import MainNavigation from './components/Navigation/MainNavigation'
import AuthContext from './context/auth-context'
import './App.css'

const App = () => {
  const [values, setValues] = useState({
    token: null,
    userId: null,
    login: login,
    logout: logout
  })

  function login(token, userId, tokenExpiration) {
    setValues({ ...values, token, userId })
  }

  function logout() {
    setValues({ ...values, token: null, userId: null })
  }

  return (
    <Router>
      <>
        <AuthContext.Provider value={values}>
          <MainNavigation />
          <main className='main-content'>
            <Switch>
              {values.token && <Redirect from='/' to='/events' exact />}
              {values.token && <Redirect from='/auth' to='/events' />}
              {!values.token && <Route path='/auth' component={AuthPage} />}
              <Route path='/events' component={EventsPage} />
              {values.token && (
                <Route path='/bookings' component={BookingsPage} />
              )}
              {!values.token && <Redirect to='/auth' exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </>
    </Router>
  )
}

export default App
