import { Pagination } from "@cloudscape-design/components";
import { useContext } from "react";
import { PaginationContext } from "./book_list_components/bookItemListView";

export const PaginateItemCardGrid = ({ pageCount }: { pageCount: number }) => {
    const { currentPage, setCurrentPage } = useContext(PaginationContext);

    return (
        <div className="pagination">
            <Pagination
                currentPageIndex={currentPage}
                pagesCount={pageCount}
                onChange={({ detail }) => {
                    setCurrentPage(detail.currentPageIndex)
                }}
            />
        </div>
    );
}