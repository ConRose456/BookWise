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
            return jwtDecode(token)?.user_username ?? "";
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