import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import store from './store'
import { AuthContextProvider } from './context/AuthContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer, Bounce } from "react-toastify";

const queryClient = new QueryClient();

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
        <App />
      </Provider>
    </QueryClientProvider>
  </AuthContextProvider>
)
