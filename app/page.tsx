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

export default function Home() {
  const [searchValue, setSearchValue] = useState("");

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
              type: "button",
              iconName: "user-profile",
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
          }
        />
      </div>
    </main>
  )
}
