import { useState } from "react";
import Image from "next/image";
import { useSupabase } from "@/app/auth/provider";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

const ForgotPassword = () => {
  const supabase = useSupabase();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setError(error.message);
    else setSuccess("Link reset password telah dikirim ke email Anda.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      {loading && <LoadingIndicator message="Mengirim link reset password..." />}
      <div className="card w-full max-w-3xl bg-base-100 shadow-xl p-0 flex flex-col md:flex-row overflow-hidden">
        {/* Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center order-2 md:order-1">
          <div className="flex flex-col items-center mb-6">
            <img src="/favicon_barito.png" alt="Kantin Barito Logo" width={48} height={48} className="mb-2" />
            <h1 className="text-2xl font-bold mb-1">Lupa Password</h1>
            <p className="text-base-content/70 text-sm text-center">Masukkan email Anda dan kami akan mengirimkan link untuk reset password.</p>
          </div>
          <form className="flex flex-col gap-4" onSubmit={handleReset}>
            <input type="email" placeholder="Email" className="input input-bordered w-full" value={email} onChange={e => setEmail(e.target.value)} required />
            <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Loading..." : "Kirim Link Reset Password"}</button>
          </form>
          {error && <div className="alert alert-error mt-2 py-2 px-4 text-sm">{error}</div>}
          {success && <div className="alert alert-success mt-2 py-2 px-4 text-sm">{success}</div>}
          <div className="flex justify-between items-center mt-4 gap-2">
            <a href="/auth/login" className="link link-primary text-sm">Kembali ke Login</a>
          </div>
          <div className="text-center mt-2">
            <a href="/" className="link text-sm">&larr; Kembali ke Beranda</a>
          </div>
        </div>
        {/* Placeholder image */}
        <div className="hidden md:block md:w-1/2 h-80 md:h-auto order-1 md:order-2">
          <img
            src="https://picsum.photos/400/500?grayscale&blur=2"
            alt="Forgot Password Illustration"
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;
