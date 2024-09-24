import React, { useContext, useEffect, useState } from "react";
import { Box, Button, FileUpload, FormField, Header, Input, Modal, SpaceBetween, Textarea } from "@cloudscape-design/components";
import { contributeBook, editBook } from "@/app/helpers/contributeBookForm";
import { validateBookInputs, validateImage } from "@/app/helpers/validateBookInputs";
import { AuthTokenStateController } from "@/app/controllers/AuthTokenStateController";
import { SignUpContext } from "@/app/controllers/SignUpController";
import { ErrorContributeBookModal } from "./contributeErrorModal";

export const ContributeBookModal = (
    {
        visible,
        setVisible,
        isEdit,
        editData
    }: {
        visible: boolean,
        setVisible: (value: boolean) => void,
        isEdit?: boolean
        editData?: {
            isbn: string,
            title: string,
            author: string,
            description: string
        }
    }
) => {
    const { setShouldSignUp } = useContext(SignUpContext);

    const [errorModalVisible, setErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [isbn, setIsbn] = useState("");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | undefined>(undefined);

    const [loading, setLoading] = useState(false);

    const [validInputs, setValidInputs] = useState<string[]>([]);
    const [fileErrors, setFileError] = useState<string[]>([])

    useEffect(() => {
        if (isEdit) {
            setIsbn(editData?.isbn ?? "");
            setTitle(editData?.title ?? "");
            setAuthor(editData?.author ?? "");
            setDescription(editData?.description ?? "");
        }
    }, []);

    // Ensure user is Authed
    useEffect(() => {
        if (visible) {
            if (!AuthTokenStateController.isAuthorized()) {
                setVisible(false);
                setShouldSignUp(true);
            }
        }
        if (!isEdit) {
            setIsbn("");
            setTitle("");
            setAuthor("");
            setDescription("");
            setValidInputs([]);
        }
    }, [visible]);

    useEffect(() => {
        validateImage(imageFile, setFileError)
    }, [imageFile]);

    const onReponse = (response: any) => {
        if (response.success) {
            window.location.reload();
            setVisible(false);
        } else {
            setErrorMessage(response.message ?? "Uknown error");
            setErrorModalVisible(true);
        }
    }

    return (
        <div>
            <Modal
                visible={visible}
                onDismiss={() => setVisible(false)}
                header={
                    <Header>
                        {isEdit ? "Edit your book" : "Contribute a Book"}
                    </Header>
                }
                footer={
                    <Box float="right">
                        <SpaceBetween direction="horizontal" size="xs">
                            <Button onClick={() => setVisible(false)}>Cancel</Button>
                            <Button 
                                loading={loading}
                                variant="primary"
                                onClick={async() => {
                                    setLoading(true);

                                    const bookData = {
                                        isbn,
                                        title,
                                        author,
                                        description,
                                        image: imageFile
                                    }

                                    setValidInputs(validateBookInputs(bookData));
                                    if (validInputs?.length === 0 && fileErrors?.length === 0) {
                                        if (isEdit) {
                                            await editBook(bookData).then(response => onReponse(response));
                                        } else {
                                            await contributeBook(bookData).then(response => onReponse(response));
                                        }
                                    }
                                    setLoading(false);
                                }}
                            >
                                Submit
                            </Button>
                        </SpaceBetween>
                    </Box>
                }
            >
                <ErrorContributeBookModal
                    visible={errorModalVisible}
                    setVisible={setErrorModalVisible}
                    message={errorMessage}
                />
                <SpaceBetween direction="vertical" size="l">
                    <FormField
                        label="ISBN"
                        description="Enter the Books unique ISBN number."
                        errorText={validInputs?.includes("isbn") ? "You must enter an ISBN." : ""}
                    >
                        <Input
                            placeholder="Enter ISBN"
                            value={isbn}
                            disabled={isEdit}
                            onChange={({ detail }) => setIsbn(detail.value.replace(" ", ""))}
                        />
                    </FormField>
                    <FormField
                        label="Title"
                        description="Enter the books title."
                        errorText={validInputs?.includes("title") ? "You must enter a title." : ""}
                    >
                        <Input
                            placeholder="Enter book title"
                            value={title}
                            onChange={({ detail }) => setTitle(detail.value)}
                        />
                    </FormField>
                    <FormField
                        label="Author"
                        description="Enter the author of the book."
                        errorText={validInputs?.includes("author") ? "You must enter an author." : ""}
                    >
                        <Input
                            placeholder="Enter author's name"
                            value={author}
                            onChange={({ detail }) => setAuthor(detail.value)}
                        />
                    </FormField>
                    <FormField
                        label="Description"
                        description="Enter a description of the book or the books blurb"
                        errorText={validInputs?.includes("description") ? "You must enter a description." : ""}
                    >
                        <Textarea
                            onChange={({ detail }) => setDescription(detail.value)}
                            value={description}
                            placeholder="Book description..."
                        />
                    </FormField>

                    <FormField
                        label={`Book Cover Image ${isEdit ? " - The image won't change if you don't upload a new one." : ""}`}
                        description="Upload a photo of the books cover."
                    >
                        <FileUpload
                            value={imageFile ? [imageFile] : []}
                            fileErrors={fileErrors}
                            accept="image/*"
                            onChange={({ detail }) => {
                                const uploadedFile = detail.value[0];
                                setImageFile(uploadedFile);
                            }}
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
                            tokenLimit={1}
                            constraintText="Max file size 50MB"
                        />
                    </FormField>
                </SpaceBetween>
            </Modal>
        </div>
    );
}

