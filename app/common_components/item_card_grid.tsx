import { Grid } from "@cloudscape-design/components";
import React from "react";
import { ItemCard } from "./item_card";

export const ItemCardGrid = ({items}: {items: any[] | undefined}) => {
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