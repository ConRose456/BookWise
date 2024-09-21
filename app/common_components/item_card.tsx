import * as React from "react";
import Container from "@cloudscape-design/components/container";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Box from "@cloudscape-design/components/box";
import Link from "@cloudscape-design/components/link";
import Button from "@cloudscape-design/components/button";

export const ItemCard = (
    {
        title,
        author,
        description,
        imageUrl
    } : {
        title: string,
        author: string,
        description: string,
        imageUrl: string,
    }
) => {
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
            <Button>Add to Owned Books</Button>
        </Box>
      }
    >
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