import { AuthTokenStateController } from "../controllers/AuthTokenStateController";

export const submitLoginForm = async (
    { username, password }
        : { username: string, password: string },
    setUserText: (value: any) => any,
    setVisible: (value: boolean) => any,
    setInvalidInputs: (value: boolean) => any
) => {
    const { userText, token, errors } = await fetch("/api/login", {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            "charset": 'UTF-8'
        },
        body: JSON.stringify({ username, password }),
    })
        .then(response => response.json())
        .catch(error => console.error(error));

    if (!errors) {
        AuthTokenStateController.setAuthToken(token);
        setUserText(userText);
        setVisible(false);
        return { completed: true };
    }
    setInvalidInputs(true);
    console.error(errors);
    return { completed: false };
}

