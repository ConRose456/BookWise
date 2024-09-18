import { Box, Button, FormField, Header, Input, Link, Modal, SpaceBetween } from "@cloudscape-design/components";
import React, { useState } from "react"

export const LoginModal = (
    { 
        visible, 
        setVisible, 
        setUserText 
    }: { 
        visible: boolean, 
        setVisible: (value: boolean) => any, 
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
            header={<Header info={<Link onFollow={() => setVisible(false)}>Sign Up</Link>}>Login</Header>}
        >
            <SpaceBetween direction="vertical" size="m">
                <FormField
                    label="Username"
                    description="The username you created your account with"
                >
                    <Input value={enteredUsername} onChange={({ detail }) => setEnteredUsername(detail.value)} placeholder="username" />
                </FormField>
                <FormField
                    label="Password"
                    description="Enter your password"
                >
                    <Input value={enderedPassword} onChange={({ detail }) => setEnteredPassword(detail.value)} placeholder="password" />
                </FormField>
            </SpaceBetween>
        </Modal>
    );
}