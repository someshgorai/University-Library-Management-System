"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  SubmitHandler,
  Path,
  DefaultValues,
  FieldValues,
  UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/FileUpload";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{
    success: boolean;
    error?: string;
    otpSent?: boolean;
    email?: string;
  }>;
  onComplete?: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onComplete,
  type,
}: Props<T>) => {
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const router = useRouter();
  const isSignIn = type === "SIGN_IN";
  const [step, setStep] = useState<"FORM" | "OTP">("FORM");
  const [userEmail, setUserEmail] = useState("");
  const [formData, setFormData] = useState<T | null>(null);
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit: SubmitHandler<T> = async (data) => {
    setIsSubmitting(true);
    const result = await onSubmit(data);
    setIsSubmitting(false);

    if (result.success && result.otpSent && result.email) {
      toast.success("OTP sent to your official email.");
      setUserEmail(result.email); // Why?
      setFormData(data);
      setStep("OTP");
    } else if (!result.success) {
      toast.error("Sign up failed", {
        description: result.error ?? "An error occurred.",
      });
    }
  };

  const handleOtpSubmit = async () => {
    if (!userEmail || !formData || !otp) return;

    setIsVerifying(true);
    const res = await fetch("/api/verify-otp", {
      method: "POST",
      body: JSON.stringify({ email: userEmail, otp }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await res.json();
    setIsVerifying(false);

    if (!result.success) {
      toast.error("Invalid or expired OTP");
      return;
    }

    if (onComplete) {
      const final = await onComplete(formData);
      if (final.success) {
        toast.success("Sign up successful");
        router.push("/");
      } else {
        toast.error("Failed to complete sign-up", {
          description: final.error ?? "Something went wrong",
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {step === "FORM" ? (
        <>
          <h1 className="text-2xl font-semibold text-white">
            {isSignIn
              ? "Welcome back to BookWise"
              : "Create your library account"}
          </h1>
          <p className="text-light-100">
            {isSignIn
              ? "Access the vast collection of resources, and stay updated"
              : "Please complete all fields and upload a valid university ID to gain access to the library"}
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="w-full space-y-6"
            >
              {Object.keys(defaultValues).map((field) => (
                <FormField
                  key={field}
                  control={form.control}
                  name={field as Path<T>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">
                        {FIELD_NAMES[field.name as keyof typeof FIELD_NAMES]}
                      </FormLabel>
                      <FormControl>
                        {field.name === "universityCard" ? (
                          <FileUpload
                            fileType="image"
                            accept="image/*"
                            placeholder="Upload your ID"
                            folder="ids"
                            variant="dark"
                            onFileChange={field.onChange}
                          />
                        ) : (
                          <Input
                            required
                            type={
                              FIELD_TYPES[
                                field.name as keyof typeof FIELD_TYPES
                              ]
                            }
                            {...field}
                            className="form-input"
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button
                type="submit"
                className="form-btn"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isSignIn
                    ? "Signing in..."
                    : "Sending OTP..."
                  : isSignIn
                    ? "Sign In"
                    : "Sign Up"}
              </Button>
            </form>
          </Form>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold text-white">
            Verify your Email
          </h2>
          <p className="text-light-100">
            Enter the 6-digit OTP sent to <strong>{userEmail}</strong>
          </p>
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
            className="form-input"
          />
          <Button
            onClick={handleOtpSubmit}
            disabled={isVerifying}
            className="form-btn"
          >
            {isVerifying ? "Verifying..." : "Verify OTP"}
          </Button>
          <Button variant="ghost" onClick={() => setStep("FORM")}>
            ← Back to Sign Up
          </Button>
        </>
      )}

      {step === "FORM" && (
        <p className="text-center text-base font-medium">
          {isSignIn ? "New to BookWise? " : "Already have an account? "}
          <Link
            href={isSignIn ? "/sign-up" : "/sign-in"}
            className="font-bold text-primary"
          >
            {isSignIn ? "Create an account" : "Sign in"}
          </Link>
        </p>
      )}
    </div>
  );
};
export default AuthForm;
