"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, LockKeyhole, LogIn, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import api from "../../lib/axios";
import { getApiErrorMessage } from "../../lib/api-error";
import { useToast } from "../../components/toast-provider";

const inputClassName =
  "h-11 w-full rounded-lg border border-input bg-background px-10 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (event) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await api.post("/login", { email, password });

      localStorage.setItem("token", response.data.token);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Unable to sign in. Check your email and password."));
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
            <LogIn className="size-5" aria-hidden="true" />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Welcome back
          </CardTitle>
          <CardDescription className="mt-2 leading-6">
            Sign in to continue to your account.
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-7 pt-5 sm:px-8 sm:pb-8">
          <form onSubmit={login} className="space-y-4">
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
                  id="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
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
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-2 h-11 w-full" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Sign in"}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

export default Login;
