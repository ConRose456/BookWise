import { Pagination } from "@cloudscape-design/components";
import { useContext } from "react";
import { PaginationContext } from "./bookItemListView";

export const PaginateItemCardGrid = () => {
    const { currentPage, setCurrentPage } = useContext(PaginationContext);

    return (
        <Pagination 
            currentPageIndex={currentPage} 
            pagesCount={2}
            onChange={({detail}) => {
                setCurrentPage(detail.currentPageIndex)
            }}
        />
    );
}