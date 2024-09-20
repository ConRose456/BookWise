import { Box, Button, FormField, Header, Input, Link, Modal, Popover, SpaceBetween } from "@cloudscape-design/components";
import React, { useState } from "react"
import { submitLoginForm } from "../helpers/loginForm";

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
    const [enteredUsername, setEnteredUsername] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");

    const [invalidInputs, setInvalidInputs] = useState(false);

    const resetModal = () => {
        setEnteredUsername("");
        setEnteredPassword("");
        setInvalidInputs(false);
    }

    return (
        <Modal
            onDismiss={() => { 
                setVisible(false) 
                resetModal() 
            }}
            visible={visible}
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button variant="link" onClick={() => setVisible(false)}>Cancel</Button>
                        <Button variant="primary" onClick={async () => {
                            const login = await submitLoginForm(
                                {
                                    username: enteredUsername,
                                    password: enteredPassword
                                },
                                setUserText,
                                setVisible,
                                setInvalidInputs
                            );
                            if (login.completed) {
                                resetModal();
                            }
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
                                setSignUpVisible(true);
                                setVisible(false);
                                resetModal();
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