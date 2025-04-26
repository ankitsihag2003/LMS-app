import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

export const AuthenticatedUser = ({children})=>{
    const {isAuthenticated} = useSelector(store=>store.auth)
    if(isAuthenticated){
        return <Navigate to="/" />
    }
    return children;
}
export const ProtectedRoute = ({children})=>{
    const {isAuthenticated} = useSelector(store=>store.auth)
    if(!isAuthenticated){
        return <Navigate to="/login" />
    }
    return children;
}
export const AdminProtection = ({children})=>{
    const {user,isAuthenticated} = useSelector(store=>store.auth)
    if(!isAuthenticated){
        return <Navigate to="/login" />
    }
    if(user.roles!=="instructor"){
        return <Navigate to="/" />
    }
    return children;
}