"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Tenant } from "@/types/tenant";
import AddTenant from "./addTenant";
import EditTenant from "./editTenant";
import { supabase } from "@/lib/supabase";
import LoadingIndicator from "@/components/ui/LoadingIndicator";

const TenantList = () => {
	const [tenants, setTenants] = useState<Tenant[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [showAdd, setShowAdd] = useState(false);
	const [editTenant, setEditTenant] = useState<Tenant | null>(null);
	const [actionLoading, setActionLoading] = useState(false);

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
		  status,
		  tenant_category ( id, name )
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
	}, [actionLoading]);

	const handleToggleStatus = async (tenant: Tenant) => {
		setActionLoading(true);
		await supabase
			.from("tenant")
			.update({ status: !tenant.status })
			.eq("id", tenant.id);
		setActionLoading(false);
	};

	// Pagination state
	const [page, setPage] = useState(1);
	const pageSize = 10;
	const totalPages = Math.ceil(tenants.length / pageSize);

	const paginatedTenants = tenants.slice((page - 1) * pageSize, page * pageSize);

	return (
		<div className="w-full max-w-6xl mx-auto p-4">
			{loading && <LoadingIndicator message="Memuat tenant..." />}
			<div className="flex justify-between items-center mb-4">
				<h2 className="text-xl font-bold">Daftar Tenant</h2>
				<div className="flex gap-2">
					<button
						className="btn btn-outline btn-info btn-sm"
						onClick={() => setShowAdd(true)}
					>
						+ Add Tenant
					</button>
				</div>
			</div>
			{error && (
				<div className="alert alert-error mb-2 py-2 px-4 text-sm">
					{error}
				</div>
			)}
			<div className="card bg-base-100 shadow-xl">
				<div className="card-body p-0">
					<div className="overflow-x-auto rounded-t-xl">
						<table className="table table-zebra w-full">
							<thead className="bg-base-200">
								<tr>
									<th>No</th>
									<th>Tenant</th>
									<th>Pemilik</th>
									<th>No. HP</th>
									<th>Jam Buka</th>
									<th>Jam Tutup</th>
									<th>Deskripsi</th>
									<th>Thumbnail</th>
									<th>QRIS</th>
									<th>Kategori</th>
									<th>Status</th>
									<th>Aksi</th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td colSpan={12} className="text-center py-8">
											<span className="loading loading-spinner loading-lg text-primary"></span>
										</td>
									</tr>
								) : paginatedTenants.length === 0 ? (
									<tr>
										<td colSpan={12} className="text-center py-8">
											Belum ada tenant
										</td>
									</tr>
								) : (
									paginatedTenants.map((tenant, idx) => (
										<tr key={tenant.id} className="hover:bg-base-200 transition-colors">
											<td>{(page - 1) * pageSize + idx + 1}</td>
											<td className="flex items-center gap-2">
												<div className="avatar">
													<div className="w-10 h-10 mask mask-squircle">
														<Image
															src={tenant.imageUrl || 'https://picsum.photos/40/40'}
															alt={tenant.name}
															className="object-cover"
														/>
													</div>
												</div>
												<span className="font-semibold">{tenant.name}</span>
											</td>
											<td>{tenant.owner}</td>
											<td>{tenant.phone}</td>
											<td>
												<span className="badge badge-outline badge-success badge-sm">
													{tenant.openhour}
												</span>
											</td>
											<td>
												<span className="badge badge-outline badge-error badge-sm">
													{tenant.closehour}
												</span>
											</td>
											<td>
												<span className="truncate max-w-xs block" title={tenant.description}>
													{tenant.description}
												</span>
											</td>
											<td>
												<div className="avatar">
													<div className="w-10 h-10 mask mask-squircle">
														<Image
															src={tenant.imageUrl || 'https://picsum.photos/40/40'}
															alt="thumbnail"
															className="object-cover"
														/>
													</div>
												</div>
											</td>
											<td>
												<div className="avatar">
													<div className="w-10 h-10 mask mask-squircle bg-base-200 flex items-center justify-center">
														{tenant.qrisUrl ? (
															<Image
																src={tenant.qrisUrl}
																alt="QRIS"
																className="object-cover"
															/>
														) : (
															<span className="text-xs text-base-content/50">-</span>
														)}
													</div>
												</div>
											</td>
											<td>
												{tenant.tenantCategory?.name ? (
													<span className="badge badge-info badge-sm">
														{tenant.tenantCategory.name}
													</span>
												) : (
													<span className="badge badge-ghost badge-sm">-</span>
												)}
											</td>
											<td>
												{tenant.status ? (
													<span className="badge badge-success">Aktif</span>
												) : (
													<span className="badge badge-error">Nonaktif</span>
												)}
											</td>
											<td className="flex gap-2">
												<button
													className="btn btn-info btn-xs"
													onClick={() => setEditTenant(tenant)}
												>
													Edit
												</button>
												<button
													className={`btn btn-xs ${tenant.status ? 'btn-error' : 'btn-success'}`}
													onClick={() => handleToggleStatus(tenant)}
													disabled={actionLoading}
												>
													{tenant.status ? 'Nonaktifkan' : 'Aktifkan'}
												</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="join mt-4 flex justify-center">
					<button
						className="join-item btn btn-sm"
						disabled={page === 1}
						onClick={() => setPage(page - 1)}
					>
						«
					</button>
					{Array.from({ length: totalPages }, (_, i) => (
						<button
							key={i}
							className={`join-item btn btn-sm ${page === i + 1 ? "btn-active" : ""}`}
							onClick={() => setPage(i + 1)}
						>
							{i + 1}
						</button>
					))}
					<button
						className="join-item btn btn-sm"
						disabled={page === totalPages}
						onClick={() => setPage(page + 1)}
					>
						»
					</button>
				</div>
			)}

			{/* Modal Add Tenant (bisa close) */}
			{showAdd && (
				<dialog open className="modal modal-right">
					<div className="modal-box w-full max-w-md">
						<AddTenant />
						<form method="dialog" className="modal-action mt-4">
							<button
								className="btn"
								onClick={() => setShowAdd(false)}
							>
								Tutup
							</button>
						</form>
					</div>
				</dialog>
			)}
			{/* Modal Edit Tenant */}
			{editTenant && (
				<dialog open className="modal modal-right">
					<div className="modal-box w-full max-w-md">
						<EditTenant tenant={editTenant} />
						<form method="dialog" className="modal-action mt-4">
							<button
								className="btn"
								onClick={() => setEditTenant(null)}
							>
								Tutup
							</button>
						</form>
					</div>
				</dialog>
			)}
		</div>
	);
};
export default TenantList;
