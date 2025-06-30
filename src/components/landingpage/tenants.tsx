"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Tenant } from "@/types/tenant";
import { supabase } from "@/lib/supabase";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

const Tenants = () => {
	const [tenants, setTenants] = useState<Tenant[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTenants = async () => {
			setLoading(true);
			setError(null);
			const { data, error } = await supabase
				.from("tenant")
				.select(`
          id,
          name,
          owner,
          phone,
		  email,
          address,
          openhour,
          closehour,
          description,
          image_url,
          qris_url,
          tenant_category ( id, name ),
		  status
        `)
				.order("id", { ascending: true });
			if (error) {
				setError("Gagal mengambil data tenant: " + error.message);
			} else {
				setTenants(
					(data || []).map((t): Tenant => ({
						id: t.id,
						name: t.name,
						owner: t.owner,
						phone: t.phone,
						email: t.email,
						address: t.address,
						openhour: t.openhour,
						closehour: t.closehour,
						description: t.description,
						imageUrl: t.image_url,
						qrisUrl: t.qris_url,
						tenantCategory: Array.isArray(t.tenant_category) ? t.tenant_category[0] : t.tenant_category,
						status: t.status,
					}))
				);
			}
			setLoading(false);
		};
		fetchTenants();
	}, []);

	return (
		<div id="tenants" className="w-full flex flex-col items-center p-4">
			{loading && <LoadingIndicator message="Memuat tenant..." />}
			<h1 className="text-2xl font-bold mb-6">Tenants</h1>
			{error && <div className="alert alert-error mb-2 py-2 px-4 text-sm">{error}</div>}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
				{loading ? (
					<div className="col-span-full text-center py-8">Loading...</div>
				) : tenants.length === 0 ? (
					<div className="col-span-full text-center py-8">Belum ada tenant</div>
				) : (
					tenants.map((tenant) => (
						<div key={tenant.id} className="card bg-base-200 shadow-md relative">
							{/* Indicator kategori tenant di tengah atas */}
							<span className="indicator absolute left-1/2 -translate-x-1/2 top-2 z-10">
								<span className="badge badge-info badge-sm indicator-item">
									{tenant.tenantCategory?.name}
								</span>
							</span>
							<figure>
								<Image 
									src={tenant.imageUrl || "https://picsum.photos/400/200?blur=2"}
									alt={tenant.name}
									className="w-full h-40 object-cover"
								/>
							</figure>
							<div className="card-body items-center text-left p-4 gap-2">
								<h2 className="card-title mb-1">
									{tenant.name}
								</h2>
								<p className="mb-1 text-sm text-base-content/80">
									{tenant.description}
								</p>
								<div className="flex w-full mb-1 justify-between items-center">
									<span className="badge badge-outline text-xs flex items-center gap-1">
										<svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m5-3a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										{tenant.openhour} - {tenant.closehour}
									</span>
									<button className="btn btn-primary btn-xs ml-auto">
										Lihat Menu
									</button>
								</div>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};
export default Tenants;