"use client";
import RequireRole from "@/app/auth/RequireRole";
import TenantNavbar from "@/components/ui/navbar";

const TenantLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RequireRole allowed="tenant">
      <div className="min-h-screen bg-base-200">
        <TenantNavbar />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </RequireRole>
  );
};
export default TenantLayout;
