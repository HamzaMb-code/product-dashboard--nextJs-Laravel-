  "use client";

  import { useEffect, useState } from "react";
  import { useRouter } from "next/navigation";

  export function useRequireAuth() {
    const router = useRouter();
    const [isAuthenticated] = useState(() =>
      typeof window !== "undefined" && Boolean(localStorage.getItem("token"))
    );

    useEffect(() => {
      if (!isAuthenticated) {
        router.replace("/login");
      }
    }, [isAuthenticated, router]);

    return { isAuthenticated, isCheckingAuth: false };
  }
