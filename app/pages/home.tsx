import { ContentLayout, Header, Input, Link, SpaceBetween } from "@cloudscape-design/components";
import React from "react";
import { BookItemListView, getDefaultSearchValue } from "../common_components/bookItemListView";
import { useState } from "react";
import { useEffect } from "react";

const PAGE_MAX_SIZE = 21;

export const Home = () => {
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
            `/api/all_books?page=${currentPage}&page_size=${PAGE_MAX_SIZE}&query=${searchQueryValue}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": 'application/json',
                    "charset": 'UTF-8'
                }
            }
        )
            .then(response => response.json())
            .then(({ books, pagination }) => {
                const parsedPagination = pagination ?? undefined;
                setItems(JSON.parse(books));
                setPageCount(JSON.parse(parsedPagination)?.total_pages ?? 1);
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
                        setSearchQueryValue(searchInputValue);
                      }
                    }}
                    placeholder="Search"
                    type="search"
                    className='search_input'
                  />
                  <BookItemListView searchQueryValue={searchQueryValue} defaultsSet={defaultsSet} fetchContentCallBack={fetchBooks}/>
                </SpaceBetween>
              </ContentLayout>
        </div>
    );
}