import React, { useEffect, useState } from "react";
import { Box, Button, ContentLayout, Header, SpaceBetween, StatusIndicator, Table, TextFilter } from "@cloudscape-design/components";
import { AuthTokenStateController } from "../controllers/AuthTokenStateController";

export default function ManageUsers() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState("");

    useEffect(() => {
        window.history.pushState(
            {},
            "",
            `${window.location.origin}#/manage_users`,
        );
    });

    useEffect(() => {
        const fetchData = async () => {
            return await fetch(
                "/api/users",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": 'application/json',
                        "charset": 'UTF-8',
                        "Authorization": `Bearer ${AuthTokenStateController.getAuthToken()}`
                    }
                }
            ).then(response => response.json())
                .then(data => {
                    if (data.status === 403) {
                        window.location.href = "/forbidden";
                    } else {
                        setItems(data.data);
                    }
                    setLoading(false);
                });
        }
        fetchData();
    }, [])

    return (
        <div>

            <ContentLayout
                defaultPadding
                headerVariant="high-contrast"
                header={
                    <Header
                        className='header'
                        variant="h1"
                        description="Search the books you own!"
                    >
                        Manage Users
                    </Header>
                }
            >
                <div className="user_table">
                    <SpaceBetween direction='vertical' size='l'>
                        <Table
                            loading={loading}
                            header={
                                <Header
                                    actions={
                                        <Box float="right">
                                            <Button variant="primary">Delete User</Button>
                                        </Box>
                                    }
                                >
                                    Users
                                </Header>
                            }
                            filter={
                                <TextFilter
                                    filteringPlaceholder="Find Users"
                                    filteringText=""
                                />
                            }
                            empty={
                                <Box
                                    margin={{ vertical: "xs" }}
                                    textAlign="center"
                                    color="inherit"
                                >
                                    <SpaceBetween size="m">
                                        <b>No Users Exist</b>
                                    </SpaceBetween>
                                </Box>
                            }
                            loadingText="Loading Users"
                            items={items}
                            selectionType="single"
                            columnDefinitions={[
                                {
                                    id: "username",
                                    header: "Username",
                                    cell: e => e.username,
                                    sortingField: "username"
                                },
                                {
                                    id: "fisrt_name",
                                    header: "First Name",
                                    cell: e => e.first_name,
                                    sortingField: "first_name"
                                },
                                {
                                    id: "second_name",
                                    header: "Second Name",
                                    cell: e => e.second_name,
                                    sortingField: "second_name"
                                },
                                {
                                    id: "is_admin",
                                    header: "Admin",
                                    cell: e => (
                                        <StatusIndicator
                                            type={e.is_admin ? "success" : "error"}
                                        >
                                            {e.is_admin ? "TRUE" : "FALSE"}
                                        </StatusIndicator>
                                    ),
                                    sortingField: "is_admin"
                                }
                            ]}
                        />
                    </SpaceBetween>
                </div>
            </ContentLayout>
        </div>
    );
}