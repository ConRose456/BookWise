import { createContext, useEffect, useState } from "react";
import { PaginateItemCardGrid } from "./pagination";
import { ItemCardGrid } from "./item_card_grid";
import { Box, SpaceBetween } from "@cloudscape-design/components";

export const PaginationContext = createContext({ 
    currentPage: 1,  
    setCurrentPage: (value: any): any => value
});

export const BookItemListView = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [items, setItems] = useState<any[]>();

    useEffect(() => {
        const fetchBooks: any = async () => {
            const { books, errors } = await fetch("/api/all_books", {
                method: "GET",
                headers: {
                    "Content-Type": 'application/json',
                    "charset": 'UTF-8'
                }
            }).then(response => response.json());

            setItems(JSON.parse(books));
        }
        fetchBooks();
    }, [currentPage]);

    return (
        <div>
            <PaginationContext.Provider value={{ 
                currentPage: currentPage, 
                setCurrentPage: setCurrentPage
            }}>
                <SpaceBetween direction="vertical" size="xl">
                    <ItemCardGrid items={items} />
                    <div className="pagination">
                        <PaginateItemCardGrid />
                    </div>
                </SpaceBetween>
            </PaginationContext.Provider>
        </div>
    );
}