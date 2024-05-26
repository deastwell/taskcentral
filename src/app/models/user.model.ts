export interface User {
    uid: string;
    name: string;
    email: string;
    password?: string;
    profilePictureUrl: string | null; // Ensure profilePictureUrl is either a string or null
  }
  