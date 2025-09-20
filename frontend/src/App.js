/* eslint-disable prettier/prettier */
import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'

// We use those styles to show code examples, you should remove them in your application.
import './scss/examples.scss'
import { useAuthContext } from './hooks/useAuthContext'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
// import mainNavigation from './views/components/Navigation/MainNavigation'

// const EventsPage = React.lazy(() => import('./views/pages/Events'))
// const AuthPage = React.lazy(() => import('./views/pages/Auth'))
// const BookingsPage = React.lazy(() => import('./views/pages/Bookings'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { user } = useAuthContext()


  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          <Route exact path="/login" name="Login Page" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="*" name="Home" element={user ? <DefaultLayout /> : <Navigate to="/login" />} />


          {/* <mainNavigation >
            <Route exact path="/events" name="Events Page" element={<EventsPage />} />
            <Route exact path="/auth" name="Auth Page" element={<AuthPage />} />
            <Route exact path="/bookings" name="Bookings Page" element={<BookingsPage />} />
          </mainNavigation> */}

        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
