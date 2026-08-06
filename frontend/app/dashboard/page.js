"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogOut, Package, UserRound } from "lucide-react";
import api from "../../lib/axios";
import { getApiErrorMessage } from "../../lib/api-error";
import { useRequireAuth } from "../../lib/auth";
import { useToast } from "../../components/toast-provider";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useRouter } from "next/navigation";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAuthenticated } = useRequireAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) return;
    const getUser = async () => {
      try {
        const response = await api.get("/user");
        setUser(response.data.user);
      } catch (requestError) {
        setError(
          getApiErrorMessage(requestError, "We couldn't load your profile."),
        );
      }
    };
    getUser();
  }, [isAuthenticated]);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      toast.success("You have been signed out.");
      router.push("/login");
    } catch (requestError) {
      toast.error(
        getApiErrorMessage(
          requestError,
          "We couldn't sign you out. Please try again.",
        ),
      );
      setIsLoggingOut(false);
    }
  };

  if (!isAuthenticated)
    return <main className="min-h-screen bg-muted/30" aria-busy="true" />;

  if (!user && !error)
    return (
      <main className="min-h-screen bg-muted/30 px-4 py-10">
        <div className="mx-auto h-72 max-w-3xl animate-pulse rounded-xl border border-border bg-card" />
      </main>
    );

  return (
    <main className="min-h-screen bg-muted/30 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Card className="py-0 shadow-sm">
          <CardHeader className="border-b px-6 py-7 sm:px-8">
            <div className="mb-4 grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
              <UserRound className="size-5" />
            </div>
            <CardTitle className="text-2xl">Your dashboard</CardTitle>
            <CardDescription>
              {error || "Your account at a glance."}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-7 sm:px-8">
            {user && (
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
                <p className="font-medium">{user.name}</p>
                <p className="mt-1 text-muted-foreground">{user.email}</p>
              </div>
            )}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products">
                <Button>
                  <Package /> Manage products
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={logout}
                disabled={isLoggingOut}
              >
                <LogOut /> {isLoggingOut ? "Signing out..." : "Sign out"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Dashboard;
