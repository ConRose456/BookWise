import { Box, Button, FormField, Header, Input, Link, Modal, Popover, SpaceBetween } from "@cloudscape-design/components";
import { useState } from "react";


export const SignUpModal = (
    { 
        visible, 
        setVisible,
        setLoginVisible,
        setUserText
    }: { 
        visible: boolean, 
        setVisible: (value: boolean) => any,
        setLoginVisible: (value: boolean) => any,
        setUserText: (value: string) => any 
    }
) => {
    const [enteredUsername, setEnteredUsername] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [firstName, setFirstName] = useState("");
    const [secondName, setSecondName] = useState("");

    return (
        <Modal
            onDismiss={() => setVisible(false)}
            visible={visible}
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button variant="link" onClick={() => setVisible(false)}>Cancel</Button>
                        <Button
                            variant="primary"
                            onClick={async () => {
                                const { username, token } = await fetch("/api/sign_up", {
                                    method: 'POST',
                                    headers: {
                                        "Content-Type": 'application/json',
                                        "charset": 'UTF-8'
                                    },
                                    body: JSON.stringify({
                                        username: enteredUsername,
                                        password,
                                        first_name: firstName,
                                        second_name: secondName,
                                    }),
                                })
                                    .then(response => response.json())
                                    .catch((error) => console.log(error));
                                sessionStorage.setItem("JWT Token", token);
                                setUserText(username);
                                setVisible(false);
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
                >
                    <Input value={firstName} onChange={({ detail }) => setFirstName(detail.value)} placeholder="first name" />
                </FormField>
                <FormField
                    label="Second Name"
                    description="Enter your Second Name"
                >
                    <Input value={secondName} onChange={({ detail }) => setSecondName(detail.value)} placeholder="second name" />
                </FormField>
                <FormField
                    label="Username"
                    description="This username will be used when you log in to your new account"
                >
                    <Input value={enteredUsername} onChange={({ detail }) => setEnteredUsername(detail.value)} placeholder="username" />
                </FormField>
                <FormField
                    label="Password"
                    description="Enter your password"
                >
                    <Input value={password} onChange={({ detail }) => setPassword(detail.value)} placeholder="password" />
                </FormField>
                <FormField
                    label="Confirm Password"
                    description="Enter your password again"
                >
                    <Input value={confirmPassword} onChange={({ detail }) => setConfirmPassword(detail.value)} placeholder="confirm password" />
                </FormField>
                <FormField
                    description={
                        <div>
                          If you have already made an account login here: {" "}
                          <Link
                            variant="primary"
                            fontSize="body-s"
                            onFollow={() => {
                                setLoginVisible(true)
                                setVisible(false)
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