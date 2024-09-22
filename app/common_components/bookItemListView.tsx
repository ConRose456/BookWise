"use client";

import { createContext, useEffect, useState } from "react";
import { PaginateItemCardGrid } from "./pagination";
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
        fetchContentCallBack 
    } : { 
        searchQueryValue: string, 
        defaultsSet: boolean, 
        fetchContentCallBack: (...args: any) => void 
    }
) => {
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [items, setItems] = useState<any[]>();

    const [loading, setLoading] = useState(false);

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
            savePageData(searchQueryValue, currentPage, pageCount);
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
                        ? <ItemCardGrid items={items} />
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

const savePageData = (searchQueryValue: string, currentPage: number, pageCount: number) => {
    if (typeof window !== "undefined") {
        window.history.pushState(
            {},
            "",
            `${window.location.origin}/?${new URLSearchParams({
                search: searchQueryValue,
                currentPage: `${currentPage}`,
                pageCount: `${pageCount}`
            })}`,
        );
    }
};