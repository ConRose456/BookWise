import { Box, Button, ContentLayout, Header, Input, Link, SpaceBetween } from "@cloudscape-design/components";
import React, { useContext } from "react";
import { BookItemListView, getDefaultSearchValue } from "../common_components/book_list_components/bookItemListView";
import { useState } from "react";
import { useEffect } from "react";
import { ContributeBookModal } from "../common_components/contribute_components/bookContributionModal";
import { SearchDisplay } from "../common_components/searchDisplayComponent";
import { AuthTokenStateController } from "../controllers/AuthTokenStateController";
import { SignUpContext } from "../controllers/SignUpController";
import { getAllBooks } from "../apiRequests/books/getAllBooks";

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
        await getAllBooks(
            searchQueryValue,
            {
                setItems,
                setPageCount,
                currentPage
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