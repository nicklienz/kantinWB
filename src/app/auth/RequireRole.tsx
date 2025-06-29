"use client";
import { useEffect, useState } from "react";
import { useSupabase } from "@/app/auth/provider";
import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

export default function RequireRole({
  children,
  allowed,
}: {
  children: React.ReactNode;
  allowed: string | string[];
}) {
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function check() {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        if (userError.message?.includes("Auth session missing")) {
          if (!ignore) router.replace("/auth/login");
          return;
        }
        console.error("Supabase user error:", userError);
        setLoading(false);
        return;
      }
      if (!user) {
        if (!ignore) router.replace("/auth/login");
        return;
      }
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (profileError) {
        console.error("Supabase profile error:", profileError);
        setLoading(false);
        return;
      }
      console.log("RequireRole: user", user, "profile", profile);
      const allowedRoles = Array.isArray(allowed) ? allowed : [allowed];
      if (!ignore && profile && allowedRoles.includes(profile.role)) {
        setOk(true);
        setLoading(false);
      } else {
        console.warn("RequireRole: forbidden, allowed:", allowedRoles, "profile:", profile);
        if (!ignore) router.replace("/error/forbidden");
      }
    }
    check();
    return () => { ignore = true; };
  }, [supabase, router, allowed]);

  if (loading) return <LoadingIndicator message="Memeriksa akses..." />;
  if (!ok) return null;
  return <>{children}</>;
}
