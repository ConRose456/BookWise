const PAGE_MAX_SIZE = 21;

export const getAllBooks = async (
    searchQueryValue: string,
    {
        setItems,
        setPageCount,
        currentPage,
    } : { 
        setItems: (value: any[]) => void,
        setPageCount: (value: number) => void,
        currentPage: number,
    }
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