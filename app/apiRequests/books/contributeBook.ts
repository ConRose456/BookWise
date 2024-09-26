import { AuthTokenStateController } from "@/app/controllers/AuthTokenStateController";
import { validateBookInputs } from "@/app/helpers/validateBookInputs";

export const contributeBook = async (
    bookData: {
    isbn: string,
    title: string,
    author: string,
    description: string,
    image: File | undefined
}) => {
    const formData = formatContributionData(bookData);
    const inValidInputs = validateBookInputs(bookData);

    return inValidInputs.length == 0 ? await contributeBookRequest({ 
        endpoint: "/api/contribute_book", 
        formData 
    }) : { success: false, inValidInputs: true };
}

export const contributeBookRequest = async (
    { endpoint, formData } 
    : { endpoint: string, formData: FormData }
) => {
    return await fetch(
        endpoint, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${AuthTokenStateController.getAuthToken()}`
            },
            body: formData
        }
    ).then(response => response.json())
    .catch(error => console.log(error));
}

export const formatContributionData = (
    { isbn, title, author, description, image }
    : { isbn: string, title: string, author: string, description: string, image: File | undefined  }
) => {
    const formData = new FormData();
    formData.append('isbn', isbn);
    formData.append('title', title);
    formData.append('author', author);
    formData.append('description', description);

    if (image) {
        formData.append('image', image);
    }
    return formData;
}