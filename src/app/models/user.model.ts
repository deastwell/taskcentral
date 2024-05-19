export interface User{
    [x: string]: any;
    uid: string,
    name: string,
    email: string,
    password?: string,
    profilePictureUrl?: string;
}