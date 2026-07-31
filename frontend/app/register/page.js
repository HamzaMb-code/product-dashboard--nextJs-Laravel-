"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import { getApiErrorMessage } from "../../lib/api-error";
import { useToast } from "../../components/toast-provider";

const inputClassName =
  "h-11 w-full rounded-lg border border-input bg-background px-10 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const register = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await api.post("/register", formData);
      toast.success(response.data.message || "Account created successfully. Please sign in.");
      router.push("/login");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "We couldn't create your account. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 dark:bg-background sm:px-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(20,184,166,0.13),_transparent_30%)]" />

      <Card className="w-full max-w-md border border-white/70 bg-card/95 py-0 shadow-2xl shadow-slate-950/10 backdrop-blur dark:border-white/10">
        <CardHeader className="px-6 pb-2 pt-7 text-center sm:px-8 sm:pt-8">
          <div className="mx-auto mb-5 grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <UserRound className="size-5" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Create your account
          </CardTitle>
          <CardDescription className="mt-2 leading-6">
            Join us to get started. It only takes a minute.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-7 pt-5 sm:px-8 sm:pb-8">
          <form onSubmit={register} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <div className="relative">
                <UserRound
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  className={inputClassName}
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  placeholder="Hamza"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  className={inputClassName}
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  className={inputClassName}
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="text-sm font-medium">
                Confirm password
              </label>
              <div className="relative">
                <LockKeyhole
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  className={inputClassName}
                  type="password"
                  name="password_confirmation"
                  id="password_confirmation"
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-2 h-11 w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating account..." : "Create account"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default Register;
