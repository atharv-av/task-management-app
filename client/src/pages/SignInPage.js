import { SignedOut } from "@clerk/clerk-react";
import React from "react";

const SignInPage = () => {
  return (
    <SignedOut>
      <h2 style={{ margin: "auto" }}>Please log in to continue</h2>
    </SignedOut>
  );
};

export default SignInPage;
