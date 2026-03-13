import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// set up routes so different URL routes load up different main components
const App = props => {
  const [user, setUser] = useState({}) // a state variable that stores the logged-in user, if any

  return (
    <div className="container">
      <Router basename={import.meta.env.BASE_URL}>
        {/* pass the setter function that can be called if the user successfully logs in from the login screen */}
        <PrimaryNav user={user} setuser={setUser} />
        <Routes>
          {/* a route to the home screen */}
          <Route path="/" element={<Home user={user} />} />

          {/* a route to the about us screen */}
          <Route path="/about" element={<About user={user} />} />

          {/* a route to show a list of animals - we pass the user data in as a prop */}
          <Route path="/animals" element={<AnimalsList user={user} />} />

          {/* a route to show the details of a specific animal, given its id - we pass the user data in as a prop and the animalId is passed in automatically as a param by react */}
          <Route
            path="/animals/:animalId"
            element={<AnimalDetail user={user} />}
          />

          {/* a route to the log in form... this form is a placeholder only */}
          <Route
            path="/login"
            element={<Login user={user} setuser={setUser} />}
          />

          {/* a route to logout */}
          <Route
            path="/logout"
            element={<Logout user={user} setuser={setUser} />}
          />
        </Routes>
      </Router>
    </div>
  )
}

// make this available to other modules as an import
export default App