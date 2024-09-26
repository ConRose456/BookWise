import { validateBookInputs } from "@/app/helpers/validateBookInputs";
import { contributeBookRequest, formatContributionData } from "./contributeBook";

export const editBook = async (
    bookData : {
    isbn: string,
    title: string,
    author: string,
    description: string,
    image: File | undefined
}) => {
    const formData = formatContributionData(bookData);
    const inValidInputs = validateBookInputs(bookData)

    return inValidInputs.length == 0 ? await contributeBookRequest({
        endpoint: "/api/edit_book", 
        formData
    }) : { success: false, inValidInputs: true };
}