"use client";

import React, { useState, useId } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

// ─── Validation helpers ───────────────────────────────────────────────────────

function required(label: string) {
  return (value: string) => (value.trim() ? null : `${label} is required.`);
}

function validateEmail(value: string): string | null {
  if (!value.trim()) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return "Enter a valid email address (e.g. name@organization.org).";
  return null;
}

function validatePassword(value: string): string | null {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  return null;
}

function validateConfirmPassword(password: string, confirm: string): string | null {
  if (!confirm) return "Please confirm your password.";
  if (confirm !== password) return "Passwords do not match.";
  return null;
}

const ROLES = [
  { value: "", label: "Select your role" },
  { value: "ngo_manager", label: "NGO Manager" },
  { value: "project_coordinator", label: "Project Coordinator" },
  { value: "donor", label: "Donor / Funder" },
  { value: "auditor", label: "Auditor" },
  { value: "government", label: "Government Official" },
  { value: "other", label: "Other" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const { isReady: accesslyReady, isConfigured: accesslyConfigured, toggle: toggleAccessly } = useAccessly();

  // Stable IDs for label → input associations
  const firstNameId        = useId();
  const firstNameErrorId   = useId();
  const lastNameId         = useId();
  const lastNameErrorId    = useId();
  const emailId            = useId();
  const emailErrorId       = useId();
  const orgId              = useId();
  const orgErrorId         = useId();
  const roleId             = useId();
  const roleErrorId        = useId();
  const passwordId         = useId();
  const passwordErrorId    = useId();
  const confirmPasswordId  = useId();
  const confirmErrorId     = useId();
  const termsId            = useId();
  const termsErrorId       = useId();
  const formErrorId        = useId();

  const [fields, setFields] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    role: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [formError, setFormError]       = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Per-field setters ───────────────────────────────────────────────────────

  const setField = <K extends keyof typeof fields>(key: K, value: (typeof fields)[K]) => {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  };

  // ── Validation ──────────────────────────────────────────────────────────────

  const validateAll = () => {
    const next: Record<string, string | null> = {
      firstName:       required("First name")(fields.firstName),
      lastName:        required("Last name")(fields.lastName),
      email:           validateEmail(fields.email),
      organization:    required("Organization")(fields.organization),
      role:            fields.role ? null : "Please select your role.",
      password:        validatePassword(fields.password),
      confirmPassword: validateConfirmPassword(fields.password, fields.confirmPassword),
      terms:           fields.terms ? null : "You must accept the terms to continue.",
    };
    setErrors(next);
    return Object.values(next).every((v) => v === null);
  };

  const handleBlur = (field: string, validatorFn: () => string | null) => {
    setErrors((e) => ({ ...e, [field]: validatorFn() }));
  };

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);

    if (!validateAll()) return;

    setIsSubmitting(true);
    try {
      // Mock registration — replace with real API call
      await new Promise((r) => setTimeout(r, 800));
      router.push("/login");
    } catch {
      setFormError("Registration failed. Please try again or contact support.");
      setIsSubmitting(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const fieldClass = (hasError: boolean) =>
    [
      "bg-white/5 border-white/10 text-white placeholder:text-white/20",
      "focus-visible:ring-2 focus-visible:ring-trust-blue focus-visible:ring-offset-0",
      hasError ? "border-red-500/60" : "",
    ].join(" ");

  const ErrorMsg = ({ id, msg }: { id: string; msg: string | null | undefined }) =>
    msg ? (
      <p id={id} role="alert" aria-live="polite" className="text-xs text-red-400 mt-1">
        {msg}
      </p>
    ) : null;

  return (
    <main
      id="main-content"
      className="min-h-screen flex items-center justify-center bg-trust-black py-12 px-6 relative overflow-hidden"
    >
      {/* Ambient glow — decorative */}
      <div aria-hidden="true" className="absolute top-0 right-0 w-[600px] h-[600px] bg-trust-blue/10 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
      <div aria-hidden="true" className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-trust-blue/5 rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-lg z-10 space-y-8">

        {/* ── Logo / heading ─────────────────────────────────────────────────── */}
        <div className="text-center space-y-4">
          <Link href="/" aria-label="TrustBid — go to home page">
            <Image
              src="/identidad/LOGO_transp.png"
              alt="TrustBid"
              width={180}
              height={60}
              className="h-12 w-auto mx-auto brightness-0 invert"
              priority
            />
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Request access</h1>
          <p className="text-trust-gray/40 text-sm">
            Join the transparency infrastructure
          </p>
        </div>

        {/* ── Accessibility widget trigger ───────────────────────────────────── */}
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

        {/* ── Form card ──────────────────────────────────────────────────────── */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-xl">Create your account</CardTitle>
            <CardDescription className="text-trust-gray/40">
              Fields marked <span aria-hidden="true" className="text-red-400">*</span>
              <span className="sr-only">with an asterisk</span> are required.
            </CardDescription>
          </CardHeader>

          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="Account registration form"
            aria-describedby={formError ? formErrorId : undefined}
          >
            <CardContent className="space-y-5">

              {/* Form-level error */}
              {formError && (
                <div
                  id={formErrorId}
                  role="alert"
                  aria-live="assertive"
                  className="rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400"
                >
                  {formError}
                </div>
              )}

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={firstNameId} className="text-trust-gray/60">
                    First name <span aria-hidden="true" className="text-red-400">*</span>
                  </Label>
                  <Input
                    id={firstNameId}
                    type="text"
                    name="given-name"
                    autoComplete="given-name"
                    value={fields.firstName}
                    onChange={(e) => setField("firstName", e.target.value)}
                    onBlur={() => handleBlur("firstName", () => required("First name")(fields.firstName))}
                    required
                    aria-required="true"
                    aria-invalid={errors.firstName ? "true" : "false"}
                    aria-describedby={errors.firstName ? firstNameErrorId : undefined}
                    className={fieldClass(!!errors.firstName)}
                  />
                  <ErrorMsg id={firstNameErrorId} msg={errors.firstName} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={lastNameId} className="text-trust-gray/60">
                    Last name <span aria-hidden="true" className="text-red-400">*</span>
                  </Label>
                  <Input
                    id={lastNameId}
                    type="text"
                    name="family-name"
                    autoComplete="family-name"
                    value={fields.lastName}
                    onChange={(e) => setField("lastName", e.target.value)}
                    onBlur={() => handleBlur("lastName", () => required("Last name")(fields.lastName))}
                    required
                    aria-required="true"
                    aria-invalid={errors.lastName ? "true" : "false"}
                    aria-describedby={errors.lastName ? lastNameErrorId : undefined}
                    className={fieldClass(!!errors.lastName)}
                  />
                  <ErrorMsg id={lastNameErrorId} msg={errors.lastName} />
                </div>
              </div>

              {/* Email */}
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
                  value={fields.email}
                  onChange={(e) => setField("email", e.target.value)}
                  onBlur={() => handleBlur("email", () => validateEmail(fields.email))}
                  required
                  aria-required="true"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? emailErrorId : undefined}
                  className={fieldClass(!!errors.email)}
                />
                <ErrorMsg id={emailErrorId} msg={errors.email} />
              </div>

              {/* Organization */}
              <div className="space-y-2">
                <Label htmlFor={orgId} className="text-trust-gray/60">
                  Organization <span aria-hidden="true" className="text-red-400">*</span>
                </Label>
                <Input
                  id={orgId}
                  type="text"
                  name="organization"
                  autoComplete="organization"
                  placeholder="NGO, foundation, or institution name"
                  value={fields.organization}
                  onChange={(e) => setField("organization", e.target.value)}
                  onBlur={() => handleBlur("organization", () => required("Organization")(fields.organization))}
                  required
                  aria-required="true"
                  aria-invalid={errors.organization ? "true" : "false"}
                  aria-describedby={errors.organization ? orgErrorId : undefined}
                  className={fieldClass(!!errors.organization)}
                />
                <ErrorMsg id={orgErrorId} msg={errors.organization} />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor={roleId} className="text-trust-gray/60">
                  Role <span aria-hidden="true" className="text-red-400">*</span>
                </Label>
                <select
                  id={roleId}
                  name="role"
                  value={fields.role}
                  onChange={(e) => setField("role", e.target.value)}
                  onBlur={() => handleBlur("role", () => fields.role ? null : "Please select your role.")}
                  required
                  aria-required="true"
                  aria-invalid={errors.role ? "true" : "false"}
                  aria-describedby={errors.role ? roleErrorId : undefined}
                  className={[
                    "w-full rounded-md border px-3 py-2 text-sm bg-white/5 text-white",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-blue focus-visible:ring-offset-0",
                    errors.role ? "border-red-500/60" : "border-white/10",
                  ].join(" ")}
                >
                  {ROLES.map(({ value, label }) => (
                    <option key={value} value={value} disabled={value === ""} className="bg-trust-black text-white">
                      {label}
                    </option>
                  ))}
                </select>
                <ErrorMsg id={roleErrorId} msg={errors.role} />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor={passwordId} className="text-trust-gray/60">
                  Password <span aria-hidden="true" className="text-red-400">*</span>
                </Label>
                <Input
                  id={passwordId}
                  type="password"
                  name="new-password"
                  autoComplete="new-password"
                  value={fields.password}
                  onChange={(e) => setField("password", e.target.value)}
                  onBlur={() => handleBlur("password", () => validatePassword(fields.password))}
                  required
                  aria-required="true"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? passwordErrorId : undefined}
                  className={fieldClass(!!errors.password)}
                />
                <ErrorMsg id={passwordErrorId} msg={errors.password} />
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <Label htmlFor={confirmPasswordId} className="text-trust-gray/60">
                  Confirm password <span aria-hidden="true" className="text-red-400">*</span>
                </Label>
                <Input
                  id={confirmPasswordId}
                  type="password"
                  name="confirm-password"
                  autoComplete="new-password"
                  value={fields.confirmPassword}
                  onChange={(e) => setField("confirmPassword", e.target.value)}
                  onBlur={() => handleBlur("confirmPassword", () => validateConfirmPassword(fields.password, fields.confirmPassword))}
                  required
                  aria-required="true"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={errors.confirmPassword ? confirmErrorId : undefined}
                  className={fieldClass(!!errors.confirmPassword)}
                />
                <ErrorMsg id={confirmErrorId} msg={errors.confirmPassword} />
              </div>

              {/* Terms */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <input
                    id={termsId}
                    type="checkbox"
                    name="terms"
                    checked={fields.terms}
                    onChange={(e) => setField("terms", e.target.checked)}
                    required
                    aria-required="true"
                    aria-invalid={errors.terms ? "true" : "false"}
                    aria-describedby={errors.terms ? termsErrorId : undefined}
                    className={[
                      "mt-0.5 h-4 w-4 rounded border bg-white/5 text-trust-blue",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-blue focus-visible:ring-offset-1",
                      errors.terms ? "border-red-500/60" : "border-white/10",
                    ].join(" ")}
                  />
                  <Label htmlFor={termsId} className="text-trust-gray/50 text-sm font-normal leading-snug cursor-pointer">
                    I agree to the{" "}
                    <Link href="/terms" className="text-trust-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-blue rounded">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-trust-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-blue rounded">
                      Privacy Policy
                    </Link>
                    <span aria-hidden="true" className="ml-1 text-red-400">*</span>
                  </Label>
                </div>
                <ErrorMsg id={termsErrorId} msg={errors.terms} />
              </div>

            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                aria-disabled={isSubmitting}
                className="w-full bg-trust-blue hover:bg-trust-blue/90 text-white rounded-lg h-11 text-base font-semibold focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-trust-blue"
              >
                {isSubmitting ? "Creating account…" : "Create account"}
              </Button>
              <p className="text-xs text-center text-trust-gray/30">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-trust-blue hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-trust-blue rounded"
                >
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>

        {/* Branding detail — decorative */}
        <div aria-hidden="true" className="flex items-center justify-center gap-2 opacity-20 filter grayscale">
          <Image src="/identidad/ISO2_transp.png" alt="" width={30} height={30} className="h-6 w-auto" />
          <span className="text-[10px] text-white uppercase tracking-[0.2em] font-bold">Immutable Ledger</span>
        </div>

      </div>
    </main>
  );
}
