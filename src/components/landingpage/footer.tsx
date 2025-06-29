const Footer = () => {
  return (
    <footer className="footer bg-base-200 py-6">
      <div className="w-full flex flex-col items-center gap-1">
        <span className="text-base font-semibold">Kantin Wisma Barito Pacific</span>
        <span className="text-sm">Good Place, Good Friends, Good Foods </span>
        <span className="text-xs opacity-70">&copy; {new Date().getFullYear()} Wisma Barito Pacific</span>
      </div>
    </footer>
  );
};
export default Footer;