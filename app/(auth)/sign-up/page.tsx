"use client";

import React from "react";
import { signUpSchema } from "@/lib/validations";
import AuthForm from "@/components/AuthForm";
import { completeSignUp, signUp } from "@/lib/actions/auth";

const Page = () => {
  return (
    <AuthForm
      type="SIGN_UP"
      schema={signUpSchema}
      defaultValues={{
        fullName: "",
        universityId: "",
        password: "",
        universityCard: "",
      }}
      onSubmit={signUp}
      onComplete={completeSignUp}
    />
  );
};
export default Page;
