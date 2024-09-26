import { submitLoginRequest } from "./login";

export const submitSignUpForm = async (
    { firstName, secondName, username, password, confirmPassword }
        : { firstName: string, secondName: string, username: string, password: string, confirmPassword: string },
    setUserText: (value: any) => any,
    setVisible: (value: boolean) => any,
    setInvalidInputs: (value: any[] | undefined) => any,
    setAuthed: (value: boolean) => any
) => {
    const invalidInputs = [];

    const usernameExist = await usernameExists(username);

    if (firstName.length == 0) {
        invalidInputs.push("firstName")
    }
    if (usernameExist) {
        invalidInputs.push("username_exists");
    }
    if (!validateUsername(username)) {
        invalidInputs.push("username");
    }
    if (!validatePassword(password)) {
        invalidInputs.push("password_invalid");
    }
    if (!isPasswordEqual(password, confirmPassword)) {
        invalidInputs.push("password_not_equal");
    }

    const isUsernameValid = validateUsername(username) && !usernameExist;
    const isPasswordValid = validatePassword(password) && isPasswordEqual(password, confirmPassword);

    if (isUsernameValid && isPasswordValid) {
        return await submitLoginRequest(
            "/api/sign_up",
            {
                username,
                password,
                first_name: firstName,
                second_name: secondName
            }, {
            setAuthed,
            setUserText,
            setVisible
        });
    } else {
        setInvalidInputs(invalidInputs);
        return { completed: false };
    }
}

const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
const passwordRegex = /^(?=.*\d)(?=.*[^\w\s])\S{7,}$/;

const validateUsername = (username: string): boolean => {
    return usernameRegex.test(username);
}

const usernameExists = async (username: string) => {
    const { exists } = await fetch("/api/check_username_exists", {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json',
            "charset": 'UTF-8'
        },
        body: JSON.stringify({ username: username })
    }).then(reponse => reponse.json())
        .catch(error => console.log(error));

    return exists;
}

const validatePassword = (password: string): boolean => {
    return passwordRegex.test(password);
}

const isPasswordEqual = (password: string, confirmPassword: string) => {
    return password === confirmPassword;
}