import { Box, Button, Modal } from "@cloudscape-design/components";

export const UserOwnsBookModal = (
    {
        visible, 
        setVisible,
        message
    }: {
        visible: boolean, 
        setVisible: (value: boolean) => void,
        message: string
    }
) => (
    <Modal 
        visible={visible}
        onDismiss={() => setVisible(false)}
        header="BookWise"
        footer={
            <Box float="right">
                <Button onClick={() => setVisible(false)}>Continue</Button>
            </Box>
        }
    >
        {message}
    </Modal>
);