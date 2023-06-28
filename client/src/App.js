import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RegistrationPage from "./components/signup/RegistrationPage";

import LoginPage from "./components/login/LoginPage";
import Landing from "./components/Landing";
import UserProfile from "./components/modify/UserProfile";
import "./thems/dark.css";
import { useState } from "react";
function App({toggleLang,En}) {
  const en = En
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/signup" element={<RegistrationPage En={en} />} />
        <Route path="/login" element={<LoginPage toggleLang={toggleLang}
        en={En}/>} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
