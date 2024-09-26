import { AuthTokenStateController } from "@/app/controllers/AuthTokenStateController";

export const deleteUser = async (username: string, setVisible: (value: boolean) => void) =>
    await fetch(
        "/api/delete_user",
        {
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "charset": 'UTF-8',
                "Authorization": `Bearer ${AuthTokenStateController.getAuthToken()}`
            },
            body: JSON.stringify({ username })
        }
    ).then(response => response.json())
        .then(data => {
            if (data.success) {
                window.location.reload();
            } else {
                alert(`Failed to Delete ${username}`);
                console.log("Delete Failed");
            }
            setVisible(false);
        })
        .catch(error => console.error(error));