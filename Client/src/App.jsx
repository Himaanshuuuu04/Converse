import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./redux/slice/authSlice";
import { ProgressDemo } from "./components/Demo/ProgressDemo";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import UpdateProfile from "./pages/UpdateProfile";
import Layout from "./components/ui/Layout";
import { SparklesCore } from "@/components/ui/sparkles";
import { Toaster } from "@/components/ui/toaster";
import Logout from "./pages/Logout";


export default function App() {
  const dispatch = useDispatch();
  const { authUser, isCheckingUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isCheckingUser) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <ProgressDemo />
      </div>
    );
  }

  return (
    <div>
      <div className="w-screen absolute inset-0 h-screen -z-50">
        <SparklesCore
          id="tsparticlesfullpage"
          background="#000000"
          minSize={0.1}
          maxSize={0.7}
          particleDensity={70}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <Toaster />
      <Routes>
        <Route element={ authUser?<Layout />:<Navigate to="/login" /> }>
          {/* Protected Routes */}
          <Route
            path="/"
            element={ <Home/>}
          />
          <Route
            path="/update-profile"
            element={ <UpdateProfile /> }
          />
          <Route 
            path="/settings"
            element={ <div>Settings</div> }
          />
          <Route 
            path="/logout"
            element={ <Logout/> }
          />
        </Route>
        {/* Public Routes */}
        <Route
          path="/login"
          element={authUser ? <Navigate replace to="/" /> : <Login />}
        />
        <Route
          path="/signin"
          element={authUser ? <Navigate replace to="/" /> : <SignIn />}
        />
      </Routes>
    </div>
  );
}
