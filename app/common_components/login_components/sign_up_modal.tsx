import { Box, Button, FormField, Header, Input, Link, Modal, Popover, SpaceBetween } from "@cloudscape-design/components";
import { useContext, useState } from "react";
import { submitSignUpForm } from "../../helpers/signUpForm";
import { AuthTokenStateContext, AuthTokenStateController } from "../../controllers/AuthTokenStateController";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


export const SignUpModal = (
    { 
        visible, 
        setVisible,
        setLoginVisible,
        setUserText,
        setAuthed
    }: { 
        visible: boolean, 
        setVisible: (value: boolean) => any,
        setLoginVisible: (value: boolean) => any,
        setUserText: (value: string) => any ,
        setAuthed: (value: boolean) => any
    }
) => {
    const navigate = useNavigate();
    const { authTokenStateController } = useContext(AuthTokenStateContext);

    const [loading, setLoading] = useState(false);

    const [enteredUsername, setEnteredUsername] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");

    const [invalidInputs, setInvalidInputs] = useState<string[]>();

    const getUsernameErrorText = () => {
        if (invalidInputs?.includes("username")) {
            return "Your username must meet the conditions bellow.";
        } else if (invalidInputs?.includes("username_exists")) {
            return "This username already exists";
        }
        return "";
    }

    useEffect(() => {
        setFirstName("");
        setSecondName("");
        setEnteredUsername("");
        setPassword("");
        setConfirmPassword("");
        setInvalidInputs([]);
        setLoading(false);
    }, [visible]);

    return (
        <Modal
            onDismiss={() => {
                if (!loading) {
                    setVisible(false);
                    navigate("/", { replace: true });
                }
            }}
            visible={visible}
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button 
                            variant="link" 
                            disabled={loading} 
                            onClick={() => {
                                setVisible(false);
                                navigate("/", { replace: true });
                            }}
                        >Cancel</Button>
                        <Button
                            variant="primary"
                            loading={loading}
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true);
                                const signUp = await submitSignUpForm(
                                    {
                                        firstName: firstName,
                                        secondName: secondName,
                                        username: enteredUsername,
                                        password: password,
                                        confirmPassword: confirmPassword
                                    },
                                    setUserText,
                                    setVisible,
                                    setInvalidInputs,
                                    setAuthed
                                );

                                if (signUp.completed) {
                                    authTokenStateController.setIsAuthorised(
                                        AuthTokenStateController.isAuthorized()
                                    );
                                    window.location.reload()
                                }
                                setLoading(false);
                            }}
                        >
                            Sign Up
                        </Button>
                    </SpaceBetween>
                </Box>
            }
            header={
                <Header 
                    info={
                        <Popover 
                            header="Sign Up" 
                            content="You can sing up and create an account here."
                        >
                            <Link>info</Link>
                        </Popover>
                    }
                >
                    Sign Up
                </Header>}
        >
            <SpaceBetween direction="vertical" size="m">

                <FormField
                    label="First Name"
                    description="Enter your First Name"
                    errorText={invalidInputs?.includes("firstName") ? "You must provide a first name." : ""}
                >
                    <Input value={firstName} onChange={({ detail }) => setFirstName(detail.value)} placeholder="first name" />
                </FormField>
                <FormField
                    label={<span>Second Name <i> - optional</i></span>}
                    description="Enter your Second Name"
                >
                    <Input value={secondName} onChange={({ detail }) => setSecondName(detail.value)} placeholder="second name" />
                </FormField>
                <FormField
                    label="Username"
                    description="This username will be used when you log in to your new account."
                    errorText={getUsernameErrorText()}
                >
                    <Input value={enteredUsername} onChange={({ detail }) => setEnteredUsername(detail.value)} placeholder="username" />
                </FormField>
                <FormField
                    label="Password"
                    description="Enter a password it must contain one digit 0-9 and a special character."
                    errorText={invalidInputs?.includes("password_invalid") ? "Your password must meet the requirements bellow." : ""}
                >
                    <Input type="password" value={password} onChange={({ detail }) => setPassword(detail.value)} placeholder="password" />
                </FormField>
                <FormField
                    label="Confirm Password"
                    description="Enter your password again"
                    errorText={invalidInputs?.includes("password_not_equal") ? "This does not match the password you entered." : ""}
                >
                    <Input type="password" value={confirmPassword} onChange={({ detail }) => setConfirmPassword(detail.value)} placeholder="confirm password" />
                </FormField>
                <FormField
                    description={
                        <div>
                          If you have already made an account login here: {" "}
                          <Link
                            variant="primary"
                            fontSize="body-s"
                            onFollow={() => {
                                if (!loading) {
                                    setLoginVisible(true);
                                    setVisible(false);
                                }
                            }}
                          >
                            Login
                          </Link>
                        </div>
                    }
                />
            </SpaceBetween>
        </Modal>
    );
}