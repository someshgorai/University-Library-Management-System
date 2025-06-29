"use client";

import React from "react";
import { signInSchema } from "@/lib/validations";
import AuthForm from "@/components/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth";

const Page = () => {
  return (
    <AuthForm
      type="SIGN_IN"
      schema={signInSchema}
      defaultValues={{ universityId: "", password: "" }}
      onSubmit={signInWithCredentials}
    />
  );
};
export default Page;
