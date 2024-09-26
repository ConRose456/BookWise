import { AuthTokenStateController } from "../../controllers/AuthTokenStateController";

export const submitLoginForm = async (
    { username, password }
        : { username: string, password: string },
    setUserText: (value: any) => any,
    setVisible: (value: boolean) => any,
    setInvalidInputs: (value: boolean) => any,
    setAuthed: (value: boolean) => any
) => {
    const { completed } = await submitLoginRequest(
        "/api/login",
        { username, password }, 
        {
            setAuthed,
            setUserText,
            setVisible
        }
    );

    if (!completed) {
        setInvalidInputs(true);
    }
    return { completed };
}

export const submitLoginRequest = async (
    endpoint: string,
    userData: {
        username: string,
        password: string,
        first_name?: string,
        second_name?: string
    },
    setStates: {
        setAuthed: (value: boolean) => void,
        setUserText: (value: boolean) => void,
        setVisible: (value: boolean) => void
    }
) => {
    const { userText, token, errors } = await fetch(endpoint, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            "charset": 'UTF-8'
        },
        body: JSON.stringify(userData),
    })
        .then(response => response.json())
        .catch((error) => console.log(error));
    
    if (!errors) {
        AuthTokenStateController.setAuthToken(token);
        setStates.setAuthed(true);
        setStates.setUserText(userText);
        setStates.setVisible(false);
        return { completed: true };
    } else {
        console.error(errors);
        return { completed: false };
    }
}

