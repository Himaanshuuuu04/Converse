import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from "./pages/Login";
import SignIn from "./pages/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import { checkAuth } from "./redux/slice/authSlice";


export default function App() {
  const {authUser} = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch,checkAuth]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
    </>
  );
}
