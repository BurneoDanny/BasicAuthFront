import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "pages/auth/Login/Login";
import Register from "pages/auth/Register/Register";
import Main from "pages/main/Main";
import AccountVerified from "pages/auth/AccountVerified/AccountVerified";
import ForgotPassword from "pages/auth/ForgotPassword/ForgotPassword";

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/accountVerified",
        element: <AccountVerified />,
      },
      {
        path: "/forgotPassword",
        element: <ForgotPassword/>
      },
      {
        path: "/MyDashboard",
        element: <Main />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

//
