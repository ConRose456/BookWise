"use client";

import { useState } from 'react';
import {
  AppLayout,
  ContentLayout,
  Header,
  Input,
  Link,
  SideNavigation,
  SpaceBetween,
  TopNavigation
} from '@cloudscape-design/components';
import "./globals.css";
import React from 'react';
import { LoginModal } from './common_components/login_modal';
import { SignUpModal } from './common_components/sign_up_modal';
import { AuthTokenStateContext, AuthTokenStateController } from './controllers/AuthTokenStateController';
import { InternalItemOrGroup } from '@cloudscape-design/components/button-dropdown/interfaces';
import { useEffect } from 'react';
import { BookItemListView } from './common_components/bookItemListView';

if (typeof window === "undefined") React.useLayoutEffect = () => { };

export default function Home() {
  const [searchInputValue, setSearchInputValue] = useState("");
  const [searchQueryValue, setSearchQueryValue] = useState("");

  const [isLoginVisible, setLoginVisible] = React.useState(false);
  const [isSignUpVisible, setSignUpVisible] = React.useState(false);

  const [userDisplayText, setUserDisplayText] = React.useState("");
  const [isAuthorized, setIsAuthorised] = React.useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsAuthorised(AuthTokenStateController.isAuthorized());
      setUserDisplayText(AuthTokenStateController.getUserDisplayText());
    }
  }, []);
  
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
                  setSignUpVisible(true);
                } else if (detail.id == "sign_out") {
                  setUserDisplayText("");
                  AuthTokenStateController.deleteAuthToken();
                  setIsAuthorised(false);
                }
              }
            },
          ]}
        />
        <AppLayout
          toolsHide
          disableContentPaddings
          navigation={<SideNavigation
            header={{
              href: '#',
              text: 'Book Wise',
            }}
            items={[
              { type: 'link', text: `Home`, href: `#` },
              { type: 'link', text: `My Collection`, href: `#` },
              { type: 'link', text: `Owned Books`, href: `#` },
              { type: 'link', text: `Rented Books`, href: `#` },
              { type: 'link', text: `My Account`, href: `#` },
            ]}
          />}
          content={
            <div>
              <LoginModal
                visible={isLoginVisible}
                setVisible={setLoginVisible}
                setSignUpVisible={setSignUpVisible}
                setUserText={setUserDisplayText}
              />
              <SignUpModal
                visible={isSignUpVisible}
                setVisible={setSignUpVisible}
                setLoginVisible={setLoginVisible}
                setUserText={setUserDisplayText}
              />
              <ContentLayout
                defaultPadding
                headerVariant="high-contrast"
                header={
                  <Header
                    className='header'
                    variant="h1"
                    info={<Link variant="info">Info</Link>}
                    description="Search for your favirate books!"
                  >
                    Book Library
                  </Header>
                }
              >
                <SpaceBetween direction='vertical' size='l'>
                  <Input
                    onChange={({ detail }) => setSearchInputValue(detail.value)}
                    value={searchInputValue}
                    onKeyDown={({detail}) => {
                      if (detail.key == "Enter") {
                        setSearchQueryValue(searchInputValue)
                      }
                    }}
                    placeholder="Search"
                    type="search"
                    className='search_input'
                  />
                  <BookItemListView searchQueryValue={searchQueryValue} />
                </SpaceBetween>
              </ContentLayout>
            </div>
          }
        />
        </AuthTokenStateContext.Provider>
      </div>
    </main>
  )
}
