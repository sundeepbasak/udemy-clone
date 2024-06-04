"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/constants/url";

import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const token = useSearchParams().get("token");

  function displayMessage(msg: string) {}

  async function handleSubmit(e: any) {
    e.preventDefault();
    const formdata = new FormData(e.target);

    const password = formdata.get("password");

    console.log({ password, token });

    try {
      const res = await fetch(`${API_URL}/user/reset-password`, {
        method: "POST",
        body: JSON.stringify({ password, token }),
      });

      console.log({ msg: res.json() });

      // displayMessage(msg);
    } catch (error) {
      console.log("Failed to send email", error);
    }
  }

  return (
    <>
      <div className="h-[50vh]">
        <div className="container mx-auto w-[90%] flex justify-center items-center h-full">
          <div className="w-2/5">
            <form onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  className="rounded-none"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  type="password"
                  id="confirm-password"
                  name="confirm-password"
                  className="rounded-none"
                />
              </div>
              <Button className="mt-5 rounded-none w-full" type="submit">
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
