import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./GlobalStyle.css";
import AppRoutes from "./routes/AppRoutes";

const App: React.FC = () => {
  return (
    <Router>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        newestOnTop={false}
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </Router>
  );
};

export default App;
