"use client";

import {
    AppLayout,
    SideNavigation,
    TopNavigation
} from '@cloudscape-design/components';
import "./globals.css";
import React, { useContext } from 'react';
import { LoginModal } from './common_components/login_modal';
import { SignUpModal } from './common_components/sign_up_modal';
import { AuthTokenStateContext, AuthTokenStateController } from './controllers/AuthTokenStateController';
import { InternalItemOrGroup } from '@cloudscape-design/components/button-dropdown/interfaces';
import { useEffect } from 'react';
import { SignUpContext } from './controllers/SignUpContext';
import dynamic from 'next/dynamic';
import { HashRouter, useNavigate } from 'react-router-dom';

const PageRouterComponent = dynamic(() => import('./pageRouter'), { ssr: false })

export default function PageLayout() {
    const { userDisplayTextUseState, authTokenStateController } = useContext(AuthTokenStateContext);
    const { shouldSignUp, setShouldSignUp } = React.useContext(SignUpContext);

    const [isLoginVisible, setLoginVisible] = React.useState(false);

    // Ensures UX update on auth change and intital load
    useEffect(() => {
        authTokenStateController.setIsAuthorised(AuthTokenStateController.isAuthorized());
        userDisplayTextUseState.setUserDisplayText(
            authTokenStateController.isAuthorized 
                ? AuthTokenStateController.getUserDisplayText()
                : ""
        );
    }, [authTokenStateController.isAuthorized]);

    // This updates UI on user auth token timeout
    useEffect(() => {
        const checkAuthed = () => {
            if (!AuthTokenStateController.isAuthorized()) {
                authTokenStateController.setIsAuthorised(false);
                userDisplayTextUseState.setUserDisplayText("");
                window.location.reload();
            }
        }

        // Calls checkAuth every hour
        const interval = setInterval(checkAuthed, 3600000);
        return () => clearInterval(interval);
    }, []);

    const getLoginUtilsItems = (): InternalItemOrGroup[] => {
        if (authTokenStateController.isAuthorized) {
            return [
                { itemType: "action", text: "Sign Out", id: "sign_out" },
            ];
        }
        return [
            { itemType: "action", text: "Login", id: "login" },
            { itemType: "action", text: "Sign Up", id: "sign_up" }
        ];
    }

    return (
        <>
        <div>
            <HashRouter>
            <TopNavigation
                identity={{
                    href: "#",
                    title: "Book Wise",
                }}
                utilities={[
                    {
                        type: "menu-dropdown",
                        iconName: "user-profile",
                        text: userDisplayTextUseState.userDisplayText,
                        items: getLoginUtilsItems(),
                        onItemClick: ({ detail }) => {
                            if (detail.id == "login") {
                                setLoginVisible(true);
                            } else if (detail.id == "sign_up") {
                                setShouldSignUp(true);
                            } else if (detail.id == "sign_out") {
                                userDisplayTextUseState.setUserDisplayText("");
                                AuthTokenStateController.deleteAuthToken();
                                authTokenStateController.setIsAuthorised(false);
                                window.history.replaceState({}, "", `${window.location.origin}`)
                                window.location.reload();
                            }
                        }
                    },
                ]} /><AppLayout
                toolsHide
                disableContentPaddings
                navigation={<SideNavigation
                    header={{
                        href: '#',
                        text: 'Book Wise',
                    }}
                    items={[
                        { type: 'link', text: `Home`, href: `#` },
                        { type: 'link', text: `Owned Books`, href: `#/owned_books`},
                        { type: 'link', text: `My Account`, href: `#` },
                    ]} />
                }
                content={<div>
                    <LoginModal
                        visible={isLoginVisible}
                        setVisible={setLoginVisible}
                        setSignUpVisible={setShouldSignUp}
                        setUserText={userDisplayTextUseState.setUserDisplayText} 
                        setAuthed={authTokenStateController.setIsAuthorised}
                    />
                    <SignUpModal
                        visible={shouldSignUp}
                        setVisible={setShouldSignUp}
                        setLoginVisible={setLoginVisible}
                        setUserText={userDisplayTextUseState.setUserDisplayText}
                        setAuthed={authTokenStateController.setIsAuthorised}
                    />
                    <PageRouterComponent />
                </div>}
            />
            </HashRouter>
        </div>
        </>
    );
}