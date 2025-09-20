import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import store from './store'
import { AuthContextProvider } from './context/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer, Bounce } from 'react-toastify'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

import { fr } from 'yup-locales'
import { setLocale } from 'yup'
setLocale(fr)

const queryClient = new QueryClient()

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache(),
})

createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Provider store={store}>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </Provider>
    </QueryClientProvider>
  </AuthContextProvider>,
)
