"use client";

import { registerUser } from "@/app/actions";
import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import signupSchema from "@/schemas/form/signup-form.schema";
import { useFormik } from "formik";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

interface InitialValues {
  fullname: string;
  email: string;
  password: string;
}

const initialValues: InitialValues = {
  fullname: "",
  email: "",
  password: "",
};

export function SignUpForm() {
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const router = useRouter();

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signupSchema,
      onSubmit: async (values, action) => {
        console.log(values);
        await registerUser(values);
        setIsUserRegistered(true);
      },
    });

  useLayoutEffect(() => {
    if (isUserRegistered) {
      router.push("/"); //!change it to /signin
    }
  }, [isUserRegistered]);

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign up to TechVariable</CardTitle>
          <CardDescription>Enter your email & password below</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fullname">Your full name</Label>
            <Input
              id="fullname"
              name="fullname"
              type="text"
              placeholder="John Doe"
              value={values.fullname}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              value={values.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </CardFooter>
      </form>
      <CardContent>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 mt-4">
          <Button variant="outline" onClick={() => signIn("google")}>
            <Icons.google className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
