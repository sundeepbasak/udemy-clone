"use client";

import MainFooter from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API_URL } from "@/constants/url";

import Link from "next/link";

export default function ForgetPasswordPage() {
  async function handleSubmit(e: any) {
    e.preventDefault();
    const formdata = new FormData(e.target);

    const email = formdata.get("email");

    try {
      const res = await fetch(`${API_URL}/user/forgot-password`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
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
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email"
                name="email"
                className="rounded-none"
              />
              <Button className="mt-5 rounded-none w-full" type="submit">
                Reset Password
              </Button>
            </form>
            <div>
              or
              <Link href="/auth">
                <Button variant="link" className="underline text-violet-700">
                  Log in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <MainFooter />
    </>
  );
}
