import { Children, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { appStore } from './app/store'
import { Toaster } from "@/components/ui/sonner"
import LoadingScreen from './components/ui/LoadingScreen'
import { useGetUserQuery } from './features/api/authApi'

const Custom = ({ children }) => {
  const { isLoading } = useGetUserQuery();
  if(isLoading){
    return <LoadingScreen />;
  }
  return <>{children}</>;
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <Custom>
        <App />
        <Toaster richColors position="top-center" />
      </Custom>
    </Provider>
  </StrictMode>,
)
