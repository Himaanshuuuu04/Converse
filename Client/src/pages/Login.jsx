import { LoginForm } from "../components/Demo/LoginForm";
import { NavLink } from "react-router-dom";
import Spline from '@splinetool/react-spline';
import LoginScreen from "@/components/Demo/LoginScreen";
export default function Login() {
  return (
    <div className="h-screen w-screen flex flex-col  md:flex-row items-center justify-center text-white">

      <div className="w-full h-fit sm:w-2/3 sm:h-full z-50  sm:mt-0 sm:hidden block mb-20">
        <LoginScreen />
      </div>

      {/* Container for form side */}
      <div className="w-full sm:w-1/2 flex flex-col items-center justify-center px-4 sm:px-0">
        {/* Title Section */}
        <h1 className="text-3xl font-light tracking-wide mb-4 text-center sm:text-left">
          Login to <strong className="text-cyan-300 font-bold">Converse</strong>
        </h1>

        {/* Login Form */}
        <div className="w-full max-w-sm border-white/20 border px-8 py-6 rounded-xl backdrop-filter backdrop-blur-3xl ">

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
      <div className="w-full h-1/3 sm:w-2/3 sm:h-full z-50  sm:mt-0 sm:block  hidden">
        <LoginScreen />
      </div>
    </div>
  );
}