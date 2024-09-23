import { jwtDecode } from 'jwt-decode';
import React from 'react';

export const AuthTokenStateContext = React.createContext(
    {
      userDisplayTextUseState: {} as any,
      authTokenStateController: {} as any
    }
);

export class AuthTokenStateController {
    public static readonly STORAGE_ID = "bw-jwt-auth-token";

    public static isAuthorized = () => {
        if (this.isAuthTokenExp()) {
            return false;
        }
        return true;
    }

    // Will ensure user is admin authed though there token on client side for UI differnces
    public static isAdmin = () => {
        const token = this.getAuthToken()
        if (this.isAuthorized() && token) {
            const decodedToken = jwtDecode(token) as any;
            if (decodedToken.is_admin) {
                return true;
            }
            return false;
        }   
        return false;
    }

    // This will check if user is admin authed by server before rendering admin pages and fetching admin data
    public static isAdminAuthedByServer = async () => {
        return await fetch(
            "/api/is_admin",
            {
                method: "GET",
                headers: {
                    "Content-Type": 'application/json',
                    "charset": 'UTF-8',
                    "Authorization": `Bearer ${AuthTokenStateController.getAuthToken()}`
                }
            }
        ).then(reponse => reponse.json())
        .then(data => {
            if (!data.isAuthed) {
                window.location.href = "/forbidden";
                return false;
            } else {
                return true;
            }
        })
        .catch(error => {
            console.log(error);
            return false;
        });
    }

    private static isAuthTokenExp = () => {
        const token = this.getAuthToken();
        if (token) {
            const decodedToken = jwtDecode(token);

            if (decodedToken.exp) {
                return decodedToken.exp < (Math.floor(Date.now()) / 1000);
            }
            return true;
        }
        return true;   
    }

    public static getUserDisplayText = () => {
        const token = this.getAuthToken();

        if (token) {
            const decodedToken: any = jwtDecode(token);
            return decodedToken?.user_username ?? "";
        }
        return "";  
    }

    public static getAuthToken = () => 
        sessionStorage.getItem(AuthTokenStateController.STORAGE_ID);

    public static setAuthToken = (token: string) =>
        sessionStorage.setItem(AuthTokenStateController.STORAGE_ID, token);

    public static deleteAuthToken = () => 
        sessionStorage.removeItem(AuthTokenStateController.STORAGE_ID);    
}