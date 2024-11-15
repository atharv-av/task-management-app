import "react-app-polyfill/ie11";
import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";
import SignInPage from "./pages/SignInPage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const router = createBrowserRouter([
  {
    children: [
      {
        path: "/",
      },
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
    ],
  },
]);

ReactDOM.render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    afterSignOutUrl="/sign-in"
    signInForceRedirectUrl="/"
  >
    <App />
    <RouterProvider router={router} />
  </ClerkProvider>,
  document.getElementById("root")
);
