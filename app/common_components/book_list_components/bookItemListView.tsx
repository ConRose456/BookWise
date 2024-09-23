"use client";

import { createContext, useEffect, useState } from "react";
import { PaginateItemCardGrid } from "../pagination";
import { ItemCardGrid } from "./item_card_grid";
import { Box, SpaceBetween, Spinner } from "@cloudscape-design/components";

export const PaginationContext = createContext({
    currentPage: 1,
    setCurrentPage: (value: any): any => value
});

export const BookItemListView = (
    { 
        searchQueryValue, 
        defaultsSet, 
        fetchContentCallBack,
        pageUrl,
        userOwned
    } : { 
        searchQueryValue: string, 
        defaultsSet: boolean, 
        fetchContentCallBack: (...args: any) => void,
        pageUrl?: string,
        userOwned?: boolean
    }
) => {
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [items, setItems] = useState<any[]>();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setPageCount(getDefaultPageCount() ?? 1);
        setCurrentPage(getDefaultPageNumber() ?? 1);
    }, []);

    useEffect(() => {
        if (defaultsSet) {
            setLoading(true);
            fetchContentCallBack(
                setItems, 
                setPageCount,
                currentPage,
            );
            savePageData(searchQueryValue, currentPage, pageCount, pageUrl);
            setLoading(false);
        }
    }, [currentPage, searchQueryValue, defaultsSet]);

    return (
        <PaginationContext.Provider value={{
            currentPage: currentPage,
            setCurrentPage: setCurrentPage
        }}>
            <SpaceBetween direction="vertical" size="xl">
                {
                    !loading
                        ? ((items?.length ?? 0) > 0
                            ? <ItemCardGrid items={items} userOwned={userOwned}/>
                            : <Box className="empty_list" textAlign="center"><b>No Books in your collection</b></Box>)
                        : <Box textAlign="center">
                            <Spinner size="large" />
                        </Box>
                }
                <div className="pagination">
                    <PaginateItemCardGrid pageCount={pageCount} />
                </div>
            </SpaceBetween>
        </PaginationContext.Provider>
    );
}

export const getDefaultSearchValue = (): string | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("search") ?? undefined;
}

const getDefaultPageNumber = (): number | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get("currentPage"));
}

const getDefaultPageCount = (): number | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get("pageCount"));
}

const savePageData = (searchQueryValue: string, currentPage: number, pageCount: number, pageUrl?: string) => {
    if (typeof window !== "undefined") {
        window.history.pushState(
            {},
            "",
            `${window.location.origin}${pageUrl ?? ""}/?${new URLSearchParams({
                search: searchQueryValue ?? "",
                currentPage: `${currentPage > 0 ? currentPage : 1}`,
                pageCount: `${pageCount > 0 ? pageCount : 1}`
            })}`,
        );
    }
};