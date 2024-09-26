import { Box, Button, ContentLayout, Header, Input, Link, SpaceBetween } from "@cloudscape-design/components";
import React, { useContext } from "react";
import { BookItemListView, getDefaultSearchValue } from "../common_components/book_list_components/bookItemListView";
import { useState } from "react";
import { useEffect } from "react";
import { ContributeBookModal } from "../common_components/contribute_components/bookContributionModal";
import { SearchDisplay } from "../common_components/searchDisplayComponent";
import { AuthTokenStateController } from "../controllers/AuthTokenStateController";
import { SignUpContext } from "../controllers/SignUpController";

const PAGE_MAX_SIZE = 21;

export const Home = () => {
    const {setShouldSignUp} = useContext(SignUpContext);
    const [defaultsSet, setDefaultsSet] = useState(false);

    const [searchInputValue, setSearchInputValue] = useState("");
    const [searchQueryValue, setSearchQueryValue] = useState("");

    const [contributionModalVisible, setContributionModalVisible] = useState(false);

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
        const page = currentPage > 0 ? currentPage : 1;

        await fetch(
            `/api/all_books?page=${page}&page_size=${PAGE_MAX_SIZE}&query=${searchQueryValue}`,
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
                        actions={
                            <Button
                                variant="primary"
                                onClick={() => {
                                    if (AuthTokenStateController.isAuthorized()) {
                                        setContributionModalVisible(true);
                                      } else {
                                        setShouldSignUp(true);
                                      }
                                }}
                            >
                                Contribute Book
                            </Button>
                        }
                    >
                        Book Library
                    </Header>
                }
            >
                <ContributeBookModal visible={contributionModalVisible} setVisible={setContributionModalVisible} />
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
                <BookItemListView searchQueryValue={searchQueryValue} defaultsSet={defaultsSet} fetchContentCallBack={fetchBooks} />
            </ContentLayout>
        </div>
    );
}