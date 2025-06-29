export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-200 p-4">
      <div className="card card-bordered shadow-lg max-w-md w-full">
        <div className="card-body items-center text-center">
          <h1 className="text-6xl font-bold text-error mb-4">403</h1>
          <h2 className="card-title mb-2">Akses Ditolak</h2>
          <p className="mb-4">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          <div className="card-actions justify-center">
            <a href="/" className="btn btn-primary">Kembali ke Beranda</a>
          </div>
        </div>
      </div>
    </div>
  );
}
