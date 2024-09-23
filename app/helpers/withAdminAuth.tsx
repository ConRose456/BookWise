import React, { useEffect, useState } from "react";
import { AuthTokenStateController } from "../controllers/AuthTokenStateController";
import { useNavigate } from "react-router-dom";

export const withAdminAuth = (WrappedComponent: any) => {
    return function AdminProtected(props: any) {
        const navigate = useNavigate()
        const [isAdmin, setIsAdmin] = useState(false);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const checkAdminStatus = async () => {
                try {
                    setIsAdmin(await AuthTokenStateController.isAdminAuthedByServer());
                } catch (error) {
                    window.location.href = '/forbidden';
                } finally {
                    setLoading(false);
                }
            };
            checkAdminStatus();
        }, [navigate]);

        if (loading) {
            return <div></div>;
        }

        if (!isAdmin) {
            window.location.href = '/forbidden';
        }

        return <WrappedComponent {...props} />;
    };
};