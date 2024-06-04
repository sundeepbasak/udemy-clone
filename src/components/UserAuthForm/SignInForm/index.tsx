"use client";

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
import signInSchema from "@/schemas/form/signin-form.schema";
import { useFormik } from "formik";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface InitialValues {
  email: string;
  password: string;
}

const initialValues: InitialValues = {
  email: "",
  password: "",
};

export function SignInForm() {
  const router = useRouter();
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues,
    validationSchema: signInSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log(values);
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        // redirect: false,
        // // callbackUrl: "/",
        redirect: true,
        callbackUrl: "/",
      });

      // if (result?.error) {
      //   // Handle authentication error, e.g., display an error message
      //   console.error("Authentication error:", result.error);
      //   toast.error(result.error, { autoClose: 2000 });
      //   resetForm();
      // } else {
      //   // Authentication succeeded; redirect to the desired route
      //   console.log("Authentication succeeded!");
      //   router.push("/"); // Redirect to the root page ("/")
      //   toast.success("Successfully Logged In", { autoClose: 2000 });
      // }
    },
  });

  const handleGoogleSignIn = async () => {
    // Sign in with Google
    // const result = await signIn("google", { callbackUrl: "/" });
    const result = await signIn("google");
    // Check if the sign-in was successful
    if (result?.error) {
      console.error("Google Sign-In error:", result.error);
    }
    //else {
    //   // Redirect to the home page on success
    //   router.push("/");
    // }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in to TechVariable</CardTitle>
          <CardDescription>Enter your email & password below</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && (
              <p className="text-sm text-red-700">{errors.email}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && errors.password && (
              <p className="text-sm text-red-700">{errors.password}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </CardFooter>
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
            <Button
              variant="outline"
              onClick={handleGoogleSignIn}
              type="button"
            >
              <Icons.google className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
