import { Navbar } from './components/Navbar'
import './App.css'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Login, DashBoard, ReportIsuue, Admin } from './components/Pages'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./services/firebase"
import { useEffect, useState } from "react"




function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/";
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    setLoading(false);

    // 👇 ADD THIS HERE
    if (currentUser && location.pathname === "/") {
      window.location.href = "/dashboard";
    }
  });

  return () => unsubscribe();
}, [location.pathname]);


  return (
    <>
      <ToastContainer position="top-center" autoClose={2500} />
      <div className='App'>
        {!hideNavbar && <Navbar />}
        
        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/dashboard"
            element={user ? <DashBoard /> : <Login />}
          />

          <Route
            path="/ReportIssue"
            element={user ? <ReportIsuue /> : <Login />}
          />

          <Route
            path="/Admin"
            element={user ? <Admin /> : <Login />}
          />
        </Routes>


      </div>
    </>
  )
}

export default App