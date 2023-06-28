import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Step1Form from "./Step1Form";
import Step2Form from "./Step2Form";
import LoginPage from "../../components/login/LoginPage";

const RegistrationPage = ({ toggleLang, En }) => {
  const [userId, setUserId] = useState(null);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = (id) => {
    setStep(2);
    setUserId(id);
  };

  const handleComplete = () => {
    navigate("/login");
  };

  return (
    <>
      {step === 1 ? (
        <Step1Form handleNext={handleNext} />
      ) : (
        <Step2Form handleComplete={handleComplete} userId={userId} />
      )}
      <div>
        {step === 1 ? (
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        ) : (
          <p>
            Don't have an account! <Link to="/signup">Signup</Link>
          </p>
        )}
      </div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />;
      </Routes>
    </>
  );
};

export default RegistrationPage;
