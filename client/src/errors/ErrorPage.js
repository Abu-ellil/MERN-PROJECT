import React from "react";
import "./errorpage.css"

const ErrorPage = () => {
     const login = () => {
       window.location = "/login";
     };
  return (
    <div className="error-page">
      <h1>Error</h1>
      <h1>حدث خطأ</h1>
      <p>Error occurred. Please try to Log In again.</p>
      <p>عفوا, هناك خطأ حاول تسجيل الدخول مرة اخرى.</p>
      <button className="btn drop-btn-out" onClick={login}>
        login
      </button>
    </div>
  );
};

export default ErrorPage;
