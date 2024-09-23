import React from "react";
import { Home } from "./pages/home";
import { OwnedBooks } from "./pages/ownedBooks";
import { Route, Routes } from "react-router-dom";
import { ManageUsers } from "./pages/manageUsers";

export default function PageRoute() {
    return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/owned_books" element={<OwnedBooks />} />
                <Route path="/manage_users" element={<ManageUsers />} />
            </Routes>
    );
};