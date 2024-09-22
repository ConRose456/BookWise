import { AuthTokenStateController } from "../controllers/AuthTokenStateController";

export const removeOwnedBook = async (titleId: number) => {
    return await fetch(
        "/api/remove_user_book", {
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