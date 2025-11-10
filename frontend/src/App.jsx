import Navbar from "./components/NavBar.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import { Navigate, Route, Routes } from "react-router-dom"
import SignupPage from "./pages/SignUpPage.jsx"
import LoginPage from './pages/LoginPage.jsx'
import { useNavigate } from "react-router-dom"
import { useUserStore } from "./store/useUserStore.js"
import LoadingSpinner from "./components/LoadingSpinner.jsx"
import { useEffect } from "react"

function App() {
    const navigate = useNavigate()
    const {user, checkAuth, checkingAuth } = useUserStore()

    useEffect(()=>{
        checkAuth()
    },[checkAuth])

    if(checkingAuth) return <LoadingSpinner/>
    return  (
        <div className="min-h-screen overflow-x-hidden">
            <Navbar/>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/dashboard" element={<DashboardPage/>} />
                <Route path="/signup" element={!user ? <SignupPage onBack={() => navigate('/')} /> : <Navigate to="/dashboard" />} />
                <Route path="/login" element={!user ? <LoginPage onBack={() => navigate('/')} /> : <Navigate to="/dashboard" />} />

            </Routes>
        </div>
    )
}

export default App