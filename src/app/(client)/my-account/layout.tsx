"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { API_URL } from "@/constants/url";
import {
  ChangeEvent,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { UserDetails } from "@/types/client.types";

// const UserContext = createContext<UserContextProps | null>(null);

// export const useUserContext = () => {
//   const context = useContext(UserContext);
//   console.log("context", context);
//   if (!context) {
//     throw new Error("useUserContext must be used within a UserContextProvider");
//   }
//   return context;
// };

export default function MyAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const defaultStyles = "py-2 px-4 lg:rounded-lg";
  const activeStyles = `bg-gray-200 text-black ${defaultStyles}`;

  return (
    // <UserContext.Provider
    //   value={{
    //     user,
    //     isLoadingUser,
    //     isSubmitting,
    //     handleSubmit,
    //     handleNameChange,
    //   }}
    // >
    <div className="flex min-h-screen flex-col items-center justify-between py-2">
      <div className="container max-w-[90%] lg:max-w-[70%] mx-auto lg:pt-10">
        <h2 className="text-2xl mb-2 font-semibold">My Account</h2>
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-0">
          <div className="mt-4 lg:mt-0 md:w-[60%] lg:w-1/5 lg:rounded-l-md bg-gray-300 lg:bg-white">
            <ul className="flex flex-col">
              <Link
                href="/my-account/profile"
                className={
                  pathname === "/my-account/profile"
                    ? activeStyles
                    : defaultStyles
                }
              >
                <li>Profile</li>
              </Link>
              <Link
                href="/my-account/faq"
                className={
                  pathname === "/my-account/faq" ? activeStyles : defaultStyles
                }
              >
                <li>FAQ</li>
              </Link>
              <Link
                href="/my-account/settings"
                className={
                  pathname === "/my-account/settings"
                    ? activeStyles
                    : defaultStyles
                }
              >
                <li>Settings</li>
              </Link>
              <li className="mt-10">
                <Button onClick={() => signOut()}>Logout</Button>
              </li>
            </ul>
          </div>
          <div className="lg:rounded-r-md flex-1 min-h-[70vh] px-6 py-3 text-black">
            {children}
          </div>
        </div>
      </div>
    </div>
    // </UserContext.Provider>
  );
}
