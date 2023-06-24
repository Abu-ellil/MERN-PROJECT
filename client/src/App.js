import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RegistrationPage from "./components/signup/RegistrationPage";
import LoginPage from "./components/login/LoginPage";
import Landing from "./components/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/signup" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Landing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
