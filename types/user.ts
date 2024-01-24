export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    accessToken: string;
    createdAt: string;
    updatedAt: string;
    is_restricted: boolean;
    is_admin: boolean;
}

export interface NewUser {
    id: number;
    name: string;
    email: string;
    password: string;
    is_restricted: boolean;
    is_admin: boolean;
}
