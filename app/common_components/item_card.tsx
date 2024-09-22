import * as React from "react";
import Container from "@cloudscape-design/components/container";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Box from "@cloudscape-design/components/box";
import Link from "@cloudscape-design/components/link";
import Button from "@cloudscape-design/components/button";
import { removeOwnedBook } from "../helpers/userRemoveOwnedBook";
import { RemoveOwnedBookModal } from "./removeOwnedBookModal";

export const ItemCard = (
  {
    id,
    title,
    author,
    description,
    imageUrl,
    userOwned
  }: {
    id: number,
    title: string,
    author: string,
    description: string,
    imageUrl: string,
    userOwned?: boolean
  }
) => {
  const [modaVisible, setModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  return (
    <Container
      className="item_card"
      media={{
        content: (
          <img
            src="https://images.unsplash.com/photo-1566041510639-8d95a2490bfb?q=80&w=3371&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="book image"
          />
        ),
        position: "side",
        width: "33%",
      }}
      footer={
        <Box>
          {!userOwned ?
            <Button>Add to Owned</Button>
            : <Button
              onClick={async () => {
                setModalVisible(true);
              }}
            >Remove Book</Button>
          }
        </Box>
      }
    >
      <RemoveOwnedBookModal 
        id={id} 
        title={title}
        visible={modaVisible} 
        setVisible={setModalVisible} 
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