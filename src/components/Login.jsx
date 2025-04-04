import React, { useState, useContext } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { isAuthenticated } from "./Routers";
import OtpScreen from "./widget/OtpScreen";
import randn from "randn";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoginCorrect, setIsLoginCorrect] = useState(false);
  const [userData, setUserData] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [otpCode, setOtpCode] = useState({
    otpCodeValid : '',
    otpCodeInput : ''
  });
  const navigateTo = useNavigate();

  function setCodeInput(codeInput) {
    setOtpCode(o => ({...otpCode, otpCodeInput: codeInput}));

    if(otpCode.otpCodeValid == codeInput) {
      localStorage.setItem('auth-details', userData);
      window.location.reload();
      navigateTo("/?fromLogin=yes");
    } else {
      toast.error("In-Correct OTP Code");
      console.log('test');
    }
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

      if(response.data.success == true) {
        var userResponseData = response.data.user;

        console.log([
          'response',
          response.data
        ])
        var userData = {
          token : response.data.token,
          user: {
            id : userResponseData._id,
            role : userResponseData.role,
            userAccess: userResponseData.userAccess,
            position: userResponseData.userPosition,
            docAvatar : userResponseData.docAvatar,
            email : userResponseData.email,
            firstName : userResponseData.firstName,
            lastName : userResponseData.lastName
          }
        };

        setUserData(JSON.stringify(userData));

        setOtpCode(o => ({...o, otpCodeValid: randomNumber}));


        let randomNumber = randn(4);
        
        let myData = {
          service_id: 'service_3tgt94l',
          template_id: 'template_z9kuabh',
          user_id: 'Z7xYtcSFDWSknwG68',
          template_params: {
            passcode: randomNumber,
            email : response.data.user.email ?? 'gonzalesmarkangeloph@gmail.com'
          }
        };


        console.log(randomNumber);

        // const emailResponse = await axios.post(
        //   'https://api.emailjs.com/api/v1.0/email/send',
        //   myData,
        //   {
        //     headers: { "Content-Type": "application/json" },
        //   }
        // ).then((promise) => {
        //   setIsLoading(true);
        // });

        setIsLoginCorrect(true);
      }
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
              <img src="../src/assets/images/logo_png.png" alt="logo" className="logo" style={{marginBottom: '30px'}} />
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
