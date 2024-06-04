import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {

    interface User {
        id: number;
        email: string;
        fullname: string;
    }

    interface Session extends DefaultSession {
        user?: User
    }
}