"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface UserProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

const PAGE_SIZE = 10;

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    let query = supabase
      .from("profiles")
      .select("id, email, role, created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
    if (search) {
      query = query.ilike("email", `%${search}%`);
    }
    const { data, error, count } = await query;
    if (error) {
      setError(error.message);
      setUsers([]);
      setTotal(0);
    } else {
      setUsers(data || []);
      setTotal(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [search, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Daftar User</h2>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <input
          type="text"
          className="input input-bordered w-full sm:w-64"
          placeholder="Cari email user..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
        <span className="text-sm text-gray-500">Total: {total}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>No</th>
              <th>Email</th>
              <th>Role</th>
              <th>Tanggal Daftar</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4}><span className="loading loading-spinner loading-md"></span></td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="text-center">Tidak ada data</td></tr>
            ) : (
              users.map((user, idx) => (
                <tr key={user.id}>
                  <td>{(page - 1) * PAGE_SIZE + idx + 1}</td>
                  <td>{user.email}</td>
                  <td><span className="badge badge-info badge-sm">{user.role}</span></td>
                  <td>{new Date(user.created_at).toLocaleString("id-ID")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {error && <div className="alert alert-error mt-4">{error}</div>}
      <div className="flex justify-center mt-4">
        <div className="join">
          <button className="join-item btn btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>«</button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`join-item btn btn-sm${page === i + 1 ? " btn-primary" : ""}`}
              onClick={() => setPage(i + 1)}
              disabled={page === i + 1}
            >{i + 1}</button>
          ))}
          <button className="join-item btn btn-sm" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>»</button>
        </div>
      </div>
    </div>
  );
}
