import { AuthTokenStateController } from "@/app/controllers/AuthTokenStateController";

const PAGE_MAX_SIZE = 21;

export const getOwnedBooks = async (
    searchQueryValue: string,
    {
        setItems,
        setPageCount,
        currentPage,
        setShouldSignUp,
    } : {
        setItems: (value: any[]) => void,
        setPageCount: (value: number) => void,
        currentPage: number,
        setShouldSignUp: (value: boolean) => void,
    }
) => {
    setItems([]);
    const page = currentPage > 0 ? currentPage : 1;
    await fetch(
        `/api/user_books?page=${page}&page_size=${PAGE_MAX_SIZE}&query=${searchQueryValue}`,
        {
            method: "GET",
            headers: {
                "Content-Type": 'application/json',
                "charset": 'UTF-8',
                "Authorization": `Bearer ${AuthTokenStateController.getAuthToken()}`
            }
        }
    )
        .then(response => response.json())
        .then(({ books = JSON.stringify([]), pagination = JSON.stringify(""), isAuthed, error }) => {
            if (isAuthed) {
                const paginationData = JSON.parse(pagination) ?? {};
                const bookData = JSON.parse(books) ?? []
                setItems(bookData);
                setPageCount(paginationData.total_pages ?? 1);
            } else if (error) {
                console.error(error)
            } else {
                setShouldSignUp(true);
            }
        })
        .catch(error => console.log(error));
}