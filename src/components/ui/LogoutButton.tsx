"use client";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/app/auth/provider";
import { useState } from "react";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

export default function LogoutButton({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
    router.replace("/"); // redirect ke landing page setelah logout
  };

  return (
    <>
      {loading && <LoadingIndicator message="Keluar akun..." />}
      <button
        className={`btn btn-outline btn-error btn-sm ${className}`}
        onClick={handleLogout}
        disabled={loading}
        type="button"
      >
        {children || (loading ? "Logging out..." : "Logout")}
      </button>
    </>
  );
}
