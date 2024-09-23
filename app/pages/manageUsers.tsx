import React, { useEffect } from "react";
import { Box, Button, ContentLayout, Header, SpaceBetween, Table, TextFilter } from "@cloudscape-design/components";
import { AuthTokenStateController } from "../controllers/AuthTokenStateController";

export const ManageUsers = () => {
    useEffect(() => {
        if (!AuthTokenStateController.isAdmin()) {
            window.location.href = "/forbidden";
        }
        window.history.pushState(
            {},
            "",
            `${window.location.origin}#/manage_users`,
        );
    });

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
                            items={[]}
                            columnDefinitions={[
                                {
                                    id: "username",
                                    header: "Username",
                                    cell: item => item,
                                },
                                {
                                    id: "fisrt_name",
                                    header: "First Name",
                                    cell: item => item,
                                },
                                {
                                    id: "second_name",
                                    header: "Second Name",
                                    cell: item => item,
                                },
                                {
                                    id: "is_admin",
                                    header: "Admin",
                                    cell: item => item,
                                }
                            ]}
                        />
                    </SpaceBetween>
                </div>
            </ContentLayout>
        </div>
    );
}