import React from 'react'
import './Login.css'
import signinImage from "../../assets/signin.png";
import googleIcon from "../../assets/img.png";
import { GoogleAuthProvider,signInWithPopup } from 'firebase/auth';
import {toast} from "react-toastify"
import { auth } from '../../services/firebase';

const googleLogin = () => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth, provider).then((result) => {
    console.log(result);

    if (result.user) {
      toast.success("User logged in successfully", {
        position: "top-center",
      });

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 800);
    }
  });
};


export const Login = () => {
  return (
    <div className="login-page">
      <div className="login-content">

        <p className="CivicLense">CivicLense</p>
        <p className="login-subtitle">
          Report local issues with ease
        </p>

        <div className="login-card">
          <h2 className="login-title">Sign in to CivicLens</h2>

          <img
            src={signinImage}
            alt="CivicLens Sign In"
            className="login-image"
          />

          <button className="google-btn" onClick={googleLogin}>
            <img src={googleIcon} alt="Google" className="google-icon" />
            <span>Sign in with Google</span>
          </button>
        </div>

      </div>
    </div>
  )
}
