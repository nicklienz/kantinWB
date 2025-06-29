import Link from "next/link";
import ThemeController from "@/components/ui/ThemeController";
import LogoutButton from "@/components/ui/LogoutButton";
import { useEffect, useState } from "react";
import { useSupabase } from "@/app/auth/provider";

const TenantNavbar = () => {
  const supabase = useSupabase();
  const [tenantName, setTenantName] = useState<string>("...");

  useEffect(() => {
    const fetchTenantName = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      // Asumsi ada tabel 'tenant' dengan kolom 'email' dan 'name'
      const { data, error } = await supabase
        .from("tenant")
        .select("name")
        .eq("email", user.email)
        .single();
      if (data && data.name) setTenantName(data.name);
    };
    fetchTenantName();
  }, [supabase]);

  return (
    <header className="navbar bg-base-100 shadow">
      <div className="navbar-start">
        <div className="dropdown md:hidden">
          <label tabIndex={0} className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/tenant/menu">Menu Makanan & Minuman</Link>
            </li>
            <li>
              <Link href="/tenant/orders">Pesanan Masuk</Link>
            </li>
            <li>
              <Link href="/tenant/customers">List Customer</Link>
            </li>
            <li>
              <Link href="/tenant/settings">Pengaturan</Link>
            </li>
            <li>
              <LogoutButton className="w-full text-left" />
            </li>
            <li>
              <ThemeController />
            </li>
          </ul>
        </div>
        {/* Logo */}
        <Link href="/tenant" className="flex px-2 items-center gap-2">
          <span className="text-xl font-bold">{tenantName}</span>
        </Link>
      </div>
      {/* Center menu for large screen */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link href="/tenant/menu">Menu Makanan & Minuman</Link>
          </li>
          <li>
            <Link href="/tenant/orders">Pesanan Masuk</Link>
          </li>
          <li>
            <Link href="/tenant/customers">List Customer</Link>
          </li>
          <li>
            <Link href="/tenant/settings">Pengaturan</Link>
          </li>
        </ul>
      </div>
      {/* End buttons for large screen */}
      <div className="navbar-end hidden md:flex gap-2">
        <LogoutButton />
        <ThemeController />
      </div>
    </header>
  );
};
export default TenantNavbar;