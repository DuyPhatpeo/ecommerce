import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./GlobalStyle.css";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./components/general/ScrollToTop";

const App: React.FC = () => {
  return (
    <Router>
      {/* <ScrollToTop /> */}
      <AppRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
};

export default App;
