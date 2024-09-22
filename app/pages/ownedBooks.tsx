"use client";

import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { BookItemListView, getDefaultSearchValue } from "../common_components/bookItemListView";
import { ContentLayout, Header, Input, Link, SpaceBetween } from "@cloudscape-design/components";
import { AuthTokenStateController } from "../controllers/AuthTokenStateController";
import { SignUpContext } from "../controllers/SignUpContext";
import { useNavigate } from "react-router-dom";

const PAGE_MAX_SIZE = 21;

export const OwnedBooks = () => {
    const { setShouldSignUp } = useContext(SignUpContext);

    const [defaultsSet, setDefaultsSet] = useState(false);

    const [searchInputValue, setSearchInputValue] = useState("");
    const [searchQueryValue, setSearchQueryValue] = useState("");

    useEffect(() => {
        setSearchInputValue(getDefaultSearchValue() ?? "");
        setSearchQueryValue(getDefaultSearchValue() ?? "");
        setDefaultsSet(true);
    }, []);

    const fetchBooks: any = async (
        setItems: (value: any[]) => void, 
        setPageCount: (value: number) => void, 
        currentPage: number,
    ) => {
        setItems([]);
        await fetch(
            `/api/user_books?page=${currentPage}&page_size=${PAGE_MAX_SIZE}&query=${searchQueryValue}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": 'application/json',
                    "charset": 'UTF-8',
                    "Authorization": `Bearer ${AuthTokenStateController.getAuthToken()}`
                }
            }
        )
            .then(response => response.json())
            .then(({ books, pagination, isAuthed }) => {
                if (isAuthed) {
                    const parsedPagination = pagination ?? undefined;
                    setItems(JSON.parse(books));
                    setPageCount(JSON.parse(parsedPagination)?.total_pages ?? 1);
                } else {
                    setShouldSignUp(true);
                }
            })
            .catch(error => console.log(error));
    }

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
            <BookItemListView searchQueryValue={searchQueryValue} defaultsSet={defaultsSet} fetchContentCallBack={fetchBooks} />
          </ContentLayout>
    </div>
    );
}