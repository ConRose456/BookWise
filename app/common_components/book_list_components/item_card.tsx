import * as React from "react";
import Container from "@cloudscape-design/components/container";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Box from "@cloudscape-design/components/box";
import Link from "@cloudscape-design/components/link";
import Button from "@cloudscape-design/components/button";
import { RemoveOwnedBookModal } from "../owned_book_components/removeOwnedBookModal";
import { addOwnedBook } from "../../helpers/userAddOwnedBook";
import { UserOwnsBookModal } from "../owned_book_components/userOwnsBookModal";
import { ContributeBookModal } from "../contribute_components/bookContributionModal";
import { AuthTokenStateController } from "@/app/controllers/AuthTokenStateController";
import { SignUpContext } from "@/app/controllers/SignUpController";

const DEFAULT_BOOK_IMAGE_PATH = "/assets/placeHolderBookImage.jpg";

export const ItemCard = (
  {
    id,
    title,
    author,
    description,
    imageUrl,
    userOwned
  }: {
    id: string,
    title: string,
    author: string,
    description: string,
    imageUrl: string,
    userOwned?: boolean
  }
) => {
  const {setShouldSignUp} = React.useContext(SignUpContext);
  const [contributionModalVisible, setContributionModalVisible] = React.useState(false);

  const [removeModalVisible, setRemoveModalVisible] = React.useState(false);
  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [addModalMessage, setAddModalMessage] = React.useState("");
  const [bookAdded, setBookAdded] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  return (
    <Container
      className="item_card"
      media={{
        content: (
          <img
            src={imageUrl.length > 0 ? imageUrl : DEFAULT_BOOK_IMAGE_PATH}
            alt="book image"
          />
        ),
        position: "side",
        width: "33%",
      }}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="s">
          <Button 
            variant="normal"
            onClick={() => {
              if (AuthTokenStateController.isAuthorized()) {
                setContributionModalVisible(true);
              } else {
                setShouldSignUp(true);
              }
            }}
          >
            Edit
          </Button>
          {!userOwned ?
            <Button
              loading={loading}
              disabled={bookAdded}
              variant={"primary"}
              onClick={async () => {
                setLoading(true);
                if (AuthTokenStateController.isAuthorized()) {
                  await addOwnedBook(id)
                  .then(response => {
                    if (response.success) {
                      setBookAdded(true);
                    } else {
                      setAddModalMessage(response.message)
                      setAddModalVisible(true);
                    }
                  })
                  .catch(error => console.error(error));
                } else {
                  setShouldSignUp(true);
                }
                setLoading(false);
              }}
            >{bookAdded ? "Book Added" : "Add to Owned"}</Button>
            : <Button
              variant="primary"
              onClick={async () => {
                setRemoveModalVisible(true);
              }}
            >Remove Book</Button>
          }
          </SpaceBetween>
        </Box>
      }
    >
      <ContributeBookModal 
        visible={contributionModalVisible} 
        setVisible={setContributionModalVisible} 
        isEdit={true}
        editData={{
          isbn: id,
          title,
          author,
          description
        }}
      />
      <UserOwnsBookModal 
        visible={addModalVisible}
        setVisible={setAddModalVisible} 
        message={addModalMessage}      
      />
      <RemoveOwnedBookModal 
        id={id} 
        title={title}
        visible={removeModalVisible} 
        setVisible={setRemoveModalVisible} 
        loading={loading} 
        setLoading={setLoading} 
      />
      <SpaceBetween direction="vertical" size="xxs">
        <SpaceBetween direction="vertical" size="xxs">
          <Box variant="h2">
            <Link fontSize="heading-m" href="#">
              {title}
            </Link>
          </Box>
          <Box variant="p">Author: {author}</Box>
        </SpaceBetween>
        <Box variant="small" >
          {description.slice(0, 130) + '...'}
        </Box>
      </SpaceBetween>
    </Container>
  );
}