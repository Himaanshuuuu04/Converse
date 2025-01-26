import {Routes, Route, useNavigate} from 'react-router-dom';
import Home from './pages/Home';
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { checkAuth } from "./redux/slice/authSlice";
import {ProgressDemo} from "./components/Demo/ProgressDemo";
import {SparklesCore} from "./components/ui/sparkles";
export default function App() {
  const navigate = useNavigate();
  const {authUser,isCheckingUser} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, []);
 
  if(!authUser && isCheckingUser){ 
      <div >
        <ProgressDemo />
      </div>
  }
  return (
    <>
      <div className="w-full absolute inset-0 h-screen">
        <SparklesCore
        id="tsparticlesfullpage"
        background="transparent"
        minSize={0.2}
        maxSize={0.8}
        particleDensity={70}
        className="w-full h-full"
        particleColor="#FFFFFF"
        />
      </div>
      <Routes>
        <Route path="/" element={authUser ? <Home /> : navigate('/signin')} />
        {/* <Route path="*" element={authUser ? <Home /> : navigate('/login')} /> */}
        <Route path="/login" element={<Login /> } />
        <Route path="/signin" element={!authUser ?<SignIn />: navigate('/')} />
      </Routes>
    
    </>
  );
}
