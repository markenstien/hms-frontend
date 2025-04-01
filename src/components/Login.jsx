import React, { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { isAuthenticated } from "./Routers";
import OtpScreen from "./widget/OtpScreen";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoginCorrect, setIsLoginCorrect] = useState(false);
  const [userData, setUserData] = useState('');
  const [otpCode, setOtpCode] = useState({
    otpCodeValid : '',
    otpCodeInput : ''
  });
  const navigateTo = useNavigate();

  const handleOtpCode = (name, value) => {
    setOtpCode((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  function setCodeInput(codeInput) {
    setOtpCode(o => ({...otpCode, otpCodeInput: codeInput}));

    if(otpCode.otpCodeValid == codeInput) {
      localStorage.setItem('auth-details', userData);
      navigateTo("/?fromLogin=yes");

    } else {
      console.log('otp is not valid');
    }
    
    console.log([
      'code input',
      codeInput,
      otpCode.otpCodeValid
    ]);
  }
  
  const handleLogin = async (e) => {
    e.preventDefault();
    const loginAPI = import.meta.env.REACT_APP_API_BASE_URL + '/api/v1/user/login';
    try {
      const response = await axios.post(
        loginAPI,
        { email, password, confirmPassword, role: "Admin" },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(response.data.message);
      setOtpCode(o => ({...o, otpCodeValid: '3241'}));

      setUserData(JSON.stringify({
        token : response.data.token,
        user: {
          id : response.data.user._id,
          role : response.data.user.role,
          email : response.data.user.email,
          firstName : response.data.user.firstName,
          lastName : response.data.user.lastName
        }
      }));
      setIsLoginCorrect(true);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isAuthenticated()) {
    return <Navigate to="/" />;
  }

  return (
    <>
    <div className="container">
      {
        isLoginCorrect ? (
          <>
            <div style={{
              paddingTop: '100px',
              textAlign: 'center',
              background: '#e5e5e5',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              minHeight: '100vh'
              }}>
            <OtpScreen length={4} onSubmit={setCodeInput}>
            </OtpScreen>
          </div>
          </>
        ) : (
          <div className="form-component">
              <img src="/aboutlogo.png" alt="logo" className="logo" />
              <h1 className="form-title">Nodado General Hospital</h1>
              <p>Only admins are allowed in this area</p>

              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <div style={{ justifyContent: "center", alignItems: "center" }}>
                  <button type="submit">Login</button>
                </div>
              </form>
            </div>
        )
      }
    </div>
    </>
  );
};

export default Login;
