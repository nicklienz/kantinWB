"use client";

import { useState } from "react";
import { useSupabase } from "@/app/auth/provider";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

const Login = () => {
  const supabase = useSupabase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
    if (!error) window.location.href = "/";
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      {loading && <LoadingIndicator message="Memproses login..." />}
      <div className="card w-full max-w-3xl bg-base-100 shadow-xl p-0 flex flex-col md:flex-row overflow-hidden">
        {/* Placeholder image */}
        <div className="hidden md:block md:w-1/2 h-80 md:h-auto">
          <img
            src="https://picsum.photos/400/500?grayscale&blur=2"
            alt="Login Illustration"
            className="object-cover w-full h-full"
          />
        </div>
        {/* Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <div className="flex flex-col items-center mb-6">
            <img src="/favicon_barito.png" alt="Kantin Barito Logo" width={48} height={48} className="mb-2" />
            <h1 className="text-2xl font-bold mb-1">Masuk</h1>
            <p className="text-base-content/70 text-sm">Lanjutkan dengan akun Google Anda</p>
          </div>
          <button className="btn btn-outline btn-primary w-full flex items-center gap-2 text-base font-medium mb-2" onClick={handleGoogle} disabled={loading}>
            <svg className="w-5 h-5" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.6 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C33.5 5.1 28.1 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.3-.1-2.7-.5-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c2.7 0 5.2.9 7.2 2.5l6.4-6.4C33.5 5.1 28.1 3 24 3c-7.2 0-13.4 3.1-17.7 8.1z"/><path fill="#FBBC05" d="M24 45c5.4 0 10.4-1.8 14.3-4.9l-6.6-5.4C29.8 36 27 37 24 37c-5.7 0-10.5-3.7-12.2-8.8l-7 5.4C7.6 41.2 15.2 45 24 45z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.2 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2l-7 5.4C15.5 41.9 19.4 45 24 45c10.5 0 20-7.5 20-21 0-1.3-.1-2.7-.5-4z"/></g></svg>
            Masuk dengan Google
          </button>
          <div className="divider my-6">atau</div>
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <input type="email" placeholder="Email" className="input input-bordered w-full" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="input input-bordered w-full" value={password} onChange={e => setPassword(e.target.value)} required />
            <button className="btn btn-primary w-full" disabled={loading}>{loading ? "Loading..." : "Masuk"}</button>
          </form>
          {error && <div className="alert alert-error mt-2 py-2 px-4 text-sm">{error}</div>}
          <div className="flex justify-between items-center mt-4 gap-2">
            <a href="/auth/forgotpassword" className="link link-primary text-sm">Lupa password?</a>
            <a href="/auth/register" className="btn btn-outline btn-primary btn-xs">Daftar Akun Baru</a>
          </div>
          <div className="text-center mt-2">
            <a href="/" className="link text-sm">&larr; Kembali ke Beranda</a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
