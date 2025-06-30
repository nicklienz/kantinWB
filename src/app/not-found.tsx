import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-base-100">
      <div className="card card-bordered shadow-xl w-full max-w-md">
        <div className="card-body items-center text-center">
          <span className="text-6xl mb-2">😕</span>
          <h1 className="card-title text-2xl mb-1">404 - Halaman Tidak Ditemukan</h1>
          <p className="mb-4 text-base-content/80">Maaf, halaman yang Anda cari tidak tersedia atau sudah dipindahkan.</p>
          <div className="card-actions justify-center">
            <Link href="/" className="btn btn-primary">Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
