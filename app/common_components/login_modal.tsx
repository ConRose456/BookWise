import { Box, Button, FormField, Header, Input, Link, Modal, Popover, SpaceBetween } from "@cloudscape-design/components";
import React, { useContext, useState } from "react"
import { submitLoginForm } from "../helpers/loginForm";
import { AuthTokenStateContext, AuthTokenStateController } from "../controllers/AuthTokenStateController";
import { useEffect } from "react";

export const LoginModal = (
    {
        visible,
        setVisible,
        setSignUpVisible,
        setUserText,
        setAuthed
    }: {
        visible: boolean,
        setVisible: (value: boolean) => any,
        setSignUpVisible: (value: boolean) => any,
        setUserText: (value: string) => any,
        setAuthed: (value: boolean) => any
    }
) => {
    const { authTokenStateController } = useContext(AuthTokenStateContext);

    const [loading, setLoading] = useState(false);

    const [enteredUsername, setEnteredUsername] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");

    const [invalidInputs, setInvalidInputs] = useState(false);

    useEffect(() => {
        setEnteredUsername("");
        setEnteredPassword("");
        setInvalidInputs(false);
        setLoading(false);
    }, [visible]);

    return (
        <Modal
            onDismiss={() => {
                if (!loading) {
                    setVisible(false)
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
                                    setInvalidInputs,
                                    setAuthed
                                );

                                if (login.completed) {
                                    authTokenStateController.setIsAuthorised(
                                        AuthTokenStateController.isAuthorized()
                                    );
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