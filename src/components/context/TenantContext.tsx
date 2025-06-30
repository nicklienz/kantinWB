import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";

interface TenantContextType {
  tenantName: string;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType>({ tenantName: "", loading: true });

export const useTenant = () => useContext(TenantContext);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [tenantName, setTenantName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenant = async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Asumsi ada table 'tenants' dengan kolom 'email' dan 'name'
        const { data } = await supabase
          .from("tenants")
          .select("name")
          .eq("email", user.email)
          .single();
        if (data && data.name) setTenantName(data.name);
      }
      setLoading(false);
    };
    fetchTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ tenantName, loading }}>
      {children}
    </TenantContext.Provider>
  );
};
