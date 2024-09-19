import { Box, Button, FormField, Header, Input, Link, Modal, Popover, SpaceBetween } from "@cloudscape-design/components";
import React, { useState } from "react"

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
    const [enderedPassword, setEnteredPassword] = useState("");

    return (
        <Modal
            onDismiss={() => setVisible(false)}
            visible={visible}
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button variant="link" onClick={() => setVisible(false)}>Cancel</Button>
                        <Button variant="primary" onClick={async () => {
                            const { username, token } = await fetch("/api/login", {
                                method: 'POST',
                                headers: {
                                    "Content-Type": 'application/json',
                                    "charset": 'UTF-8'
                                },
                                body: JSON.stringify({ username: enteredUsername, password: enderedPassword }),
                            })
                            .then(response => response.json());
                            sessionStorage.setItem("JWT Token", token);
                            setUserText(username);
                            setVisible(false);
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
                    <Input value={enteredUsername} onChange={({ detail }) => setEnteredUsername(detail.value)} placeholder="username" />
                </FormField>
                <FormField
                    label="Password"
                    description="Enter your password."
                >
                    <Input value={enderedPassword} onChange={({ detail }) => setEnteredPassword(detail.value)} placeholder="password" />
                </FormField>
                <FormField
                    description={
                        <div>
                          If you don't have an account create on here: {" "}
                          <Link
                            variant="primary"
                            fontSize="body-s"
                            onFollow={() => {
                                setSignUpVisible(true)
                                setVisible(false)
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