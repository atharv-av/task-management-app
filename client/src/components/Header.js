import React from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

export default function Header() {
  return (
    <div>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
}