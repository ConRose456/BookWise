"use client";

import React, { useEffect } from "react";
import { useState } from "react";
import { getDefaultSearchValue } from "../common_components/bookItemListView";
import { ContentLayout, Header, Input, Link, SpaceBetween } from "@cloudscape-design/components";

export const OwnedBooks = () => {
    const [defaultsSet, setDefaultsSet] = useState(false);

    const [searchInputValue, setSearchInputValue] = useState("");
    const [searchQueryValue, setSearchQueryValue] = useState("");

    useEffect(() => {
        setSearchInputValue(getDefaultSearchValue() ?? "");
        setSearchQueryValue(getDefaultSearchValue() ?? "");
        setDefaultsSet(true);
    }, []);

    return (
        <div>
        <ContentLayout
            defaultPadding
            headerVariant="high-contrast"
            header={
              <Header
                className='header'
                variant="h1"
                info={<Link variant="info">Info</Link>}
                description="Search the books you own!"
              >
                Owned Books
              </Header>
            }
          >
            <SpaceBetween direction='vertical' size='l'>
              <Input
                onChange={({ detail }) => setSearchInputValue(detail.value)}
                value={searchInputValue}
                onKeyDown={({detail}) => {
                  if (detail.key == "Enter") {
                    setSearchQueryValue(searchInputValue);
                  }
                }}
                placeholder="Search"
                type="search"
                className='search_input'
              />
            </SpaceBetween>
          </ContentLayout>
    </div>
    );
}