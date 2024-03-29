import React from "react";
import "../index.css";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./Components/Routing/PrivateRoute";
import PrivateScreen from "./Components/Screens/PrivateScreen";
import Login from "./Components/Screens/LoginScreen";
import Register from "./Components/Screens/RegisterScreen";
import ForgotPassword from "./Components/Screens/ForgotPassword";
import ResetPassword from "./Components/Screens/ResetPassword";

const App = () => {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<PrivateScreen />} />
      </Route>
      
      <Route path="/login" element={<Login />}></Route>
      <Route path="/register" element={<Register />}></Route>
      <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
      <Route
        path="/reset-password/:resetToken"
        element={<ResetPassword />}
      ></Route>
    </Routes>
  );
};

export default App;
