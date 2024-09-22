"use client";

import {
    AppLayout,
    SideNavigation,
    TopNavigation
} from '@cloudscape-design/components';
import "./globals.css";
import React from 'react';
import { LoginModal } from './common_components/login_modal';
import { SignUpModal } from './common_components/sign_up_modal';
import { AuthTokenStateController } from './controllers/AuthTokenStateController';
import { InternalItemOrGroup } from '@cloudscape-design/components/button-dropdown/interfaces';
import { useEffect } from 'react';
import { SignUpContext } from './controllers/SignUpContext';
import dynamic from 'next/dynamic';
import { HashRouter, useNavigate } from 'react-router-dom';

const PageRouterComponent = dynamic(() => import('./pageRouter'), {ssr: false} )

export default function PageLayout() {
    const { shouldSignUp, setShouldSignUp } = React.useContext(SignUpContext);
    const [isLoginVisible, setLoginVisible] = React.useState(false);

    const [userDisplayText, setUserDisplayText] = React.useState("");
    const [isAuthorized, setIsAuthorised] = React.useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsAuthorised(AuthTokenStateController.isAuthorized());
            setUserDisplayText(AuthTokenStateController.getUserDisplayText());
        }
    }, [isAuthorized]);


    const getLoginUtilsItems = (): InternalItemOrGroup[] => {
        if (isAuthorized) {
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
                        text: userDisplayText,
                        items: getLoginUtilsItems(),
                        onItemClick: ({ detail }) => {
                            if (detail.id == "login") {
                                setLoginVisible(true);
                            } else if (detail.id == "sign_up") {
                                setShouldSignUp(true);
                            } else if (detail.id == "sign_out") {
                                setUserDisplayText("");
                                AuthTokenStateController.deleteAuthToken();
                                setIsAuthorised(false);
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
                        setUserText={setUserDisplayText} 
                        setAuthed={setIsAuthorised}
                    />
                    <SignUpModal
                        visible={shouldSignUp}
                        setVisible={setShouldSignUp}
                        setLoginVisible={setLoginVisible}
                        setUserText={setUserDisplayText}
                        setAuthed={setIsAuthorised}
                    />
                    <PageRouterComponent />
                </div>}
            />
            </HashRouter>
        </div>
        </>
    );
}