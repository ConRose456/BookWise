import { Box, Button, Header, Modal } from "@cloudscape-design/components";

export const ErrorContributeBookModal = (
    {
        visible,
        setVisible,
        message
    }: {
        visible: boolean,
        setVisible: (value: boolean) => void,
        message: string
    }
) => {
    return (
        <div>
            <Modal
                visible={visible}
                onDismiss={() => setVisible(false)}
                header={
                    <Header>
                        Failed to contribute book
                    </Header>
                }
                footer={
                    <Box float="right">
                        <Button variant="primary" onClick={() => setVisible(false)}>
                            ok
                        </Button>
                    </Box>
                }
            >
                {message}
            </Modal>
        </div>
    );
}