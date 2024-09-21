import { Grid } from "@cloudscape-design/components";
import React, { useEffect, useState } from "react";
import { ItemCard } from "./item_card";

export const ItemCardGrid = () => {
    const [items, setItems] = useState<any[]>();

    useEffect(() => {
        const fetchBooks: any = async () => {
            const { books, errors } = await fetch("/api/all_books", {
                method: "GET",
                headers: {
                    "Content-Type": 'application/json',
                    "charset": 'UTF-8'
                }
            }).then(response => response.json());

            setItems(JSON.parse(books));
        }
        fetchBooks();
    }, []);

    return (
        <div className="items_grid">
            <Grid

                gridDefinition={[
                    { colspan: 4 },
                    { colspan: 4 },
                ]}
            >
                {items?.map(
                    (item) => (
                        <div>
                            <ItemCard
                                title={item.title}
                                author={item.author}
                                description={item.description}
                                imageUrl={item.image_url}
                            />
                        </div>
                    )
                ) ?? []}
            </Grid>
        </div>

    )
}