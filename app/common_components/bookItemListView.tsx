"use client";

import { createContext, useEffect, useState } from "react";
import { PaginateItemCardGrid } from "./pagination";
import { ItemCardGrid } from "./item_card_grid";
import { Box, SpaceBetween, Spinner } from "@cloudscape-design/components";

export const PaginationContext = createContext({
    currentPage: 1,
    setCurrentPage: (value: any): any => value
});

const PAGE_MAX_SIZE = 1;

export const BookItemListView = () => {
    const [pageCount, setPageCount] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const [items, setItems] = useState<any[]>();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setPageCount(getDefaultPageCount() ?? 1);
        setCurrentPage(getDefaultPageNumber() ?? 1);
    }, []);

    useEffect(() => {
        const fetchBooks: any = async () => {
            setItems([]);
            setLoading(true);
            await fetch(
                `/api/all_books?page=${currentPage}&page_size${PAGE_MAX_SIZE}`,
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
                    const parsedPagination = JSON.parse(pagination);

                    setItems(JSON.parse(books));
                    setPageCount(parsedPagination.total_pages ?? 1);
                })
                .catch(error => console.log(error))
                .finally(() => {
                    if (typeof window !== "undefined") {
                        savePageData(currentPage, pageCount);
                    }
                    setLoading(false);
                });
        }
        fetchBooks();
    }, [currentPage]);

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

const getDefaultPageNumber = (): number | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get("currentPage"));
}

const getDefaultPageCount = (): number | undefined => {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get("pageCount"));
}

const savePageData = (currentPage: number, pageCount: number) => {
    if (typeof window !== "undefined") {
        window.history.pushState(
            {},
            "",
            `${window.location.origin}/?${new URLSearchParams({
                currentPage: `${currentPage}`,
                pageCount: `${pageCount}`
            })}`,
        );
    }
};