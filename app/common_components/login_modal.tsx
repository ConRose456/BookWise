import { Box, Button, FormField, Header, Input, Link, Modal, Popover, SpaceBetween } from "@cloudscape-design/components";
import React, { useContext, useState } from "react"
import { submitLoginForm } from "../helpers/loginForm";
import { AuthTokenStateContext } from "../page";
import { AuthTokenStateController } from "../controllers/AuthTokenStateController";

export const LoginModal = (
    {
        visible,
        setVisible,
        setSignUpVisible,
        setUserText
    }: {
        visible: boolean,
        setVisible: (value: boolean) => any,
        setSignUpVisible: (value: boolean) => any,
        setUserText: (value: string) => any
    }
) => {
    const { authTokenStateController } = useContext(AuthTokenStateContext);

    const [loading, setLoading] = useState(false);

    const [enteredUsername, setEnteredUsername] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");

    const [invalidInputs, setInvalidInputs] = useState(false);

    const resetModal = () => {
        setEnteredUsername("");
        setEnteredPassword("");
        setInvalidInputs(false);
        setLoading(false);
    }

    return (
        <Modal
            onDismiss={() => {
                if (!loading) {
                    setVisible(false)
                    resetModal()
                }
            }}
            visible={visible}
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button variant="link" disabled={loading} onClick={() => setVisible(false)}>Cancel</Button>
                        <Button
                            variant="primary"
                            loading={loading}
                            disabled={loading}
                            onClick={async () => {
                                setLoading(true);
                                const login = await submitLoginForm(
                                    {
                                        username: enteredUsername,
                                        password: enteredPassword
                                    },
                                    setUserText,
                                    setVisible,
                                    setInvalidInputs
                                );

                                authTokenStateController.setIsAuthorised(
                                    AuthTokenStateController.isAuthorized()
                                );

                                if (login.completed && authTokenStateController.isAuthorized) {
                                    resetModal();
                                }
                                setLoading(false);
                            }}>Login</Button>
                    </SpaceBetween>
                </Box>
            }
            header={
                <Header
                    info={
                        <Popover
                            header="Login"
                            content="You can login to your account here."
                        >
                            <Link>info</Link>
                        </Popover>
                    }
                >
                    Login
                </Header>
            }
        >
            <SpaceBetween direction="vertical" size="m">
                <FormField
                    label="Username"
                    description="The username you created your account with."
                >
                    <Input value={enteredUsername} invalid={invalidInputs} onChange={({ detail }) => setEnteredUsername(detail.value)} placeholder="username" />
                </FormField>
                <FormField
                    label="Password"
                    description="Enter your password."
                    errorText={invalidInputs ? "Incorrect Username or Password." : ""}
                >
                    <Input type="password" value={enteredPassword} onChange={({ detail }) => setEnteredPassword(detail.value)} placeholder="password" />
                </FormField>
                <FormField
                    description={
                        <div>
                            If you don't have an account create on here: {" "}
                            <Link
                                variant="primary"
                                fontSize="body-s"
                                onFollow={() => {
                                    if (!loading) {
                                        setSignUpVisible(true);
                                        setVisible(false);
                                        resetModal();
                                    }
                                }}
                            >
                                Sign Up
                            </Link>
                        </div>
                    }
                />
            </SpaceBetween>
        </Modal>
    );
}