import React from 'react'
import Dashboard from './Component/Dashboard'
import SignUp from './Component/SignUp'
import Login from './Component/Login'
import './index.css'; // या './App.css'


import {BrowserRouter as Router,Routes, Route } from "react-router-dom";
const App = () => {
  return (
    <div>
        {/* <SignUp/> */}
        {/* <<Login/>/> */}
        {/* <Dashboard/> */}
        
        <Router>
        <Routes>
         <Route path="/" element={<SignUp/>} />       
         <Route path="/Login" element={<Login/>} />       
         <Route path="/Dashboard" element={<Dashboard/>} />       
        </Routes>
        </Router>
    </div>
  )
};

export default App