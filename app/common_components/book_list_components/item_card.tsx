import * as React from "react";
import Container from "@cloudscape-design/components/container";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Box from "@cloudscape-design/components/box";
import Link from "@cloudscape-design/components/link";
import Button from "@cloudscape-design/components/button";
import { RemoveOwnedBookModal } from "../owned_book_components/removeOwnedBookModal";
import { addOwnedBook } from "../../helpers/userAddOwnedBook";
import { UserOwnsBookModal } from "../owned_book_components/userOwnsBookModal";

const DEFAULT_BOOK_IMAGE_PATH = "/_next/static/media/placeHolderBookImage.cb3308a7.jpg";

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
  const [removeModalVisible, setRemoveModalVisible] = React.useState(false);
  const [addModalVisible, setAddModalVisible] = React.useState(false);
  const [addModalMessage, setAddModalMessage] = React.useState("");

  const [loading, setLoading] = React.useState(false);

  const [bookAdded, setBookAdded] = React.useState(false);
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
          {!userOwned ?
            <Button
              loading={loading}
              disabled={bookAdded}
              variant={bookAdded ? "primary" : "normal"}
              onClick={async () => {
                setLoading(true);
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
                  setLoading(false);
              }}
            >{bookAdded ? "Book Added" : "Add to Owned"}</Button>
            : <Button
              onClick={async () => {
                setRemoveModalVisible(true);
              }}
            >Remove Book</Button>
          }
        </Box>
      }
    >
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