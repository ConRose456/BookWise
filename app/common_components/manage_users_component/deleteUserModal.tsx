
import React, { useState } from "react";
import { Box, Button, Header, Modal, SpaceBetween } from "@cloudscape-design/components";
import { AuthTokenStateController } from "@/app/controllers/AuthTokenStateController";

export const DeleteUserModal = (
    {
        visible,
        setVisible,
        username
    }: {
        visible: boolean,
        setVisible: (value: boolean) => void,
        username: string
    }
) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true)
        await fetch(
            "/api/delete_user",
            {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                    "charset": 'UTF-8',
                    "Authorization": `Bearer ${AuthTokenStateController.getAuthToken()}`
                },
                body: JSON.stringify({ username })
            }
        ).then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.reload();
                } else {
                    alert(`Failed to Delete ${username}`);
                    console.log("Delete Failed");
                }
                setVisible(false);
            })
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    }
    return (
        <Modal
            visible={visible}
            onDismiss={() => setVisible(false)}
            header={
                <Header>
                    Confirm Delete
                </Header>
            }
            footer={
                <Box float="right">
                    <SpaceBetween direction="horizontal" size="xs">
                        <Button onClick={() => setVisible(false)}>Cancel</Button>
                        <Button
                            variant="primary"
                            onClick={async () => handleDelete()}
                            loading={loading}
                        >
                            Delete
                        </Button>
                    </SpaceBetween>
                </Box>
            }
        >
            {`Are you sure you want to irreversibly delete ${username}`}
        </Modal>
    );
}