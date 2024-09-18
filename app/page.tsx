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

export default function Home() {
  const [searchValue, setSearchValue] = useState("");

  const [isLoginVisible, setLoginVisible] = React.useState(false);

  const [userText, setUserText] = React.useState("");

  return (
    <main>
      <div>
        <TopNavigation
          identity={{
            href: "#",
            title: "Book Wise",
          }}
          utilities={[
            {
              type: "menu-dropdown",
              iconName: "user-profile",
              text: userText,
              items: [
                { itemType: "action", text: "Login", id: "login"},
                { itemType: "action", text: "Sign Up", id: "sign_up"}
              ],
              onItemClick: ({detail}) => {
                if (detail.id == "login") {
                  setLoginVisible(true);
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
            <LoginModal visible={isLoginVisible} setVisible={setLoginVisible} setUserText={setUserText}/>
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
                  onChange={({ detail }) => setSearchValue(detail.value)}
                  value={searchValue}
                  placeholder="Search"
                  type="search"
                  className='container'
                />
              </SpaceBetween>
            </ContentLayout>
            </div>
          }
        />
      </div>
    </main>
  )
}
