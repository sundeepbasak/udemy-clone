"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/constants/url";
import { UserDetails } from "@/types/client.types";
// import { useUserContext } from "../layout";
import { Loader2 } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

export default function SettingsPage() {
  // const { user, handleSubmit, handleNameChange, isLoadingUser, isSubmitting } =
  //   useUserContext();

  const [user, setUser] = useState<UserDetails>({
    fullname: "",
    avatar: "",
    email: "",
  });
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUserData = async () => {
    setIsLoadingUser(true);
    try {
      const res = await fetch(`${API_URL}/user/profile`);
      const { data } = await res.json();

      setUser({
        avatar: data.avatar,
        email: data.email,
        fullname: data.fullname,
      });
      setIsLoadingUser(false);
    } catch (error) {
      setIsLoadingUser(false);
      throw new Error("Error fetching user details");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await fetch(`${API_URL}/user/profile`, {
      method: "PATCH",
      body: JSON.stringify({
        fullname: user?.fullname,
      }),
    });

    if (res.ok) {
      console.log("profile form submitted");
      setIsSubmitting(false);
      fetchUserData();
    } else {
      console.warn("failed to submit profile form");
      setIsSubmitting(false);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser((prevUser: any) => ({
      ...prevUser,
      fullname: e.target.value,
    }));
  };

  return (
    <>
      <div>
        <h3 className="text-2xl font-semibold">Update User</h3>
        <form onSubmit={handleSubmit}>
          <div className="my-5">
            <label>
              <div>Fullname</div>
              <Input
                placeholder="Fullname"
                value={user.fullname}
                onChange={handleNameChange}
                disabled={isLoadingUser}
              />
            </label>
          </div>
          <div className="my-5">
            <label>
              <div>Email</div>
              <Input placeholder="Email" value={user.email} disabled />
            </label>
          </div>
          <Button type="submit" disabled={isLoadingUser || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin mr-4" />
                <span>Updating</span>
              </>
            ) : (
              "Update"
            )}
          </Button>
        </form>
      </div>
    </>
  );
}
