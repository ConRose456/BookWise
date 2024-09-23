import React, { useState } from "react";
import { Box, Button, FileUpload, FormField, Header, Input, Modal, SpaceBetween, Textarea } from "@cloudscape-design/components";

export const ContributeBookModal = (
    {
        visible,
        setVisible,
    }: {
        visible: boolean,
        setVisible: (value: boolean) => void
    }
) => {
    const [isbn, setIsbn] = useState("");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");

    return (
        <div>
            <Modal
                visible={visible}
                onDismiss={() => setVisible(false)}
                header={
                    <Header>
                        Contribute a Book
                    </Header>
                }
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button>Cancel</Button>
                            <Button variant="primary">Submit</Button>
                        </SpaceBetween>
                    </Box>
                }
            >
                <SpaceBetween direction="vertical" size="l">
                    <FormField label="ISBN">
                        <Input placeholder="Enter ISBN" value={isbn} onChange={({detail}) => setIsbn(detail.value.replace(" ", ""))}/>
                    </FormField>

                    <FormField label="Title">
                        <Input placeholder="Enter book title" value={title} onChange={({detail}) => setTitle(detail.value)} />
                    </FormField>

                    <FormField label="Author">
                        <Input placeholder="Enter author's name" value={author} onChange={({detail}) => setAuthor(detail.value)} />
                    </FormField>

                    <FormField label="Description">
                        <Textarea
                            onChange={({detail}) => setDescription(detail.value)}
                            value={description}
                            placeholder="This is a placeholder"
                        />
                    </FormField>

                    <FormField
                        label="Form field label"
                        description="Description"
                    >
                        <FileUpload
                            onChange={() => {}}
                            value={[]}
                            i18nStrings={{
                                uploadButtonText: () => "Choose file",
                                dropzoneText: () => "Drop file to upload",
                                removeFileAriaLabel: () => `Remove file`,
                                limitShowFewer: "Show fewer files",
                                limitShowMore: "Show more files",
                                errorIconAriaLabel: "Error"
                            }}
                            showFileLastModified
                            showFileSize
                            showFileThumbnail
                            tokenLimit={3}
                            constraintText="Hint text for file requirements"
                        />
                    </FormField>
                </SpaceBetween>
            </Modal>
        </div>
    );
}