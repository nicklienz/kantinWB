import ThemeController from "@/components/ui/ThemeController";
import Link from "next/link";

const Header = () => {
  return (
    <header className="navbar bg-base-200 shadow">
      <div className="navbar-start">
        {/* Dropdown for mobile */}
        <div className="dropdown md:hidden">
          <button tabIndex={0} className="btn btn-ghost btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-40">
            <li><a href="#tenants">Tenant</a></li>
            <li><a href="#location">Lokasi</a></li>
            <li><a href="#guide">Panduan Order</a></li>
          </ul>
        </div>
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/favicon_barito.png" alt="Kantin Barito Logo" className="w-6 h-6" />
          <span className="text-sm font-bold md:text-xl">Kantin Wisma Barito Pacific</span>
        </Link>
      </div>
      {/* Center menu for large screen */}
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><a href="#tenants">Tenant</a></li>
          <li><a href="#location">Lokasi</a></li>
          <li><a href="#guide">Panduan Order</a></li>
        </ul>
      </div>
      {/* End buttons for large screen */}
      <div className="navbar-end md:flex gap-2 items-center">
        <Link href="/auth/register" className="btn btn-primary btn-xs md:btn-sm">Daftar</Link>
        <Link href="/auth/login" className="btn btn-outline btn-xs md:btn-sm">Masuk</Link>
        <ThemeController />
      </div>
    </header>
  );
};
export default Header;