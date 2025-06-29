import AdminNavbar from "@/components/admin/ui/navbar";
import Link from "next/link";

import RequireRole from "@/app/auth/RequireRole";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RequireRole allowed="admin">
      <div className="min-h-screen bg-base-200">
        <AdminNavbar />
        <main className="container mx-auto px-4 py-6">
          {children}
        </main>
      </div>
    </RequireRole>
  );
};
export default AdminLayout;
