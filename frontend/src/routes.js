import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const UsersPage = React.lazy(() => import('./views/pages/users/UsersPage'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/', name: 'Colors', element: Dashboard },
  { path: '/base', name: 'Base', element: Dashboard, exact: true },
  { path: '/users', name: 'UsersPage', element: UsersPage },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Dashboard },

  { path: '/charts', name: 'Charts', element: Dashboard },

]

export default routes
