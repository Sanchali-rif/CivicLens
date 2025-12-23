import React from 'react'
import { Link,NavLink } from 'react-router'
import './Navbar.css'
export const Navbar = () => {
  return (
    <nav>
        <Link to="/" className='CivicLens'>
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
        <li>
            <NavLink to="/" className="button"><button>Logout</button></NavLink>
        </li>
    </nav>
  )
}
