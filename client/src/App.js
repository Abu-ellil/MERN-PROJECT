import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RegistrationPage from "./components/signup/RegistrationPage";
import LoginPage from "./components/login/LoginPage";
import Landing from "./components/Landing";
import UserProfile from "./components/modify/UserProfile";

import { createContext, useState } from "react";
// import ReactSwitch from "react-switch";


export const ThemeContext = createContext(null);

function App() {
const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme((curr) => (curr === "light" ? "dark" : "light"));
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <BrowserRouter>
        {/* <Landing /> */}
        <Routes>
          <Route path="/landing" element={<Landing />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/signup" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
}

export default App;
