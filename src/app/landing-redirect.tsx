"use client";
import { useEffect } from "react";
import { useSupabase } from "@/app/auth/provider";
import { useRouter } from "next/navigation";

export default function LandingRedirect({ children }: { children: React.ReactNode }) {
  const supabase = useSupabase();
  const router = useRouter();

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      if (profile?.role === "admin") {
        router.replace("/admin");
      } else if (profile?.role === "tenant") {
        router.replace("/tenant");
      } else if (profile?.role === "customer") {
        router.replace("/customer");
      }
    }
    check();
  }, [supabase, router]);

  return <>{children}</>;
}
