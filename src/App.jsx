import { Navbar } from './components/Navbar'
import './App.css'
import { Routes,Route } from 'react-router'
import { Login, DashBoard,ReportIsuue,Admin } from './components/Pages'

function App() {
  

  return (
    <div className='App'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/dashboard' element={<DashBoard/>}/>
        <Route path='/ReportIssue' element={<ReportIsuue/>}/>
        <Route path='/Admin' element={<Admin/>}/>
      </Routes>
    </div>
  )
}

export default App
