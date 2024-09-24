import { AuthTokenStateController } from "../controllers/AuthTokenStateController";

export const contributeBook = async ({
    isbn,
    title,
    author,
    description,
    image
}: {
    isbn: string,
    title: string,
    author: string,
    description: string,
    image: File | undefined
}) => {
    const formData = new FormData();
    formData.append('isbn', isbn);
    formData.append('title', title);
    formData.append('author', author);
    formData.append('description', description);
    if (image) {
        formData.append('image', image);
    }

    return await fetch(
        "/api/contribute_book", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${AuthTokenStateController.getAuthToken()}`
            },
            body: formData
        }
    ).then(response => response.json())
    .catch(error => console.log(error));
}