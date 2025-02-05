import React from 'react'
import { BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom";
import Login from "./assets/components/Auth/Login";
import SignUp from "./assets/components/Auth/SignUp";
import Home from "./assets/components/Home/Home";
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path = "/dashboard" exact element = {<Home/>}/>
          <Route path = "/login" exact element = {<Login/>}/>
          <Route path = "/signup" exact element = {<SignUp/>}/>
        </Routes>
      </Router>
      
    </div>
  )
}

export default App