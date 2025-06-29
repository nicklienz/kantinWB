import Link from "next/link";
import ThemeController from "@/components/ui/ThemeController";
import LogoutButton from "@/components/ui/LogoutButton";

const AdminNavbar = () => {
  return (
    <header className="navbar bg-base-100 shadow">
      <div className="navbar-start">
        {/* Dropdown for mobile */}
        <div className="dropdown md:hidden">
          <button tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-48">
            <li><Link href="/admin/users">Users</Link></li>
            <li><Link href="/admin/tenants">Tenants</Link></li>
            <li><Link href="/admin/tenants/category">Category Tenant</Link></li>
            <li><Link href="/admin/holidays">Kantin</Link></li>
            <li><Link href="/admin/customers">Langganan</Link></li>
            <li><LogoutButton className="w-full text-left" /></li>
            <li>
              <ThemeController />
            </li>
          </ul>
        </div>
        {/* Logo */}
        <Link href="/admin" className="flex px-2 items-center gap-2">
          <span className="text-xl font-bold">Administrator</span>
        </Link>
      </div>
      {/* Center menu for large screen */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><Link href="/admin/users">Users</Link></li>
          <li><Link href="/admin/tenants">Tenants</Link></li>
          <li><Link href="/admin/tenants/category">Category Tenant</Link></li>
          <li><Link href="/admin/holidays">Kantin</Link></li>
          <li><Link href="/admin/customers">Langganan</Link></li>
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
export default AdminNavbar;
