import Navbar from "./components/NavBar.jsx"
import DashboardPage from "./pages/DashboardPage.jsx"
import HomePage from "./pages/HomePage.jsx"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"
import SignupPage from "./pages/SignUpPage.jsx"
import LoginPage from './pages/LoginPage.jsx'
import { useNavigate } from "react-router-dom"
import { useUserStore } from "./store/useUserStore.js"
import LoadingSpinner from "./components/LoadingSpinner.jsx"
import { useEffect } from "react"
import AnalyzeResumePage from "./pages/AnalyzeResumePage.jsx"
import EditResumePage from "./pages/EditResumePage.jsx"
import { Toaster } from "react-hot-toast"

function App() {
    const navigate = useNavigate()
    const location = useLocation()
    const {user, checkAuth, checkingAuth } = useUserStore()

     useEffect(() => {
        checkAuth();
        }, [checkAuth]);   

    if(checkingAuth) return <LoadingSpinner/>

    const hideNavbar = ['/analyze-resume', '/edit-resume']
    const showNavbar = !hideNavbar.includes(location.pathname)
    return  (
        <div className="min-h-screen overflow-x-hidden">
            {showNavbar && <Navbar/>}
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/dashboard" element={<DashboardPage/>} />
                <Route path="/signup" element={!user ? <SignupPage onBack={() => navigate('/')} /> : <Navigate to="/dashboard" />} />
                <Route path="/login" element={!user ? <LoginPage onBack={() => navigate('/')} /> : <Navigate to="/dashboard" />} />

                <Route path="/analyze-resume" element={<AnalyzeResumePage onBack={() => navigate('/dashboard')}/>} />
                <Route path="/edit-resume" element={<EditResumePage/>} />

            </Routes>
            <Toaster/>
        </div>
    )
}

export default App