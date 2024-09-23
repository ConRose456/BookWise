import { AuthTokenStateController } from "../controllers/AuthTokenStateController";

export const contributeBook = async ({
    isbn,
    title,
    author,
    description,
    imageUrl
}: {
    isbn: string,
    title: string,
    author: string,
    description: string,
    imageUrl: string
}) => {
    return await fetch(
        "/api/contribute_book", {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "charset": 'UTF-8',
                "Authorization": `Bearer ${AuthTokenStateController.getAuthToken()}`
            },
            body: JSON.stringify({ 
                isbn,
                title,
                author,
                description,
                imageUrl
            })
        }
    ).then(response => response.json())
    .catch(error => console.log(error));
}