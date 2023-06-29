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
      <h2>Please refresh</h2>
      <p>عفوا, هناك خطأ حاول تسجيل الدخول مرة اخرى.</p>
      <h2>من فضلك قم باعادة التحميل</h2>
      <button className="btn drop-btn-out" onClick={login}>
        login
      </button>
    </div>
  );
};

export default ErrorPage;
