
import React, { useState } from "react";
import { Box, Button, Header, Modal, SpaceBetween } from "@cloudscape-design/components";
import { AuthTokenStateController } from "@/app/controllers/AuthTokenStateController";
import { deleteUser } from "@/app/apiRequests/userManagement/deleteUser";

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
        await deleteUser(username, setVisible).finally(() => setLoading(false));
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