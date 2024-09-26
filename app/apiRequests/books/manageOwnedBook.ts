import { AuthTokenStateController } from "@/app/controllers/AuthTokenStateController";

export const manageOwnedBook = async (isbn: string, endpoint: string) => {
    return await fetch(
        endpoint, 
        {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "charset": 'UTF-8',
                "Authorization": `Bearer ${AuthTokenStateController.getAuthToken()}`
            },
            body: JSON.stringify({ title_id: isbn })
        }
    ).then(response => response.json())
    .catch(error => console.log(error));
}