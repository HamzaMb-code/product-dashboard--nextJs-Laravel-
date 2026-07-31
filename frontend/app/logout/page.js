"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/axios";

function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await api.post("/logout");
      } finally {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };
    logout();
  }, [router]);

  return <main className="grid min-h-screen place-items-center bg-muted/30 text-sm text-muted-foreground">Signing you out...</main>;
}

export default Logout;
