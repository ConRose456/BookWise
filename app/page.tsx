"use client";

import "./globals.css";
import React from 'react';
import { AuthTokenStateContext, AuthTokenStateController } from './controllers/AuthTokenStateController';
import { useEffect } from 'react';

import { SignUpContext } from './controllers/SignUpContext';
import dynamic from 'next/dynamic';

if (typeof window === "undefined") React.useLayoutEffect = () => { };

const PageLayoutComponent = dynamic(() => import('./pageLayout'), {ssr: false} )

export default function App() {
  const [isSignUpVisible, setSignUpVisible] = React.useState(false);

  const [userDisplayText, setUserDisplayText] = React.useState("");
  const [isAuthorized, setIsAuthorised] = React.useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAuthorised(AuthTokenStateController.isAuthorized());
      setUserDisplayText(AuthTokenStateController.getUserDisplayText());
    }
  }, []);

  return (
    <main>
      <div>
        <AuthTokenStateContext.Provider value={{
          userDisplayTextUseState: {
            userDisplayText,
            setUserDisplayText
          },
          authTokenStateController: {
            isAuthorized,
            setIsAuthorised
          }
        }}>
          <SignUpContext.Provider value={{ shouldSignUp: isSignUpVisible, setShouldSignUp: setSignUpVisible }}>
            <PageLayoutComponent />
          </SignUpContext.Provider>
        </AuthTokenStateContext.Provider>
      </div>
    </main>
  )
}
