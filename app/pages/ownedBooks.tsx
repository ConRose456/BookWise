"use client";

import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { BookItemListView, getDefaultSearchValue } from "../common_components/book_list_components/bookItemListView";
import { ContentLayout, Header, Input, Link, SpaceBetween } from "@cloudscape-design/components";
import { AuthTokenStateController } from "../controllers/AuthTokenStateController";
import { SignUpContext } from "../controllers/SignUpController";
import { SearchDisplay } from "../common_components/searchDisplayComponent";
import { getOwnedBooks } from "../apiRequests/books/getOwnedBooks";

const PAGE_URL = "#/owned_books";

export const OwnedBooks = () => {
    const { setShouldSignUp } = useContext(SignUpContext);

    const [defaultsSet, setDefaultsSet] = useState(false);

    const [searchInputValue, setSearchInputValue] = useState("");
    const [searchQueryValue, setSearchQueryValue] = useState("");

    // Clears URL args on page change
    useEffect(() => {
        window.history.pushState(
            {},
            "",
            `${window.location.origin}#/owned_books`,
        );
    });

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
       await getOwnedBooks(
            searchQueryValue,
            {
                setItems,
                setPageCount,
                currentPage,
                setShouldSignUp
            }
       );
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
                <Input
                    onChange={({ detail }) => setSearchInputValue(detail.value)}
                    value={searchInputValue}
                    onKeyDown={({ detail }) => {
                        if (detail.key == "Enter") {
                            setSearchQueryValue(searchInputValue);
                        }
                    }}
                    placeholder="Search"
                    type="search"
                    className='search_input'
                />
                <SearchDisplay searchQueryValue={searchQueryValue} />
                <BookItemListView searchQueryValue={searchQueryValue} defaultsSet={defaultsSet} fetchContentCallBack={fetchBooks} pageUrl={PAGE_URL} userOwned={true} />
            </ContentLayout>
        </div>
    );
}