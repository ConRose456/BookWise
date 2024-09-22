import { AuthTokenStateController } from "../controllers/AuthTokenStateController";

export const addOwnedBook = async (titleId: number) => {
    return await fetch(
        "/api/add_owned_book", {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "charset": 'UTF-8',
                "Authorization": `Bearer ${AuthTokenStateController.getAuthToken()}`
            },
            body: JSON.stringify({ title_id: titleId })
        }
    ).then(response => response.json())
    .catch(error => console.log(error));
}