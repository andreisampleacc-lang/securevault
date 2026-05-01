import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [screen, setScreen] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);

  return (
    <div>
      {screen === "landing" && (
        <LandingPage setScreen={setScreen} />
      )}
      {screen === "signup" && (
        <SignUp
          setScreen={setScreen}
          setCurrentUser={setCurrentUser}
        />
      )}
      {screen === "login" && (
        <Login
          setScreen={setScreen}
          setCurrentUser={setCurrentUser}
        />
      )}
      {screen === "dashboard" && (
        <Dashboard
          currentUser={currentUser}
          setScreen={setScreen}
        />
      )}
    </div>
  );
}

export default App;