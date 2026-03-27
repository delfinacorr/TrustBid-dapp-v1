"use client";

import React, { useState, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@trustbid/ui";
import { useAccessly } from "../../hooks/useAccessly";

function validateEmail(value: string): string | null {
  if (!value.trim()) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Enter a valid email address.";
  return null;
}

export default function ForgotPasswordPage() {
  const { isReady: accesslyReady, isConfigured: accesslyConfigured, toggle: toggleAccessly } = useAccessly();

  const emailId      = useId();
  const emailErrorId = useId();
  const formErrorId  = useId();

  const [email,        setEmail]        = useState("");
  const [emailError,   setEmailError]   = useState<string | null>(null);
  const [formError,    setFormError]    = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted,    setSubmitted]    = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    const err = validateEmail(email);
    setEmailError(err);
    if (err) return;

    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
    } catch {
      setFormError("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center bg-trust-black p-6 relative overflow-hidden"
    >
      <div aria-hidden="true" className="absolute top-0 right-0 w-[600px] h-[600px] bg-trust-blue/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-trust-blue/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md z-10 space-y-8">

        <div className="text-center space-y-4">
          <Link href="/" aria-label="TrustBid — go to home page">
            <Image src="/identidad/LOGO_transp.png" alt="TrustBid" width={180} height={60} className="h-12 w-auto mx-auto brightness-0 invert" priority />
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Reset password</h1>
          <p className="text-trust-gray/40 text-sm">
            We&apos;ll send you a recovery link
          </p>
        </div>

        {accesslyConfigured && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={toggleAccessly}
              disabled={!accesslyReady}
              aria-label="Open accessibility options panel"
              className={[
                "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium",
                "border border-white/10 text-trust-gray/60 hover:text-white hover:border-white/30",
                "transition-colors duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-blue focus-visible:ring-offset-2 focus-visible:ring-offset-trust-black",
                !accesslyReady ? "opacity-40 cursor-not-allowed" : "",
              ].join(" ")}
            >
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2" />
                <path d="M12 22v-8" />
                <path d="M5 9l7 2 7-2" />
                <path d="M5 15l7-2 7 2" />
              </svg>
              Accessibility options
            </button>
          </div>
        )}

        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-xl">
              {submitted ? "Check your email" : "Forgot your password?"}
            </CardTitle>
            <CardDescription className="text-trust-gray/40">
              {submitted
                ? `A recovery link has been sent to ${email}`
                : "Enter the email address associated with your account."}
            </CardDescription>
          </CardHeader>

          {submitted ? (
            <CardFooter className="flex flex-col space-y-4 pt-2">
              <p className="text-sm text-trust-gray/50 text-center">
                Didn&apos;t receive it? Check your spam folder or{" "}
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setEmail(""); }}
                  className="text-trust-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-blue rounded"
                >
                  try again
                </button>
                .
              </p>
              <Link
                href="/login"
                className="w-full text-center text-sm text-trust-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-blue rounded"
              >
                Back to sign in
              </Link>
            </CardFooter>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              aria-label="Password reset form"
              aria-describedby={formError ? formErrorId : undefined}
            >
              <CardContent className="space-y-5">
                {formError && (
                  <div id={formErrorId} role="alert" aria-live="assertive" className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
                    {formError}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor={emailId} className="text-trust-gray/60">
                    Email address <span aria-hidden="true" className="text-red-400">*</span>
                  </Label>
                  <Input
                    id={emailId}
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="name@organization.org"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
                    onBlur={() => setEmailError(validateEmail(email))}
                    required
                    aria-required="true"
                    aria-invalid={emailError ? "true" : "false"}
                    aria-describedby={emailError ? emailErrorId : undefined}
                    className={[
                      "bg-white/5 border-white/10 text-white placeholder:text-white/20",
                      "focus-visible:ring-2 focus-visible:ring-trust-blue focus-visible:ring-offset-0",
                      emailError ? "border-red-500/60" : "",
                    ].join(" ")}
                  />
                  {emailError && (
                    <p id={emailErrorId} role="alert" aria-live="polite" className="text-xs text-red-400 mt-1">
                      {emailError}
                    </p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  aria-disabled={isSubmitting}
                  className="w-full bg-trust-blue hover:bg-trust-blue/90 text-white rounded-lg h-11 text-base font-semibold focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-trust-blue"
                >
                  {isSubmitting ? "Sending…" : "Send recovery link"}
                </Button>
                <p className="text-xs text-center text-trust-gray/30">
                  Remember your password?{" "}
                  <Link href="/login" className="text-trust-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-blue rounded">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          )}
        </Card>

        <div aria-hidden="true" className="flex items-center justify-center gap-2 opacity-20 filter grayscale">
          <Image src="/identidad/ISO2_transp.png" alt="" width={30} height={30} className="h-6 w-auto" />
          <span className="text-[10px] text-white uppercase tracking-[0.2em] font-bold">Immutable Ledger</span>
        </div>

      </div>
    </main>
  );
}
