"use client";
import { createBrowserClient } from "@supabase/ssr";
import { useState, createContext, useContext } from "react";

export const SupabaseContext = createContext<any>(null);

export function useSupabase() {
  return useContext(SupabaseContext);
}

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
}
