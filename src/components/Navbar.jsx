import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'
import { signOut } from "firebase/auth"
import { auth } from "../services/firebase"
import { toast } from "react-toastify"

export const Navbar = () => {

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success("Logged out successfully", {
        position: "top-center",
      })
      window.location.href = "/"
    } catch (error) {
      toast.error("Logout failed")
    }
  }

  return (
    <nav>
      <Link to="/dashboard" className="CivicLens">
        CivicLens
      </Link>

      <ul>
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
        <li>
          <NavLink to="/ReportIssue">Report Issue</NavLink>
        </li>
        <li>
          <NavLink to="/Admin">Admin</NavLink>
        </li>
      </ul>

      <button className="button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  )
}
