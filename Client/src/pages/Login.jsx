import { LoginForm } from "../components/Demo/LoginForm";
import { NavLink } from "react-router-dom";
import Spline from '@splinetool/react-spline';

export default function Login() {
  return (
    <div className="h-screen w-screen flex items-center justify-center dark bg-black text-white">

      {/* Container for form side */}
      <div className="w-full sm:w-1/2 flex flex-col items-center justify-center px-4 sm:px-0">
        {/* Title Section */}
        <h1 className="text-3xl font-medium tracking-wide mb-4 text-center sm:text-left">
          Login to <strong className="text-blue-400">Converse</strong>
        </h1>
        
        {/* Login Form */}
        <div className="w-full max-w-sm border-white/20 border px-8 py-6 rounded-xl backdrop-filter backdrop-blur-sm">

          <LoginForm />
          <p className="text-sm text-white/50 text-center mt-4">
            Don't have an account?{" "}
            <NavLink
              to="/signin"
              className="text-blue-400 hover:underline hover:text-white cursor-pointer"
            >
              Sign In
            </NavLink>
          </p>
        </div>
      </div>

      {/* Spline Animation/Graphic */}
      <div className="w-full sm:w-1/2 h-full z-50 mt-8 sm:mt-0 sm:block hidden">
        <Spline scene="https://prod.spline.design/ggXpNO7mNsPAqhg0/scene.splinecode" />
      </div>
    </div>
  );
}
