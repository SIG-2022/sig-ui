import {Navigate} from "react-router-dom";
import {useLocalStorage} from "../hooks/useLocalStorage";
import jwtDecoder from 'jwt-decode'

export const ProtectedRoute = ({ children }) => {
    const [jwt] = useLocalStorage("jwt", null);
    if (!jwt || new Date() >= new Date(jwtDecoder(jwt).exp * 1000)) {
        // user is not authenticated or expired auth
        localStorage.removeItem('jwt')
        localStorage.removeItem('user')
        return <Navigate to="/login"/>
    }
    return children;
};